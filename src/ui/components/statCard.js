// Small stat card DOM helper for Vibe RPG.
// Kept generic for later UI extraction; not tied to plugin state or data.

function createStatCard(parent, options, value, className = "vrpg-panel") {
  const config = typeof options === "object" && options !== null
    ? options
    : { label: options, value, className };
  const card = parent.createDiv({ cls: config.className || "vrpg-panel" });
  card.createDiv({ cls: "vrpg-section", text: config.label });
  card.createDiv({ cls: "vrpg-stat-value", text: config.value });
  if (config.note) card.createDiv({ cls: "vrpg-subtitle", text: config.note });
  return card;
}

module.exports = {
  createStatCard
};
