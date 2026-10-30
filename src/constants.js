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
const MAIN_QUEST_XP = 200;       // Full chain completion
const MAIN_QUEST_STEP_XP = 25;   // Per sub-step
const BOUNTY_XP = 15;
const EVENT_XP_SHORT = 75;       // 2-3 days
const EVENT_XP_MEDIUM = 125;     // 4-7 days
const EVENT_XP_LONG = 200;       // 8-14 days
const EVENT_XP_EXTENDED = 300;   // 15+ days
const EVENT_SUBTASK_XP = 15;

// Quest types
const QUEST_TYPES = {
  quest: "Quest",
  main_quest: "Main Quest",
  bounty: "Bounty",
  event: "Event"
};

// Quest categories
const QUEST_PRIORITIES = {
  standard: "Standard",
  major: "Major"
};

// Quest type icons (dark fantasy)
const QUEST_TYPE_ICONS = {
  quest: "⚔️",
  main_quest: "🏰",
  bounty: "🎯",
  event: "🔥"
};

// Bounty daily cap
const BOUNTY_DAILY_CAP = 5;

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
  MAIN_QUEST_XP,
  MAIN_QUEST_STEP_XP,
  BOUNTY_XP,
  EVENT_XP_SHORT,
  EVENT_XP_MEDIUM,
  EVENT_XP_LONG,
  EVENT_XP_EXTENDED,
  EVENT_SUBTASK_XP,
  QUEST_TYPES,
  QUEST_PRIORITIES,
  QUEST_TYPE_ICONS,
  BOUNTY_DAILY_CAP,
  DAYS_OF_WEEK,
  ALL_DAYS
};

