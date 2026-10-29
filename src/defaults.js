// Default data definitions for Vibe RPG.
// Holds the current DEFAULT_DATA shape used for new or missing plugin data.
// Not a migration file; keep data.json compatibility unchanged.

const { DEFAULT_HERO_CLASS_ID } = require("./config/heroClassesConfig");
const {
  getDefaultHomeLayout,
  getDefaultInterfaceLayout
} = require("./config/layoutConfig");
const { DEFAULT_INTERFACE_THEME } = require("./config/themeConfig");
const { DAILY_XP } = require("./constants");

const DEFAULT_DATA = {
  player: {
    name: "Hero",
    classId: DEFAULT_HERO_CLASS_ID,
    className: "Habit Warrior",
    goal: "complete at least 3 dailies per day",
    avatarUrl: ""
  },
  settings: {
    homeLayout: getDefaultHomeLayout(),
    interfaceLayout: getDefaultInterfaceLayout(),
    interfaceTheme: DEFAULT_INTERFACE_THEME
  },
  habits: [
    { id: "gym", title: "Gym", area: "body", icon: "🏋️", xp: DAILY_XP, enabled: true, days: null },
    { id: "walk", title: "Walk", area: "body", icon: "🚶", xp: DAILY_XP, enabled: true, days: null },
    { id: "stretch", title: "Stretch", area: "body", icon: "🧘", xp: DAILY_XP, enabled: true, days: null },
    { id: "focus", title: "20 Minutes Quiet Focus", area: "mind", icon: "🧠", xp: DAILY_XP, enabled: true, days: null },
    { id: "bible", title: "Bible Study", area: "spirit", icon: "🙏", xp: DAILY_XP, enabled: true, days: null },
    { id: "journal", title: "Journaling", area: "spirit", icon: "✍️", xp: DAILY_XP, enabled: true, days: null },
    { id: "project", title: "Work / Project", area: "craft", icon: "🛠️", xp: DAILY_XP, enabled: true, days: null },
    { id: "chores", title: "Household Chores", area: "hearth", icon: "🏡", xp: DAILY_XP, enabled: true, days: null }
  ],
  quests: [],
  rewards: [
    { id: "youtube", title: "30 Minutes YouTube", cost: 100, icon: "▶️", rarity: "common" },
    { id: "coffee", title: "Coffee / Drink", cost: 100, icon: "☕", rarity: "common" },
    { id: "dinner", title: "Dinner Out", cost: 250, icon: "🍜", rarity: "rare" },
    { id: "game", title: "Game Night", cost: 250, icon: "🎮", rarity: "rare" }
  ],
  days: {},
  inventory: [],
  log: [],
  gold: 0
};

module.exports = { DEFAULT_DATA };
