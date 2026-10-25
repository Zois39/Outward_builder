/**
 * SDD Builder v2 — integrates new skill data with original logic.js
 * 
 * Strategy:
 * 1. Load data/skills.json asynchronously
 * 2. Build SDD structure expected by logic.js
 * 3. Override rS() to use new data with validation
 * 4. Keep original tabs working
 */

(function() {
  'use strict';

  // State for new skill system
  const SkillState = {
    selected: new Set(),        // Selected skill IDs
    breakthroughs: new Set(),   // Used breakthrough points (max 3)
    pairs: {},                  // pair group -> selected skill id
    data: null,                 // Loaded JSON data
    sdd: null                   // Built SDD structure
  };

  // Load data immediately
  const dataPromise = fetch('data/skills.json')
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(data => {
      SkillState.data = data;
      SkillState.sdd = buildSDD(data);
      window.SDD = SkillState.sdd;  // Provide for original code
      console.log('[SDD Builder] Loaded:', Object.keys(SDD).length, 'trainers');

      // Re-render if original rS already ran
      if (typeof rS === 'function') {
        rS();
      }
    })
    .catch(err => {
      console.error('[SDD Builder] Failed to load skills.json:', err);
      // Fallback to legacy SKILLS
      if (typeof SKILLS !== 'undefined') {
        window.SDD = buildSDDFromLegacy(SKILLS);
        console.log('[SDD Builder] Using legacy SKILLS fallback');
      }
    });

  function slugify(name) {
    return name.toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  function buildSDD(data) {
    const sdd = {};

    // Build trainer entries from classes
    data.classes.forEach(cls => {
      const key = cls.id;

      sdd[key] = {
        name: cls.name,
        ru: cls.teacher || cls.name,
        tr: cls.location || '',
        sk: []
      };

      // Add skills by tier
      ['tier1', 'tier2', 'tier3'].forEach((tierKey, idx) => {
        cls.skills[tierKey].forEach(skillId => {
          const skill = data.skills.find(s => s.id === skillId);
          if (skill) {
            sdd[key].sk.push(transformSkill(skill, idx + 1));
          }
        });
      });
    });

    // Add special skills
    if (data.specialSkills && data.specialSkills.length > 0) {
      sdd['special'] = {
        name: 'Special Skills',
        ru: 'Особые навыки',
        tr: 'Квесты, тренеры, фракции',
        sk: []
      };

      data.specialSkills.forEach(skillId => {
        const skill = data.skills.find(s => s.id === skillId);
        if (skill) {
          sdd['special'].sk.push(transformSkill(skill, 'special'));
        }
      });
    }

    return sdd;
  }

  function transformSkill(skill, tier) {
    // Build cost string
    let cost = '';
    if (skill.cost) {
      if (skill.cost.breakthrough) {
        cost = '⚡ Breakthrough';
        if (skill.cost.silver > 0) cost += ` + ${skill.cost.silver}s`;
      } else if (skill.cost.silver > 0) {
        cost = `${skill.cost.silver}s`;
      }
    }

    return {
      id: skill.id,
      n: skill.name,
      ru: skill.description || '',
      img: skill.image || '',
      t: tier,
      c: cost,
      d: skill.effects || skill.description || '',
      tr: skill.trainer || '',
      pair: skill.exclusiveGroup || null,
      active: skill.skillType === 'Active',
      passive: skill.skillType === 'Passive',
      // Internal fields for validation
      _tier: skill.tier,
      _req: skill.requirements || { skills: [], logic: 'all' },
      _exclusive: skill.exclusiveGroup || null,
      _parentClass: skill.parentClass || null,
      _breakthrough: skill.cost?.breakthrough || false
    };
  }

  function buildSDDFromLegacy(skills) {
    const sdd = {};

    skills.forEach(s => {
      let trainer = 'Unknown';
      if (s.tr) {
        const match = s.tr.match(/\[\[(.*?)\]\]/);
        if (match) trainer = match[1];
      }

      if (!sdd[trainer]) {
        sdd[trainer] = { name: trainer, ru: trainer, tr: '', sk: [] };
      }

      sdd[trainer].sk.push({
        id: s.id, n: s.n, ru: s.ru || '', img: s.img || '',
        t: s.t || 1, c: s.c || '', d: s.d || '', tr: s.tr || '',
        pair: s.pair || null,
        active: s.t === 'active', passive: s.t === 'passive'
      });
    });

    return sdd;
  }

  // ===== VALIDATION =====

  function canSelectSkill(skill) {
    // Check if already selected
    if (SkillState.selected.has(skill.id)) {
      return { ok: false, reason: 'Already selected' };
    }

    // Check breakthrough points
    if (skill._breakthrough && SkillState.breakthroughs.size >= 3) {
      return { ok: false, reason: 'No breakthrough points left (3/3)' };
    }

    // Check pair conflicts
    if (skill.pair && SkillState.pairs[skill.pair] && SkillState.pairs[skill.pair] !== skill.id) {
      const other = SkillState.pairs[skill.pair];
      return { ok: false, reason: `Mutually exclusive with ${other}` };
    }

    // Check prerequisites
    if (skill._req && skill._req.skills && skill._req.skills.length > 0) {
      const req = skill._req;
      const hasAll = req.logic === 'all' 
        ? req.skills.every(id => SkillState.selected.has(id))
        : req.skills.some(id => SkillState.selected.has(id));

      if (!hasAll) {
        const names = req.skills.map(id => {
          const s = SkillState.data?.skills.find(x => x.id === id);
          return s ? s.name : id;
        });
        return { 
          ok: false, 
          reason: `Requires: ${names.join(req.logic === 'any' ? ' OR ' : ' AND ')}` 
        };
      }
    }

    return { ok: true };
  }

  function selectSkill(skillId) {
    const skill = findSkill(skillId);
    if (!skill) return;

    const check = canSelectSkill(skill);
    if (!check.ok) {
      // Show tooltip or flash
      console.warn('[Skill]', skill.n, '-', check.reason);
      return;
    }

    SkillState.selected.add(skillId);

    if (skill._breakthrough) {
      SkillState.breakthroughs.add(skillId);
    }

    if (skill.pair) {
      SkillState.pairs[skill.pair] = skillId;
    }

    // Add to pool for slot assignment
    if (typeof S !== 'undefined') {
      S.pool.push({
        id: skill.id, n: skill.n, ru: skill.ru,
        ic: skill.img ? '' : '✨', d: skill.d, src: 'skill'
      });
    }

    renderSkills();
  }

  function deselectSkill(skillId) {
    const skill = findSkill(skillId);
    if (!skill) return;

    SkillState.selected.delete(skillId);

    if (skill._breakthrough) {
      SkillState.breakthroughs.delete(skillId);
    }

    if (skill.pair && SkillState.pairs[skill.pair] === skillId) {
      delete SkillState.pairs[skill.pair];
    }

    // Remove from pool
    if (typeof S !== 'undefined') {
      S.pool = S.pool.filter(x => x.id !== skillId);
    }

    // Cascade: remove skills that require this one
    if (SkillState.data) {
      const dependents = SkillState.data.skills.filter(s => 
        s.requirements?.skills?.includes(skillId)
      );
      dependents.forEach(dep => {
        if (SkillState.selected.has(dep.id)) {
          deselectSkill(dep.id);
        }
      });
    }

    renderSkills();
  }

  function findSkill(id) {
    if (!SkillState.sdd) return null;

    for (const key of Object.keys(SkillState.sdd)) {
      const found = SkillState.sdd[key].sk.find(s => s.id === id);
      if (found) return found;
    }
    return null;
  }

  // ===== RENDERING =====

  function renderSkills() {
    const container = document.getElementById('sCt');
    if (!container || !SkillState.sdd) return;

    const select = document.getElementById('sTr');
    const filter = select ? select.value : 'all';

    // Check if all breakthroughs used
    const btUsed = SkillState.breakthroughs.size;
    const btMaxed = btUsed >= 3;

    let html = '';
    const trainers = filter === 'all' ? Object.keys(SkillState.sdd) : [filter];

    trainers.forEach(key => {
      const trainer = SkillState.sdd[key];

      // Check if this trainer has a selected tier 2
      const hasTier2 = trainer.sk.some(s => s.t === 2 && SkillState.selected.has(s.id));

      // If breakthroughs maxed and no tier 2 selected, hide tier 2 and 3
      const hideAdvanced = btMaxed && !hasTier2;

      html += `<div class="ow-tree${hideAdvanced ? ' trainer-locked' : ''}">`;
      html += `<h4>${esc(trainer.name)}</h4>`;
      html += `<div class="tr">${esc(trainer.tr)}</div>`;

      // Group by tier
      const tiers = { 1: [], 2: [], 3: [], special: [] };
      trainer.sk.forEach(s => {
        const t = s.t === 'special' ? 'special' : s.t;
        if (tiers[t]) tiers[t].push(s);
      });

      // Hide tier 2 and 3 if needed
      if (hideAdvanced) {
        tiers[2] = [];
        tiers[3] = [];
      }

      // Render tiers
      const tierLabels = { 1: 'TIER 1', 2: 'TIER 2 — BREAKTHROUGH', 3: 'TIER 3', special: 'SPECIAL' };

      Object.entries(tiers).forEach(([tier, skills]) => {
        if (skills.length === 0) return;

        html += `<div style="color:#8b7355;font-size:.7em;margin:8px 0 4px">${tierLabels[tier]}</div>`;

        // Group pairs together
        const pairs = {};
        const unpaired = [];

        skills.forEach(s => {
          if (s.pair) {
            if (!pairs[s.pair]) pairs[s.pair] = [];
            pairs[s.pair].push(s);
          } else {
            unpaired.push(s);
          }
        });

        // Render unpaired
        unpaired.forEach(s => {
          html += renderSkillCard(s);
        });

        // Render pairs
        Object.values(pairs).forEach(pairSkills => {
          html += `<div class="ow-pair">`;
          html += `<div class="ow-pair-title">Выбор (взаимоисключающие)</div>`;
          pairSkills.forEach(s => {
            html += renderSkillCard(s);
          });
          html += `</div>`;
        });
      });

      html += `</div>`;
    });

    container.innerHTML = html;

    // Attach click handlers
    container.querySelectorAll('.ow-sk').forEach(el => {
      el.addEventListener('click', () => {
        const sid = el.dataset.sid;
        if (SkillState.selected.has(sid)) {
          deselectSkill(sid);
        } else {
          selectSkill(sid);
        }
      });
    });

    // Update counters
    updateCounters();
  }

  function renderSkillCard(s) {
    const isSelected = SkillState.selected.has(s.id);
    const isLocked = !isSelected && !canSelectSkill(s).ok;
    const check = isSelected ? { ok: true } : canSelectSkill(s);

    let statusClass = '';
    if (isSelected) statusClass = ' status-learned';
    else if (isLocked) statusClass = ' status-locked';

    const tierClass = `tier-${s.t}`;

    let reqHtml = '';
    if (!check.ok && check.reason) {
      reqHtml = `<div class="req-missing">🔒 ${esc(check.reason)}</div>`;
    }

    let badge = '';
    if (s.active) badge = `<span style="background:#e74c3c;color:#fff;padding:1px 5px;font-size:.55em;border-radius:2px;margin-right:4px">АКТИВ</span>`;
    else if (s.passive) badge = `<span style="background:#27ae60;color:#fff;padding:1px 5px;font-size:.55em;border-radius:2px;margin-right:4px">ПАССИВ</span>`;

    const tierLabel = s.t === 'special' ? 'SP' : `T${s.t}`;

    return `
      <div class="ow-sk ${tierClass}${statusClass}" data-sid="${s.id}" title="${esc(s.ru || s.n)}">
        <div class="ic">${s.img ? `<img src="${s.img}" style="width:24px;height:24px;object-fit:contain" onerror="this.style.display='none';this.parentNode.textContent='✨'">` : '✨'}</div>
        <div class="in">
          <div class="nm">${badge}${esc(s.n)}</div>
          <div class="ds">${esc(s.d.substring(0, 80))}${s.d.length > 80 ? '...' : ''}</div>
          ${reqHtml}
        </div>
        <span class="tb t${s.t === 'special' ? 1 : s.t}">${tierLabel}</span>
        <span class="cs">${esc(s.c)}</span>
      </div>
    `;
  }

  function updateCounters() {
    // Skill count
    const sCn = document.getElementById('sCn');
    if (sCn) sCn.textContent = SkillState.selected.size;

    // Breakthrough count
    const btCn = document.getElementById('btCn');
    if (btCn) btCn.textContent = SkillState.breakthroughs.size;

    // Warning
    const btW = document.getElementById('btW');
    if (btW) btW.style.display = SkillState.breakthroughs.size >= 3 ? 'block' : 'none';
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = String(s || '');
    return d.innerHTML;
  }

  // ===== INTEGRATION =====

  // Wait for DOM and logic.js to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Populate trainer select
    dataPromise.then(() => {
      const select = document.getElementById('sTr');
      if (!select || !SkillState.sdd) return;

      // Clear existing options except "all"
      select.innerHTML = '<option value="all">Все тренеры</option>';

      Object.keys(SkillState.sdd).forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = SkillState.sdd[key].name;
        select.appendChild(opt);
      });

      // Attach change handler
      select.addEventListener('change', renderSkills);

      // Initial render
      renderSkills();
    });

    // Override global rS to use our renderer
    window.rS = renderSkills;
  }

})();
