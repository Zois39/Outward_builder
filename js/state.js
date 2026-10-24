/**
 * Outward Character Builder — State Management
 * Handles build state, skill learn/unlearn, undo/redo.
 */

/**
 * @typedef {import('./types.d.ts').CharacterBuild} CharacterBuild
 * @typedef {import('./types.d.ts').Skill} Skill
 * @typedef {import('./types.d.ts').ClassTree} ClassTree
 */

class BuildState {
  /**
   * @param {OutwardData} data - Parsed game data
   */
  constructor(data) {
    this.data = data;
    this.skillMap = new Map(data.skills.map(s => [s.id, s]));
    this.classMap = new Map(data.classes.map(c => [c.id, c]));

    /** @type {CharacterBuild} */
    this.build = {
      selectedClasses: [],
      skills: [],
      breakthroughPointsUsed: 0
    };

    /** @type {CharacterBuild[]} */
    this.history = [];
    /** @type {CharacterBuild[]} */
    this.future = [];

    /** @type {Set<string>} */
    this.hiddenSpecials = new Set();

    this.listeners = [];
  }

  // ── Data access ───────────────────────────────────────────────────

  getSkill(id) { return this.skillMap.get(id); }
  getClass(id) { return this.classMap.get(id); }

  getClassSkills(classId) {
    const tree = this.classMap.get(classId);
    if (!tree) return { tier1: [], tier2: [], tier3: [] };
    return {
      tier1: tree.skills.tier1.map(id => this.skillMap.get(id)).filter(Boolean),
      tier2: tree.skills.tier2.map(id => this.skillMap.get(id)).filter(Boolean),
      tier3: tree.skills.tier3.map(id => this.skillMap.get(id)).filter(Boolean)
    };
  }

  getSpecialSkills() {
    return this.data.specialSkills
      .map(id => this.skillMap.get(id))
      .filter(Boolean);
  }

  // ── Class selection ───────────────────────────────────────────────

  /**
   * Select a class (adds to build).
   * @param {string} classId
   * @returns {{ok: boolean, reason?: string}}
   */
  selectClass(classId) {
    if (this.build.selectedClasses.includes(classId)) {
      return { ok: false, reason: 'Class already selected' };
    }
    if (this.build.selectedClasses.length >= 3) {
      return { ok: false, reason: 'Maximum 3 classes (Breakthrough limit)' };
    }
    this._saveHistory();
    this.build.selectedClasses.push(classId);
    this._notify();
    return { ok: true };
  }

  /**
   * Deselect a class and remove its skills.
   * @param {string} classId
   */
  deselectClass(classId) {
    const idx = this.build.selectedClasses.indexOf(classId);
    if (idx === -1) return;

    this._saveHistory();
    this.build.selectedClasses.splice(idx, 1);

    // Remove all skills from this class
    const tree = this.classMap.get(classId);
    if (tree) {
      const allTreeSkills = [
        ...tree.skills.tier1,
        ...tree.skills.tier2,
        ...tree.skills.tier3
      ];
      this.build.skills = this.build.skills.filter(id => !allTreeSkills.includes(id));
      this._recalcBreakthroughs();
    }
    this._notify();
  }

  // ── Skill learning ────────────────────────────────────────────────

  /**
   * Learn a skill.
   * @param {string} skillId
   * @returns {{ok: boolean, reasons?: string[]}}
   */
  learnSkill(skillId) {
    const skill = this.skillMap.get(skillId);
    if (!skill) return { ok: false, reasons: ['Unknown skill'] };
    if (this.build.skills.includes(skillId)) return { ok: false, reasons: ['Already learned'] };

    const result = canLearnSkill(skill, this.build, this.skillMap, this.classMap);
    if (!result.canLearn) return { ok: false, reasons: result.reasons };

    this._saveHistory();
    this.build.skills.push(skillId);
    if (skill.cost.breakthrough) {
      this.build.breakthroughPointsUsed++;
    }
    this._notify();
    return { ok: true };
  }

