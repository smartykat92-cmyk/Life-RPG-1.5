// Active Settings shell renderer for Grindstone.
// Receives navigation and panel callbacks from main-entry.

const { FEATURE_FLAGS } = require("../../config/featureFlags");

function renderSettingsScreen(parent, ctx = {}) {
  const settingsPanel = !FEATURE_FLAGS.showInterfaceSettings && ctx.settingsPanel === "interface" ? "profile" : ctx.settingsPanel;
  const navigate = ctx.navigate;
  const shell = parent.createDiv({ cls: "vrpg-hero-card vrpg-settings-shell" });
  shell.createDiv({ cls: "vrpg-kicker", text: "Settings" });
  shell.createDiv({ cls: "vrpg-title", text: "System" });
  shell.createDiv({ cls: "vrpg-subtitle", text: "Customize hero, dailies, quests, and shop." });
  const nav = shell.createDiv({ cls: "vrpg-command-grid vrpg-settings-nav" });
  const panels = [
    ["profile", "Hero", "name, class, photo"],
    ["interface", "Interface", "home widgets"],
    ["habits", "Dailies", "daily actions"],
    ["quests", "Quests", "quest management"],
    ["rewards", "Rewards", "Gold shop"]
  ].filter(([id]) => FEATURE_FLAGS.showInterfaceSettings || id !== "interface");
  panels.forEach(([id, title, desc]) => {
    const button = nav.createEl("button", { cls: settingsPanel === id ? "vrpg-command-action is-active" : "vrpg-command-action" });
    button.createEl("strong", { text: title });
    button.createSpan({ text: desc });
    button.onclick = () => {
      navigate({ tab: "settings", settingsPanel: id });
    };
  });
  const body = shell.createDiv({ cls: "vrpg-home-module" });
  if (settingsPanel === "profile") ctx.renderSettingsProfile(body);
  if (settingsPanel === "interface") ctx.renderSettingsInterface(body);
  if (settingsPanel === "habits") ctx.renderSettingsHabits(body);
  if (settingsPanel === "quests") ctx.renderSettingsQuests(body);
  if (settingsPanel === "rewards") ctx.renderSettingsRewards(body);
}

module.exports = {
  renderSettingsScreen
};
