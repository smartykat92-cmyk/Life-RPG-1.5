// Active Settings rewards panel renderer for Vibe RPG.
// Receives data, config, and callbacks from main-entry.

function renderSettingsRewardsScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const rarities = ctx.rarities || {};
  const addReward = ctx.addReward;
  const deleteReward = ctx.deleteReward;
  const confirm = ctx.confirm;
  const rewardPanel = parent.createDiv({ cls: "vrpg-panel" });
  rewardPanel.createDiv({ cls: "vrpg-section", text: "Добавить награду" });
  const rewardTitle = rewardPanel.createEl("input", { type: "text", placeholder: "Например: кино, массаж, вкусный ужин" });
  const rewardCost = rewardPanel.createEl("input", { type: "number", placeholder: "Цена в XP, например 150" });
  const rewardRarity = rewardPanel.createEl("select");
  Object.entries(rarities).forEach(([value, label]) => {
    rewardRarity.createEl("option", { text: label, value });
  });
  const rewardButton = rewardPanel.createEl("button", { cls: "vrpg-primary", text: "Добавить награду" });
  rewardButton.onclick = () => {
    addReward(rewardTitle.value, rewardCost.value, rewardRarity.value);
    rewardTitle.value = "";
    rewardCost.value = "";
  };

  const rewardList = parent.createDiv({ cls: "vrpg-panel" });
  rewardList.createDiv({ cls: "vrpg-section", text: "Мои награды" });
  for (const reward of data.rewards) {
    const row = rewardList.createDiv({ cls: "vrpg-setting-row" });
    row.createDiv({ cls: "vrpg-card-title", text: `${reward.icon || "🎁"} ${reward.title}` });
    row.createDiv({ cls: "vrpg-subtitle", text: `${reward.cost} XP · ${rarities[reward.rarity || "common"] || rarities.common}` });
    const remove = row.createEl("button", { cls: "vrpg-danger", text: "Удалить" });
    remove.onclick = () => {
      if (confirm(`Удалить награду "${reward.title}" из магазина? Уже купленные предметы в инвентаре останутся.`)) {
        deleteReward(reward.id);
      }
    };
  }
}

module.exports = {
  renderSettingsRewardsScreen
};