  /**
   * Unlearn a skill. Also unlearns skills that depend on it.
   * @param {string} skillId
   * @returns {{removed: string[]}} - All removed skill IDs
   */
  unlearnSkill(skillId) {
    if (!this.build.skills.includes(skillId)) return { removed: [] };

    this._saveHistory();

    const removed = [skillId];
    this.build.skills = this.build.skills.filter(id => id !== skillId);

    // Cascade: remove skills that require this one
    let changed = true;
    while (changed) {
      changed = false;
      for (const id of [...this.build.skills]) {
        const s = this.skillMap.get(id);
        if (!s) continue;
        const req = s.requirements;
        if (req.skills.length > 0) {
          const stillValid = req.logic === 'any'
            ? req.skills.some(rid => this.build.skills.includes(rid))
            : req.skills.every(rid => this.build.skills.includes(rid));
          if (!stillValid) {
            this.build.skills = this.build.skills.filter(x => x !== id);
            removed.push(id);
            changed = true;
          }
        }
      }
    }

    this._recalcBreakthroughs();
    this._notify();
    return { removed };
  }

  // ── Queries ───────────────────────────────────────────────────────

  /**
   * Get skill status for UI.
   * @param {string} skillId
   * @returns {'learned'|'available'|'locked'|'blocked'}
   */
  getSkillStatus(skillId) {
    if (this.build.skills.includes(skillId)) return 'learned';
    const skill = this.skillMap.get(skillId);
    if (!skill) return 'locked';
    const result = canLearnSkill(skill, this.build, this.skillMap, this.classMap);
    return result.canLearn ? 'available' : 'locked';
  }

  /**
   * Get all skills grouped by class for display.
   * @returns {Array<{class: ClassTree, skills: {tier1: Skill[], tier2: Skill[], tier3: Skill[]}}>}
   */
  getBuildTree() {
    return this.build.selectedClasses.map(classId => {
      const cls = this.classMap.get(classId);
      return {
        class: cls,
        skills: this.getClassSkills(classId)
      };
    });
  }

  /**
   * Get total silver cost of current build.
   * @returns {number}
   */
  getTotalCost() {
    return this.build.skills.reduce((sum, id) => {
      const s = this.skillMap.get(id);
      return sum + (s?.cost.silver || 0);
    }, 0);
  }

  // ── Undo/Redo ─────────────────────────────────────────────────────

  undo() {
    if (this.history.length === 0) return false;
    this.future.push(JSON.parse(JSON.stringify(this.build)));
    this.build = this.history.pop();
    this._notify();
    return true;
  }

  redo() {
    if (this.future.length === 0) return false;
    this.history.push(JSON.parse(JSON.stringify(this.build)));
    this.build = this.future.pop();
    this._notify();
    return true;
  }

  // ── Special skills visibility ─────────────────────────────────────

  toggleSpecialHidden(skillId) {
    if (this.hiddenSpecials.has(skillId)) {
      this.hiddenSpecials.delete(skillId);
    } else {
      this.hiddenSpecials.add(skillId);
    }
    this._notify();
  }

  isSpecialHidden(skillId) {
    return this.hiddenSpecials.has(skillId);
  }

  // ── Import/Export ─────────────────────────────────────────────────

  serialize() {
    return JSON.stringify(this.build);
  }

  deserialize(json) {
    try {
      const data = JSON.parse(json);
      this._saveHistory();
      this.build = {
        selectedClasses: data.selectedClasses || [],
        skills: data.skills || [],
        breakthroughPointsUsed: data.breakthroughPointsUsed || 0
      };
      this._notify();
      return true;
    } catch {
      return false;
    }
  }

  reset() {
    this._saveHistory();
    this.build = { selectedClasses: [], skills: [], breakthroughPointsUsed: 0 };
    this._notify();
  }

  // ── Internal ──────────────────────────────────────────────────────

  _saveHistory() {
    this.history.push(JSON.parse(JSON.stringify(this.build)));
    if (this.history.length > 50) this.history.shift();
    this.future = [];
  }

  _recalcBreakthroughs() {
    this.build.breakthroughPointsUsed = this.build.skills.filter(id => {
      const s = this.skillMap.get(id);
      return s?.cost.breakthrough;
    }).length;
  }

  _notify() {
    for (const fn of this.listeners) fn(this.build);
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      const i = this.listeners.indexOf(fn);
      if (i > -1) this.listeners.splice(i, 1);
    };
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BuildState };
}
