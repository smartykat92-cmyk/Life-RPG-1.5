// Active Settings interface panel renderer for Vibe RPG.
// Keep this panel conservative: only stable app size controls are exposed.

const { normalizeInterfaceLayout } = require("../../config/layoutConfig");
const { getInterfaceLayout } = require("../../systems/layoutSystem");

const APP_SIZE_LABELS = {
  compact: "Compact",
  comfortable: "Comfortable",
  expanded: "Expanded"
};

function renderSettingsInterfaceScreen(parent, ctx = {}) {
  const settings = ctx.settings || {};
  const updateInterfaceLayout = ctx.updateInterfaceLayout || (() => {});
  const interfaceLayout = getInterfaceLayout(settings);
  const panel = parent.createDiv({ cls: "vrpg-panel vrpg-interface-panel" });
  panel.createDiv({ cls: "vrpg-section", text: "Interface" });

  const presetPanel = panel.createDiv({ cls: "vrpg-interface-presets" });
  const presetMeta = presetPanel.createDiv({ cls: "vrpg-interface-row-meta" });
  presetMeta.createDiv({ cls: "vrpg-card-title", text: "Panel Size" });
  presetMeta.createDiv({ cls: "vrpg-subtitle", text: "Width of Life RPG workspace" });
  const presetControl = presetPanel.createDiv({ cls: "vrpg-size-control vrpg-app-size-control" });
  Object.entries(APP_SIZE_LABELS).forEach(([value, label]) => {
    const button = presetControl.createEl("button", {
      cls: interfaceLayout.appSize === value ? "vrpg-size-option is-active" : "vrpg-size-option",
      text: label
    });
    button.onclick = () => updateInterfaceLayout(normalizeInterfaceLayout({
      ...interfaceLayout,
      appSize: value
    }));
  });
}

module.exports = {
  renderSettingsInterfaceScreen
};
