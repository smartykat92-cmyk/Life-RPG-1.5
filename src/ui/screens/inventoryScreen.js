// Active Home inventory panel renderer for Vibe RPG.
// Receives data and callbacks from main-entry; does not access plugin state directly.

function renderHomeInventoryScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const toggleInventoryItemUsed = ctx.toggleInventoryItemUsed || (() => {});
  const items = (data.inventory || []).slice().reverse();
  if (!items.length) {
    parent.createDiv({ cls: "vrpg-subtitle", text: "Inventory empty. Buy your first reward in the shop." });
    return;
  }
  const grid = parent.createDiv({ cls: "vrpg-card-grid" });
  for (const item of items) {
    const card = grid.createDiv({ cls: item.used ? "vrpg-panel is-muted" : "vrpg-panel" });
    card.createDiv({ cls: "vrpg-card-title", text: `${item.icon || "🎁"} ${item.title}` });
    card.createDiv({ cls: "vrpg-subtitle", text: `${item.cost} XP • ${item.date}` });
    const button = card.createEl("button", { cls: "vrpg-primary", text: item.used ? "Return" : "Use" });
    button.onclick = () => toggleInventoryItemUsed(item.id);
  }
}

module.exports = {
  renderHomeInventoryScreen
};
