// Shared constants for Vibe RPG.
// Holds stable ids, labels, moods, rarities, and icon presets used by main.js.
// Keep numeric tuning values in config files in later stages, not here.

const APP_VIEW = "vibe-rpg-app-view";
const SIDEBAR_VIEW = "vibe-rpg-sidebar-view";

const AREA_LABELS = {
  body: "Body",
  mind: "Mind",
  craft: "Craft",
  control: "Control"
};

const MOODS = {
  low: "Low",
  normal: "Normal",
  high: "High"
};

const RARITIES = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary"
};

const HABIT_ICONS = ["🏋️", "🚶", "🧘", "🏃", "🚴", "🧠", "🛠️", "🛡️", "📚", "✍️", "🎧", "💧", "🧹", "💬", "🎯", "🔥"];

module.exports = {
  APP_VIEW,
  SIDEBAR_VIEW,
  AREA_LABELS,
  MOODS,
  RARITIES,
  HABIT_ICONS
};

