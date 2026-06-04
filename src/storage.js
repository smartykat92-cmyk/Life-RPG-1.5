// Data helpers for Vibe RPG storage.
// Extracted from main.js without changing data.json structure or save/load behavior.

const { DEFAULT_DATA } = require("./defaults");
const { QUEST_STATS_CARDS } = require("./config/questStatsConfig");
const { getHeroClass, resolveHeroClassId } = require("./config/heroClassesConfig");
const {
  normalizeHomeLayout,
  normalizeInterfaceLayout
} = require("./config/layoutConfig");
const { normalizeInterfaceTheme } = require("./config/themeConfig");
const { normalizeQuestStatsSettings } = require("./systems/questStatsSystem");
const { clone, dateKey } = require("./utils");

function mergeData(data) {
  const next = clone(DEFAULT_DATA);
  if (!data || typeof data !== "object") return next;
  next.player = { ...next.player, ...(data.player || {}) };
  const classId = resolveHeroClassId(next.player);
  next.player.classId = classId;
  next.player.className = getHeroClass(classId).title;
  const settings = data.settings && typeof data.settings === "object" ? data.settings : {};
  const questStatsSettings = normalizeQuestStatsSettings(settings, QUEST_STATS_CARDS);
  next.settings = {
    ...next.settings,
    ...settings,
    questStatsCards: questStatsSettings.questStatsCards,
    customQuestStatsCards: questStatsSettings.customQuestStatsCards,
    interfaceLayout: normalizeInterfaceLayout(settings.interfaceLayout),
    interfaceTheme: normalizeInterfaceTheme(settings.interfaceTheme),
    homeLayout: normalizeHomeLayout(settings.homeLayout, normalizeInterfaceLayout(settings.interfaceLayout))
  };
  next.habits = Array.isArray(data.habits) ? data.habits : next.habits;
  next.rewards = Array.isArray(data.rewards) ? data.rewards : next.rewards;
  next.days = data.days && typeof data.days === "object" ? data.days : next.days;
  next.inventory = Array.isArray(data.inventory) ? data.inventory : next.inventory;
  next.wallet = Array.isArray(data.wallet) ? data.wallet : next.wallet;
  return next;
}

function getDay(data, key = dateKey()) {
  if (!data.days[key]) data.days[key] = { completed: {}, note: "" };
  if (!data.days[key].completed) data.days[key].completed = {};
  if (!Number.isFinite(Number(data.days[key].water))) data.days[key].water = 0;
  return data.days[key];
}

module.exports = {
  mergeData,
  getDay
};
