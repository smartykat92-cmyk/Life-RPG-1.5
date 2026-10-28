// Default data definitions for Vibe RPG.
// Holds the current DEFAULT_DATA shape used for new or missing plugin data.
// Not a migration file; keep data.json compatibility unchanged.

const { createDefaultQuestStatsCards } = require("./config/questStatsConfig");
const { DEFAULT_HERO_CLASS_ID } = require("./config/heroClassesConfig");
const {
  getDefaultHomeLayout,
  getDefaultInterfaceLayout
} = require("./config/layoutConfig");
const { DEFAULT_INTERFACE_THEME } = require("./config/themeConfig");

const DEFAULT_DATA = {
  player: {
    name: "Hero",
    classId: DEFAULT_HERO_CLASS_ID,
    className: "Habit Warrior",
    goal: "complete at least 3 habits per day",
    avatarUrl: ""
  },
  settings: {
    waterGoal: 8,
    waterGlassMl: 250,
    questStatsCards: createDefaultQuestStatsCards(),
    customQuestStatsCards: [],
    homeLayout: getDefaultHomeLayout(),
    interfaceLayout: getDefaultInterfaceLayout(),
    interfaceTheme: DEFAULT_INTERFACE_THEME
  },
  habits: [
    { id: "gym", title: "Gym", area: "body", icon: "🏋️", xp: 10, enabled: true },
    { id: "walk", title: "Walk", area: "body", icon: "🚶", xp: 10, enabled: true },
    { id: "stretch", title: "Stretch", area: "body", icon: "🧘", xp: 10, enabled: true },
    { id: "run", title: "Run", area: "body", icon: "🏃", xp: 10, enabled: true },
    { id: "bike", title: "Bike", area: "body", icon: "🚴", xp: 10, enabled: true },
    { id: "focus", title: "20 Minutes Quiet Focus", area: "mind", icon: "🧠", xp: 10, enabled: true },
    { id: "work", title: "Work / Project", area: "craft", icon: "🛠️", xp: 10, enabled: true },
    { id: "control", title: "No Doom Scrolling", area: "control", icon: "🛡️", xp: 10, enabled: true }
  ],
  rewards: [
    { id: "youtube", title: "30 Minutes YouTube", cost: 100, icon: "▶️", rarity: "common" },
    { id: "coffee", title: "Coffee / Drink", cost: 100, icon: "☕", rarity: "common" },
    { id: "dinner", title: "Dinner Out", cost: 250, icon: "🍜", rarity: "rare" },
    { id: "game", title: "Game Night", cost: 250, icon: "🎮", rarity: "rare" }
  ],
  days: {},
  inventory: [],
  wallet: []
};

module.exports = { DEFAULT_DATA };
