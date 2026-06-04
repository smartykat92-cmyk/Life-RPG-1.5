// Inventory data mutations for Vibe RPG.
// These helpers only mutate inventory items; UI, Notice, and saving stay in main.js.

function applyInventoryToggleUsed(data, itemId) {
  const item = data.inventory.find(entry => entry.id === itemId);
  if (!item) return { ok: false, data, item, reason: "not-found" };
  item.used = !item.used;
  return { ok: true, data, item, reason: undefined };
}

module.exports = {
  applyInventoryToggleUsed
};
