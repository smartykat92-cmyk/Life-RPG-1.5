// Small progress bar DOM helper for Vibe RPG.
// Uses the existing vrpg-bar/vrpg-fill classes and does not own data or behavior.

function createProgressBar(parent, percent, className = "") {
  const bar = parent.createDiv({ cls: `vrpg-bar ${className}`.trim() });
  bar.createDiv({ cls: "vrpg-fill", attr: { style: `width:${percent}%` } });
  return bar;
}

module.exports = {
  createProgressBar
};
