// Shared constants for Vibe RPG.
// Holds stable ids, labels, moods, rarities, and icon presets used by main.js.
// Keep numeric tuning values in config files in later stages, not here.

const APP_VIEW = "vibe-rpg-app-view";
const SIDEBAR_VIEW = "vibe-rpg-sidebar-view";

const AREA_LABELS = {
  body: "Тело",
  mind: "Разум",
  craft: "Дело",
  control: "Контроль"
};

const MOODS = {
  low: "Низкая",
  normal: "Норм",
  high: "Высокая"
};

const RARITIES = {
  common: "Обычная",
  rare: "Редкая",
  epic: "Эпическая",
  legendary: "Легендарная"
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

