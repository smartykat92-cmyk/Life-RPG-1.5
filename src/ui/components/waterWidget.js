// Water widget DOM component for Vibe RPG.
// Receives prepared stats and callbacks; does not read data, save, render, or show notices.

function renderWaterWidget(parent, options = {}) {
  const stats = options.stats || {};
  const title = options.title || "Water";
  const mode = options.mode || "ring";
  const className = options.className || (mode === "panel" ? "vrpg-panel vrpg-water-panel" : "vrpg-glass-widget vrpg-water-widget");
  const root = parent.createDiv({ cls: className });

  if (mode === "ring" || mode === "compact") {
    root.createDiv({ cls: "vrpg-kicker", text: title });
    const waterRing = root.createDiv({
      cls: "vrpg-water-ring",
      attr: { style: `--water:${stats.percent}%` }
    });
    waterRing.createDiv({ cls: "vrpg-water-value", text: `${stats.value}/${stats.goal}` });
    root.createDiv({
      cls: "vrpg-subtitle",
      text: `${Math.round(stats.currentMl / 100) / 10}/${Math.round(stats.targetMl / 100) / 10} L today`
    });
    const controls = root.createDiv({ cls: "vrpg-water-controls" });
    const minus = controls.createEl("button", { text: "-" });
    minus.onclick = options.onDecrement;
    const plus = controls.createEl("button", { text: "+" });
    plus.onclick = options.onIncrement;
  }

  if (mode === "panel") {
    root.createDiv({ cls: "vrpg-section", text: title });
    const waterLine = root.createDiv({ cls: "vrpg-water-line" });
    waterLine.createDiv({ cls: "vrpg-card-title", text: `${stats.value}/${stats.goal} glasses` });
    waterLine.createDiv({ cls: "vrpg-subtitle", text: `${stats.percent}% · ${stats.glassMl} ml glass` });
    const waterBar = root.createDiv({ cls: "vrpg-water-bar" });
    waterBar.createDiv({ cls: "vrpg-water-fill", attr: { style: `width:${stats.percent}%` } });
    const controls = root.createDiv({ cls: "vrpg-water-controls" });
    const minus = controls.createEl("button", { text: "-1 glass" });
    minus.onclick = options.onDecrement;
    const plus = controls.createEl("button", { text: "+1 glass" });
    plus.onclick = options.onIncrement;
  }

  return root;
}

module.exports = {
  renderWaterWidget
};
