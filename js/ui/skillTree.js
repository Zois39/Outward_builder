/**
 * Outward Skill Tree Renderer
 * Renders class trees with tier grouping and skill states.
 * Mobile-friendly: tap for tooltip, tap again to learn/unlearn.
 */

/**
 * @typedef {import('../types.d.ts').Skill} Skill
 * @typedef {import('../types.d.ts').ClassTree} ClassTree
 * @typedef {import('../types.d.ts').BuildState} BuildState
 */

/* ── Touch detection ─────────────────────────────────────────────── */

const isTouchDevice = ('ontouchstart' in window) ||
  (navigator.maxTouchPoints > 0) ||
  (navigator.msMaxTouchPoints > 0);

/**
 * Create a skill card element.
 * @param {Skill} skill
 * @param {BuildState} state
 * @param {Object} options
 * @param {boolean} [options.compact=false]
 * @returns {HTMLElement}
 */
function createSkillCard(skill, state, options = {}) {
  const card = document.createElement('div');
  const status = state.getSkillStatus(skill.id);

  card.className = `skill-card tier-${skill.tier} status-${status}`;
  card.dataset.skillId = skill.id;
  card.dataset.tier = skill.tier;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${skill.name}, Tier ${skill.tier}, ${status}`);

  // Image
  const imgWrap = document.createElement('div');
  imgWrap.className = 'skill-img';
  if (skill.image) {
    const img = document.createElement('img');
    img.src = skill.image;
    img.alt = skill.name;
    img.loading = 'lazy';
    img.onerror = () => { imgWrap.innerHTML = '<span class="no-img">?</span>'; };
    imgWrap.appendChild(img);
  } else {
    imgWrap.innerHTML = '<span class="no-img">?</span>';
  }

  // Info
  const info = document.createElement('div');
  info.className = 'skill-info';

  const name = document.createElement('div');
  name.className = 'skill-name';
  name.textContent = skill.name;
  info.appendChild(name);

  if (!options.compact) {
    const type = document.createElement('div');
    type.className = 'skill-type';
    type.textContent = [
      skill.skillType,
      skill.subtype && `· ${skill.subtype}`,
      skill.cost.silver > 0 && `· ${skill.cost.silver}s`,
      skill.cost.breakthrough && '· ⚡ Breakthrough'
    ].filter(Boolean).join(' ');
    info.appendChild(type);
  }

  // Tier badge
  const tierBadge = document.createElement('span');
  tierBadge.className = `tier-badge tier-${skill.tier}`;
  tierBadge.textContent = skill.tier === 'special' ? 'SP' : `T${skill.tier}`;
  card.appendChild(tierBadge);

  card.appendChild(imgWrap);
  card.appendChild(info);

  // Status indicator
  const statusIcon = document.createElement('span');
  statusIcon.className = 'status-icon';
  statusIcon.textContent = status === 'learned' ? '✓'
    : status === 'available' ? '○'
    : '🔒';
  card.appendChild(statusIcon);

  // ── Interaction ─────────────────────────────────────────────────

  let tooltipVisible = false;
  let lastTapTime = 0;

  function handleActivate() {
    const currentStatus = state.getSkillStatus(skill.id);

    if (currentStatus === 'learned') {
      state.unlearnSkill(skill.id);
      hideTooltip();
      tooltipVisible = false;
    } else if (currentStatus === 'available') {
      const result = state.learnSkill(skill.id);
      if (!result.ok) {
        showTooltip(card, result.reasons.join('\n'));
        tooltipVisible = true;
      } else {
        hideTooltip();
        tooltipVisible = false;
      }
    } else {
      // Locked — show reasons
      const check = canLearnSkill(skill, state.build, state.skillMap, state.classMap);
      showTooltip(card, check.reasons.join('\n'));
      tooltipVisible = true;
    }
  }

  function handleTooltipToggle() {
    if (tooltipVisible) {
      hideTooltip();
      tooltipVisible = false;
    } else {
      showSkillTooltip(card, skill, state);
      tooltipVisible = true;
    }
  }

  if (isTouchDevice) {
    // Touch: first tap = tooltip, second tap = action
    card.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent mouse emulation
      const now = Date.now();

      if (now - lastTapTime < 300 && tooltipVisible) {
        // Double-tap: activate
        handleActivate();
      } else {
        // Single tap: toggle tooltip
        handleTooltipToggle();
      }
      lastTapTime = now;
    }, { passive: false });
  } else {
    // Desktop: click = action, hover = tooltip
    card.addEventListener('click', handleActivate);
    card.addEventListener('mouseenter', () => {
      showSkillTooltip(card, skill, state);
    });
    card.addEventListener('mouseleave', () => {
      hideTooltip();
    });
  }

  // Keyboard support
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate();
    }
  });

  return card;
}

/**
 * Render a class tree panel.
 * @param {ClassTree} classTree
 * @param {BuildState} state
 * @returns {HTMLElement}
 */
function renderClassTree(classTree, state) {
  const panel = document.createElement('div');
  panel.className = 'class-tree-panel';
  panel.dataset.classId = classTree.id;

  // Header
  const header = document.createElement('div');
  header.className = 'class-header';

  if (classTree.image) {
    const img = document.createElement('img');
    img.src = classTree.image;
    img.className = 'class-icon';
    img.alt = classTree.name;
    img.onerror = () => { img.style.display = 'none'; };
    header.appendChild(img);
  }

  const headerText = document.createElement('div');
  headerText.className = 'class-header-text';

  const name = document.createElement('h3');
  name.textContent = classTree.name;
  if (classTree.isDlc) {
    const dlc = document.createElement('span');
    dlc.className = 'dlc-badge';
    dlc.textContent = 'DLC';
    name.appendChild(dlc);
  }
  headerText.appendChild(name);

  const teacher = document.createElement('div');
  teacher.className = 'class-teacher';
  teacher.textContent = `${classTree.teacher} · ${classTree.location}`;
  headerText.appendChild(teacher);

  header.appendChild(headerText);

  // Remove class button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn-remove-class';
  removeBtn.textContent = '×';
  removeBtn.title = 'Remove class';
  removeBtn.setAttribute('aria-label', `Remove ${classTree.name}`);
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`Remove ${classTree.name} and all its skills?`)) {
      state.deselectClass(classTree.id);
    }
  });
  header.appendChild(removeBtn);

  panel.appendChild(header);

  // Skills by tier
  const skills = state.getClassSkills(classTree.id);

  const tiersConfig = [
    { key: 'tier1', label: 'Tier 1 — Basic', tier: 1 },
    { key: 'tier2', label: 'Tier 2 — Breakthrough', tier: 2 },
    { key: 'tier3', label: 'Tier 3 — Advanced', tier: 3 }
  ];

  for (const tc of tiersConfig) {
    const tierSkills = skills[tc.key];
    if (tierSkills.length === 0) continue;

    const section = document.createElement('div');
    section.className = `tier-section tier-${tc.tier}`;

    const label = document.createElement('div');
    label.className = 'tier-label';
    label.textContent = tc.label;
    section.appendChild(label);

    const grid = document.createElement('div');
    grid.className = 'skill-grid';

    for (const skill of tierSkills) {
      grid.appendChild(createSkillCard(skill, state));
    }

    section.appendChild(grid);
    panel.appendChild(section);
  }

  return panel;
}

/**
 * Render special skills panel.
 * @param {BuildState} state
 * @returns {HTMLElement}
 */
function renderSpecialPanel(state) {
  const panel = document.createElement('div');
  panel.className = 'special-panel';

  const header = document.createElement('div');
  header.className = 'special-header';

  const title = document.createElement('h3');
  title.textContent = 'Special Skills';
  header.appendChild(title);

  const count = document.createElement('span');
  count.className = 'special-count';
  count.textContent = state.getSpecialSkills().length;
  header.appendChild(count);

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn-toggle-special';
  toggleBtn.textContent = '👁';
  toggleBtn.title = 'Toggle all visibility';
  toggleBtn.setAttribute('aria-label', 'Toggle special skills visibility');
  header.appendChild(toggleBtn);

  panel.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'skill-grid special-grid';

  const skills = state.getSpecialSkills();
  let visibleCount = 0;

  for (const skill of skills) {
    if (state.isSpecialHidden(skill.id)) continue;
    grid.appendChild(createSkillCard(skill, state, { compact: true }));
    visibleCount++;
  }

  if (visibleCount === 0) {
    const empty = document.createElement('div');
    empty.className = 'special-empty';
    empty.textContent = 'All special skills hidden';
    empty.style.cssText = 'padding: 20px; text-align: center; color: var(--text-dim);';
    grid.appendChild(empty);
  }

  panel.appendChild(grid);

  // Toggle all
  let allHidden = false;
  toggleBtn.addEventListener('click', () => {
    allHidden = !allHidden;
    for (const skill of skills) {
      const isHidden = state.isSpecialHidden(skill.id);
      if (allHidden && !isHidden) state.toggleSpecialHidden(skill.id);
      if (!allHidden && isHidden) state.toggleSpecialHidden(skill.id);
    }
  });

  return panel;
}

/**
 * Render the full builder UI.
 * @param {BuildState} state
 * @param {HTMLElement} container
 */
function renderBuilder(state, container) {
  container.innerHTML = '';

  // Breakthrough points indicator
  const btBar = document.createElement('div');
  btBar.className = 'breakthrough-bar';
  const used = state.build.breakthroughPointsUsed;
  const total = 3;

  const btLabel = document.createElement('span');
  btLabel.className = 'bt-label';
  btLabel.textContent = 'Breakthrough Points:';
  btBar.appendChild(btLabel);

  const btPips = document.createElement('span');
  btPips.className = 'bt-pips';
  for (let i = 0; i < total; i++) {
    const pip = document.createElement('span');
    pip.className = `bt-pip ${i < used ? 'used' : 'free'}`;
    pip.textContent = i < used ? '●' : '○';
    btPips.appendChild(pip);
  }
  btBar.appendChild(btPips);

  const btCount = document.createElement('span');
  btCount.className = 'bt-count';
  btCount.textContent = `${used}/${total}`;
  btBar.appendChild(btCount);

  container.appendChild(btBar);

  // Main layout
  const layout = document.createElement('div');
  layout.className = 'builder-layout';

  // Class selector (if < 3 classes)
  if (state.build.selectedClasses.length < 3) {
    const selector = renderClassSelector(state);
    layout.appendChild(selector);
  }

  // Selected class trees
  for (const classId of state.build.selectedClasses) {
    const cls = state.getClass(classId);
    if (cls) {
      layout.appendChild(renderClassTree(cls, state));
    }
  }

  // Special skills
  layout.appendChild(renderSpecialPanel(state));

  container.appendChild(layout);
}

/**
 * Render class selector dropdown.
 * @param {BuildState} state
 * @returns {HTMLElement}
 */
function renderClassSelector(state) {
  const wrap = document.createElement('div');
  wrap.className = 'class-selector';

  const label = document.createElement('label');
  label.textContent = 'Add Class:';
  wrap.appendChild(label);

  const select = document.createElement('select');
  select.className = 'class-select';
  select.setAttribute('aria-label', 'Select a class to add');

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '-- Choose a class --';
  select.appendChild(placeholder);

  for (const cls of state.data.classes) {
    if (state.build.selectedClasses.includes(cls.id)) continue;
    const opt = document.createElement('option');
    opt.value = cls.id;
    opt.textContent = cls.name + (cls.isDlc ? ' (DLC)' : '');
    select.appendChild(opt);
  }

  select.addEventListener('change', () => {
    if (select.value) {
      state.selectClass(select.value);
      select.value = '';
    }
  });

  wrap.appendChild(select);
  return wrap;
}

// ── Tooltip ─────────────────────────────────────────────────────────

let tooltipEl = null;
let tooltipAnchor = null;

function showSkillTooltip(anchor, skill, state) {
  hideTooltip();
  tooltipEl = document.createElement('div');
  tooltipEl.className = 'skill-tooltip';
  tooltipAnchor = anchor;

  const status = state.getSkillStatus(skill.id);
  const check = canLearnSkill(skill, state.build, state.skillMap, state.classMap);

  let reqHtml = '';
  if (skill.requirements.skills.length > 0) {
    const names = skill.requirements.skills.map(id =>
      state.getSkill(id)?.name || id
    );
    reqHtml = `<div class="tt-req">Requires: ${names.join(skill.requirements.logic === 'any' ? ' <b>OR</b> ' : ' <b>AND</b> ')}</div>`;
  }
  if (skill.requirements.quest) {
    reqHtml += `<div class="tt-req quest">Quest: ${skill.requirements.quest}</div>`;
  }

  const actionHint = isTouchDevice
    ? '<div class="tt-hint">Tap again to ' + (status === 'learned' ? 'unlearn' : 'learn') + '</div>'
    : '<div class="tt-hint">Click to ' + (status === 'learned' ? 'unlearn' : 'learn') + '</div>';

  tooltipEl.innerHTML = `
    <div class="tt-header">
      <b>${skill.name}</b>
      <span class="tt-tier">Tier ${skill.tier}</span>
    </div>
    <div class="tt-type">${skill.skillType}${skill.subtype ? ' · ' + skill.subtype : ''}</div>
    <div class="tt-desc">${skill.description}</div>
    ${skill.effects ? `<div class="tt-effects">${skill.effects.substring(0, 400)}${skill.effects.length > 400 ? '...' : ''}</div>` : ''}
    ${reqHtml}
    ${skill.cost.silver > 0 ? `<div class="tt-cost">Cost: ${skill.cost.silver} silver</div>` : ''}
    ${skill.cost.breakthrough ? '<div class="tt-cost bt">⚡ Costs 1 Breakthrough Point</div>' : ''}
    ${skill.exclusiveGroup ? '<div class="tt-exclusive">⚠ Mutually exclusive choice</div>' : ''}
    ${status === 'locked' && check.reasons.length > 0
      ? `<div class="tt-locked">🔒 ${check.reasons.join('<br>')}</div>`
      : ''}
    <div class="tt-trainer">${skill.trainer}${skill.location ? ' · ' + skill.location : ''}</div>
    ${actionHint}
  `;

  document.body.appendChild(tooltipEl);
  positionTooltip(anchor, tooltipEl);
}

function showTooltip(anchor, text) {
  hideTooltip();
  tooltipEl = document.createElement('div');
  tooltipEl.className = 'skill-tooltip simple';
  tooltipEl.textContent = text;
  tooltipAnchor = anchor;
  document.body.appendChild(tooltipEl);
  positionTooltip(anchor, tooltipEl);
}

function hideTooltip() {
  if (tooltipEl) {
    tooltipEl.remove();
    tooltipEl = null;
    tooltipAnchor = null;
  }
}

function positionTooltip(anchor, tip) {
  // Wait for element to be in DOM to get proper dimensions
  requestAnimationFrame(() => {
    if (!tip || !tip.isConnected) return;

    const rect = anchor.getBoundingClientRect();
    tip.style.position = 'fixed';
    tip.style.zIndex = '1000';

    const tipRect = tip.getBoundingClientRect();
    const margin = 8;

    // Default: above the card, centered
    let top = rect.top - tipRect.height - margin;
    let left = rect.left + rect.width / 2 - tipRect.width / 2;

    // Flip below if not enough space above
    if (top < margin) {
      top = rect.bottom + margin;
    }

    // Clamp horizontally to viewport
    left = Math.max(margin, Math.min(left, window.innerWidth - tipRect.width - margin));

    // Clamp vertically
    top = Math.max(margin, Math.min(top, window.innerHeight - tipRect.height - margin));

    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
  });
}

// Close tooltip on outside tap/click
if (isTouchDevice) {
  document.addEventListener('touchstart', (e) => {
    if (tooltipEl && tooltipAnchor && !tooltipAnchor.contains(e.target) && !tooltipEl.contains(e.target)) {
      hideTooltip();
    }
  }, { passive: true });
} else {
  document.addEventListener('click', (e) => {
    if (tooltipEl && tooltipAnchor && !tooltipAnchor.contains(e.target) && !tooltipEl.contains(e.target)) {
      hideTooltip();
    }
  });
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createSkillCard,
    renderClassTree,
    renderSpecialPanel,
    renderBuilder,
    renderClassSelector,
    isTouchDevice
  };
}
