/**
 * Outward Character Builder — Main Entry Point
 */

let state = null;

/**
 * Initialize the builder.
 */
async function initBuilder() {
  // Load data
  const response = await fetch('data/skills.json');
  const data = await response.json();

  // Create state
  state = new BuildState(data);

  // Render initial UI
  const container = document.getElementById('builder-root');
  if (container) {
    renderBuilder(state, container);
  }

  // Subscribe to changes
  state.subscribe(() => {
    if (container) renderBuilder(state, container);
    updateStats();
  });

  // Wire toolbar buttons
  wireToolbar();

  // Initial stats
  updateStats();

  console.log(`Outward Builder loaded: ${data.skills.length} skills, ${data.classes.length} classes`);
}

/**
 * Update stats bar.
 */
function updateStats() {
  const el = document.getElementById('build-stats');
  if (!el || !state) return;

  const totalCost = state.getTotalCost();
  const skillCount = state.build.skills.length;
  const btUsed = state.build.breakthroughPointsUsed;

  el.innerHTML = `
    <span class="stat">Skills: <b>${skillCount}</b></span>
    <span class="stat">Cost: <b>${totalCost}s</b></span>
    <span class="stat">Breakthroughs: <b>${btUsed}/3</b></span>
  `;
}

/**
 * Wire toolbar buttons.
 */
function wireToolbar() {
  const btnExport = document.getElementById('btn-export');
  const btnImport = document.getElementById('btn-import');
  const btnReset = document.getElementById('btn-reset');
  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');

  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const json = state.serialize();
      navigator.clipboard.writeText(json).then(() => {
        btnExport.textContent = 'Copied!';
        setTimeout(() => { btnExport.textContent = 'Export'; }, 1500);
      });
    });
  }

  if (btnImport) {
    btnImport.addEventListener('click', () => {
      const json = prompt('Paste build JSON:');
      if (json) {
        const ok = state.deserialize(json);
        if (!ok) alert('Invalid build data');
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Reset entire build?')) state.reset();
    });
  }

  if (btnUndo) {
    btnUndo.addEventListener('click', () => state.undo());
  }

  if (btnRedo) {
    btnRedo.addEventListener('click', () => state.redo());
  }
}

// Boot
document.addEventListener('DOMContentLoaded', initBuilder);
