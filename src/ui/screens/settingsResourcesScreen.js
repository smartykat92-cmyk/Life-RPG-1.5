// Active Settings resources/water panel renderer for Vibe RPG.
// Receives data and callbacks from main-entry.

function renderSettingsResourcesScreen(parent, ctx = {}) {
  const settings = ctx.settings || {};
  const setWaterGoal = ctx.setWaterGoal;
  const setWaterGlassMl = ctx.setWaterGlassMl;
  const settingsPanel = parent.createDiv({ cls: "vrpg-panel" });
  settingsPanel.createDiv({ cls: "vrpg-section", text: "Вода" });
  const waterGoal = settingsPanel.createEl("input", {
    type: "number",
    placeholder: "Цель воды в стаканах",
    value: String(settings.waterGoal || 8)
  });
  const waterMl = settingsPanel.createEl("input", {
    type: "number",
    placeholder: "Объём стакана в мл",
    value: String(settings.waterGlassMl || 250)
  });
  const saveWater = settingsPanel.createEl("button", { cls: "vrpg-primary", text: "Сохранить цель воды" });
  saveWater.onclick = async () => {
    await setWaterGoal(waterGoal.value);
    await setWaterGlassMl(waterMl.value);
  };
}

module.exports = {
  renderSettingsResourcesScreen
};
