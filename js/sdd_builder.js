/**
 * SDD Builder — constructs SDD structure from new data format
 * Loaded BEFORE logic.js, provides window.SDD for original code
 */

(function() {
  'use strict';

  // Build SDD synchronously from embedded data
  // We'll fetch async but also provide a sync fallback

  window.SDD = window.SDD || {};

  // Load data and build SDD
  fetch('data/skills.json')
    .then(r => {
      if (!r.ok) throw new Error('Failed to load skills.json');
      return r.json();
    })
    .then(data => {
      window.SDD = buildSDD(data);
      window.SKILLS_FLAT = buildFlatSkills(data);
      console.log(`SDD built: ${Object.keys(window.SDD).length} trainers`);

      // Trigger re-render if logic.js already loaded
      if (typeof rS === 'function') {
        rS();
      }
    })
    .catch(err => {
      console.error('SDD Builder error:', err);
      // Fallback: build from SKILLS if available
      if (typeof SKILLS !== 'undefined') {
        window.SDD = buildSDDFromLegacy(SKILLS);
        window.SKILLS_FLAT = SKILLS;
        if (typeof rS === 'function') rS();
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

    // Build from classes
    data.classes.forEach(cls => {
      const key = cls.id; // e.g. "cabal_hermit"

      sdd[key] = {
        name: cls.name,
        ru: cls.teacher || cls.name,
        tr: cls.location || '',
        sk: []
      };

      // Add tier 1 skills
      cls.skills.tier1.forEach(skillId => {
        const skill = data.skills.find(s => s.id === skillId);
        if (skill) sdd[key].sk.push(transformSkill(skill, 1));
      });

      // Add tier 2 (breakthrough)
      cls.skills.tier2.forEach(skillId => {
        const skill = data.skills.find(s => s.id === skillId);
        if (skill) sdd[key].sk.push(transformSkill(skill, 2));
      });

      // Add tier 3
      cls.skills.tier3.forEach(skillId => {
        const skill = data.skills.find(s => s.id === skillId);
        if (skill) sdd[key].sk.push(transformSkill(skill, 3));
      });
    });

    // Add special skills as pseudo-trainer
    if (data.specialSkills && data.specialSkills.length > 0) {
      sdd['special'] = {
        name: 'Special Skills',
        ru: 'Особые навыки',
        tr: 'Квесты, тренеры, фракции',
        sk: []
      };

      data.specialSkills.forEach(skillId => {
        const skill = data.skills.find(s => s.id === skillId);
        if (skill) sdd['special'].sk.push(transformSkill(skill, 'special'));
      });
    }

    return sdd;
  }

  function transformSkill(skill, tier) {
    // Determine pair group for mutually exclusive skills
    let pair = null;
    if (skill.exclusiveGroup) {
      pair = skill.exclusiveGroup;
    }

    // Format cost string
    let cost = '';
    if (skill.cost) {
      if (skill.cost.breakthrough) {
        cost = '1 Breakthrough';
        if (skill.cost.silver > 0) cost += `, ${skill.cost.silver}s`;
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
      pair: pair,
      active: skill.skillType === 'Active',
      passive: skill.skillType === 'Passive',
      // Additional fields for validation
      _req: skill.requirements || { skills: [], logic: 'all' },
      _exclusive: skill.exclusiveGroup || null,
      _parentClass: skill.parentClass || null
    };
  }

  function buildFlatSkills(data) {
    // Also provide flat SKILLS array for compatibility
    return data.skills.map(s => ({
      id: s.id,
      n: s.name,
      ru: s.description || '',
      img: s.image || '',
      t: s.tier,
      c: s.cost?.silver ? `${s.cost.silver}s` : '',
      d: s.effects || s.description || '',
      tr: s.trainer || '',
      pair: s.exclusiveGroup || null,
      active: s.skillType === 'Active',
      passive: s.skillType === 'Passive'
    }));
  }

  function buildSDDFromLegacy(skills) {
    // Fallback: build SDD from legacy SKILLS array
    const sdd = {};

    skills.forEach(s => {
      // Extract trainer from tr field: "[[Trainer Name]]"
      let trainer = 'Unknown';
      if (s.tr) {
        const match = s.tr.match(/\[\[(.*?)\]\]/);
        if (match) trainer = match[1];
      }

      if (!sdd[trainer]) {
        sdd[trainer] = {
          name: trainer,
          ru: trainer,
          tr: '',
          sk: []
        };
      }

      sdd[trainer].sk.push({
        id: s.id,
        n: s.n,
        ru: s.ru || '',
        img: s.img || '',
        t: s.t || 1,
        c: s.c || '',
        d: s.d || '',
        tr: s.tr || '',
        pair: s.pair || null,
        active: s.t === 'active',
        passive: s.t === 'passive'
      });
    });

    return sdd;
  }

})();
