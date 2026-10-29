// Shared constants for Vibe RPG.
// Holds stable ids, labels, moods, rarities, and icon presets used by main.js.
// Keep numeric tuning values in config files in later stages, not here.

const APP_VIEW = "vibe-rpg-app-view";
const SIDEBAR_VIEW = "vibe-rpg-sidebar-view";

const AREA_LABELS = {
  body: "Body",
  mind: "Mind",
  spirit: "Spirit",
  craft: "Craft",
  hearth: "Hearth"
};

// Fixed XP values — no custom XP setting
const DAILY_XP = 10;
const QUEST_XP_STANDARD = 50;
const QUEST_XP_MAJOR = 100;

// Quest categories
const QUEST_PRIORITIES = {
  standard: "Standard",
  major: "Major"
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

const HABIT_ICONS = ["🏋️", "🚶", "🧘", "🏃", "🚴", "🧠", "🛠️", "🛡️", "📚", "✍️", "🎧", "🧹", "💬", "🎯", "🔥", "🙏", "🏡", "🐝", "🌱", "👨‍👩‍👧‍👦"];

const DAYS_OF_WEEK = {
  sun: "Sun",
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat"
};

const ALL_DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

module.exports = {
  APP_VIEW,
  SIDEBAR_VIEW,
  AREA_LABELS,
  MOODS,
  RARITIES,
  HABIT_ICONS,
  DAILY_XP,
  QUEST_XP_STANDARD,
  QUEST_XP_MAJOR,
  QUEST_PRIORITIES,
  DAYS_OF_WEEK,
  ALL_DAYS
};

