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
    name: "Герой",
    classId: DEFAULT_HERO_CLASS_ID,
    className: "Воин привычек",
    goal: "закрывать минимум 3 привычки в день",
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
    { id: "gym", title: "Зал", area: "body", icon: "🏋️", xp: 10, enabled: true },
    { id: "walk", title: "Прогулка", area: "body", icon: "🚶", xp: 10, enabled: true },
    { id: "stretch", title: "Растяжка", area: "body", icon: "🧘", xp: 10, enabled: true },
    { id: "run", title: "Бег", area: "body", icon: "🏃", xp: 10, enabled: true },
    { id: "bike", title: "Велосипед", area: "body", icon: "🚴", xp: 10, enabled: true },
    { id: "focus", title: "20 минут в тишине", area: "mind", icon: "🧠", xp: 10, enabled: true },
    { id: "work", title: "Работа / проект", area: "craft", icon: "🛠️", xp: 10, enabled: true },
    { id: "control", title: "День без залипания", area: "control", icon: "🛡️", xp: 10, enabled: true }
  ],
  rewards: [
    { id: "youtube", title: "30 минут YouTube", cost: 100, icon: "▶️", rarity: "common" },
    { id: "coffee", title: "Кофе / напиток", cost: 100, icon: "☕", rarity: "common" },
    { id: "dinner", title: "Кафе / вкусный ужин", cost: 250, icon: "🍜", rarity: "rare" },
    { id: "game", title: "Вечер игры", cost: 250, icon: "🎮", rarity: "rare" }
  ],
  days: {},
  inventory: [],
  wallet: []
};

module.exports = { DEFAULT_DATA };
