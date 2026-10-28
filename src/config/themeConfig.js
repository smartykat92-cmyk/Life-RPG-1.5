// Theme configuration foundation for Vibe RPG.
// Keeps the current brand-dark look while preparing future accent controls.

const THEME_PRESETS = [
  {
    id: "brand-dark",
    title: "Brand Dark",
    description: "Brand dark purple/blue Life RPG palette",
    className: "vrpg-theme-brand-dark"
  }
];

const ACCENT_PRESETS = [
  { id: "purple", title: "Purple", className: "vrpg-accent-purple" },
  { id: "cyan", title: "Cyan", className: "vrpg-accent-cyan" },
  { id: "emerald", title: "Emerald", className: "vrpg-accent-emerald" },
  { id: "crimson", title: "Crimson", className: "vrpg-accent-crimson" },
  { id: "gold", title: "Gold", className: "vrpg-accent-gold" }
];

const DEFAULT_INTERFACE_THEME = {
  version: 1,
  themeId: "brand-dark",
  accentPreset: "purple"
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getThemePresets() {
  return clone(THEME_PRESETS);
}

function getAccentPresets() {
  return clone(ACCENT_PRESETS);
}

function normalizeInterfaceTheme(theme) {
  const input = theme && typeof theme === "object" ? theme : {};
  const themeId = THEME_PRESETS.some(preset => preset.id === input.themeId)
    ? input.themeId
    : DEFAULT_INTERFACE_THEME.themeId;
  const accentPreset = ACCENT_PRESETS.some(preset => preset.id === input.accentPreset)
    ? input.accentPreset
    : DEFAULT_INTERFACE_THEME.accentPreset;
  return {
    version: 1,
    themeId,
    accentPreset
  };
}

function getThemeClasses(theme) {
  const normalized = normalizeInterfaceTheme(theme);
  const themePreset = THEME_PRESETS.find(preset => preset.id === normalized.themeId);
  const accentPreset = ACCENT_PRESETS.find(preset => preset.id === normalized.accentPreset);
  return [themePreset && themePreset.className, accentPreset && accentPreset.className].filter(Boolean);
}

function getThemeClassList() {
  return [
    ...THEME_PRESETS.map(preset => preset.className),
    ...ACCENT_PRESETS.map(preset => preset.className)
  ];
}

module.exports = {
  THEME_PRESETS,
  ACCENT_PRESETS,
  DEFAULT_INTERFACE_THEME,
  getThemePresets,
  getAccentPresets,
  normalizeInterfaceTheme,
  getThemeClasses,
  getThemeClassList
};
