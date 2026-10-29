// Active Settings rewards panel renderer for Grindstone.
// Uses Gold currency for shop purchases.

function renderSettingsRewardsScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const rarities = ctx.rarities || {};
  const addReward = ctx.addReward;
  const deleteReward = ctx.deleteReward;
  const confirm = ctx.confirm;
  const rewardPanel = parent.createDiv({ cls: "vrpg-panel" });
  rewardPanel.createDiv({ cls: "vrpg-section", text: "Add Reward" });
  const rewardTitle = rewardPanel.createEl("input", { type: "text", placeholder: "e.g. movie, massage, dinner out" });
  const rewardCost = rewardPanel.createEl("input", { type: "number", placeholder: "Cost in Gold, e.g. 150" });
  const rewardRarity = rewardPanel.createEl("select");
  Object.entries(rarities).forEach(([value, label]) => {
    rewardRarity.createEl("option", { text: label, value });
  });
  const rewardButton = rewardPanel.createEl("button", { cls: "vrpg-primary", text: "Add Reward" });
  rewardButton.onclick = () => {
    addReward(rewardTitle.value, rewardCost.value, rewardRarity.value);
    rewardTitle.value = "";
    rewardCost.value = "";
  };

  const rewardList = parent.createDiv({ cls: "vrpg-panel" });
  rewardList.createDiv({ cls: "vrpg-section", text: "My Rewards" });
  for (const reward of data.rewards) {
    const row = rewardList.createDiv({ cls: "vrpg-setting-row" });
    row.createDiv({ cls: "vrpg-card-title", text: `${reward.icon || "🎁"} ${reward.title}` });
    row.createDiv({ cls: "vrpg-subtitle", text: `${reward.cost} Gold · ${rarities[reward.rarity || "common"] || rarities.common}` });
    const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
    remove.onclick = () => {
      if (confirm(`Delete reward "${reward.title}" from the shop? Already purchased items in inventory will remain.`)) {
        deleteReward(reward.id);
      }
    };
  }
}

module.exports = {
  renderSettingsRewardsScreen
};
