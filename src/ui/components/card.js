// Small card DOM helper for Vibe RPG.
// Kept generic for later UI extraction; it only creates an existing CSS class wrapper.

function createCard(parent, options = {}) {
  const config = typeof options === "string" ? { className: options } : options;
  const card = parent.createDiv({ cls: config.className || "vrpg-panel" });
  if (config.section) card.createDiv({ cls: "vrpg-section", text: config.section });
  if (config.title) card.createDiv({ cls: "vrpg-card-title", text: config.title });
  if (config.body) card.createDiv({ cls: "vrpg-subtitle", text: config.body });
  return card;
}

module.exports = {
  createCard
};
