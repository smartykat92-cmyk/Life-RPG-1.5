// Active Home rewards panel renderer for Vibe RPG.
// Receives data and callbacks from main-entry; does not access plugin state directly.

function renderHomeRewardsScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const t = ctx.totals || {};
  const rarities = ctx.rarities || {};
  const buyReward = ctx.buyReward || (() => {});
  const grid = parent.createDiv({ cls: "vrpg-card-grid" });
  for (const reward of data.rewards || []) {
    const card = grid.createDiv({ cls: "vrpg-panel" });
    card.createDiv({ cls: "vrpg-card-title", text: `${reward.icon || "🎁"} ${reward.title}` });
    card.createDiv({ cls: `vrpg-rarity vrpg-rarity-${reward.rarity || "common"}`, text: rarities[reward.rarity || "common"] || rarities.common });
    card.createDiv({ cls: "vrpg-subtitle", text: `${reward.cost} XP` });
    const button = card.createEl("button", { cls: "vrpg-primary", text: t.balance >= reward.cost ? "Buy" : "Not enough XP" });
    button.disabled = t.balance < reward.cost;
    button.onclick = () => buyReward(reward.id);
  }
}

module.exports = {
  renderHomeRewardsScreen
};
