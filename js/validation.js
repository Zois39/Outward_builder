/**
 * Outward Skill Validation Engine
 * Checks whether a skill can be learned given current character build.
 */

/**
 * @typedef {import('./types.d.ts').Skill} Skill
 * @typedef {import('./types.d.ts').ClassTree} ClassTree
 * @typedef {import('./types.d.ts').CharacterBuild} CharacterBuild
 * @typedef {import('./types.d.ts').ValidationResult} ValidationResult
 */

const MAX_BREAKTHROUGH_POINTS = 3;

/**
 * Check if a skill can be learned.
 * @param {Skill} skill - The skill to check
 * @param {CharacterBuild} build - Current character build
 * @param {Map<string, Skill>} skillMap - All skills indexed by ID
 * @param {Map<string, ClassTree>} classMap - All classes indexed by ID
 * @returns {ValidationResult}
 */
function canLearnSkill(skill, build, skillMap, classMap) {
  const reasons = [];
  const conflicts = [];

  // ── 1. Class requirement ──────────────────────────────────────────
  if (skill.parentClass) {
    const classId = skill.parentClass.toLowerCase().replace(/\s+/g, '_');
    const hasClass = build.selectedClasses.includes(classId);
    if (!hasClass) {
      reasons.push(`Requires ${skill.parentClass} class`);
    }
  }

  // ── 2. Breakthrough Point cost ────────────────────────────────────
  if (skill.cost.breakthrough) {
    if (build.breakthroughPointsUsed >= MAX_BREAKTHROUGH_POINTS) {
      reasons.push(`No Breakthrough Points left (${MAX_BREAKTHROUGH_POINTS}/${MAX_BREAKTHROUGH_POINTS} used)`);
    }
    // Only one Breakthrough per tree
    if (skill.parentClass) {
      const classId = skill.parentClass.toLowerCase().replace(/\s+/g, '_');
      const tree = classMap.get(classId);
      if (tree && tree.skills.tier2.length > 0) {
        const existingBt = tree.skills.tier2[0];
        if (build.skills.includes(existingBt) && existingBt !== skill.id) {
          reasons.push(`Breakthrough already learned in ${skill.parentClass}`);
        }
      }
    }
  }

  // ── 3. Tier 3 requires Tier 2 in same tree ───────────────────────
  if (skill.tier === 3) {
    const classId = skill.parentClass?.toLowerCase().replace(/\s+/g, '_');
    const tree = classMap.get(classId);
    if (tree && tree.hasBreakthrough) {
      const tier2 = tree.skills.tier2;
      const hasTier2 = tier2.some(id => build.skills.includes(id));
      if (!hasTier2) {
        reasons.push(`Requires Breakthrough in ${skill.parentClass}`);
      }
    }
  }

  // ── 4. Prerequisite skills ────────────────────────────────────────
  const req = skill.requirements;
  if (req && req.skills.length > 0) {
    const met = req.logic === 'any'
      ? req.skills.some(id => build.skills.includes(id))
      : req.skills.every(id => build.skills.includes(id));

    if (!met) {
      const names = req.skills.map(id => skillMap.get(id)?.name || id);
      const joiner = req.logic === 'any' ? ' OR ' : ' AND ';
      reasons.push(`Requires: ${names.join(joiner)}`);
    }
  }

  // ── 5. Mutually exclusive skills ──────────────────────────────────
  if (skill.exclusiveGroup) {
    for (const learnedId of build.skills) {
      if (learnedId === skill.id) continue;
      const learned = skillMap.get(learnedId);
      if (learned && learned.exclusiveGroup === skill.exclusiveGroup) {
        conflicts.push(learnedId);
        reasons.push(`Mutually exclusive with ${learned.name}`);
      }
    }
  }

  return {
    canLearn: reasons.length === 0,
    reasons,
    conflicts
  };
}

/**
 * Get all skills that would be locked if this skill is learned.
 * @param {Skill} skill
 * @param {Map<string, Skill>} skillMap
 * @returns {string[]} - Skill IDs that conflict
 */
function getConflicts(skill, skillMap) {
  if (!skill.exclusiveGroup) return [];
  const conflicts = [];
  for (const [id, s] of skillMap) {
    if (id !== skill.id && s.exclusiveGroup === skill.exclusiveGroup) {
      conflicts.push(id);
    }
  }
  return conflicts;
}

/**
 * Calculate remaining Breakthrough Points.
 * @param {CharacterBuild} build
 * @returns {number}
 */
function getRemainingBreakthroughs(build) {
  return MAX_BREAKTHROUGH_POINTS - build.breakthroughPointsUsed;
}

/**
 * Check if learning a skill is a valid action (wrapper).
 * @param {string} skillId
 * @param {CharacterBuild} build
 * @param {Map<string, Skill>} skillMap
 * @param {Map<string, ClassTree>} classMap
 * @returns {ValidationResult}
 */
function validateLearnAction(skillId, build, skillMap, classMap) {
  const skill = skillMap.get(skillId);
  if (!skill) {
    return { canLearn: false, reasons: [`Unknown skill: ${skillId}`], conflicts: [] };
  }
  if (build.skills.includes(skillId)) {
    return { canLearn: false, reasons: ['Already learned'], conflicts: [] };
  }
  return canLearnSkill(skill, build, skillMap, classMap);
}

// Export for browser & Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    canLearnSkill,
    getConflicts,
    getRemainingBreakthroughs,
    validateLearnAction,
    MAX_BREAKTHROUGH_POINTS
  };
}
