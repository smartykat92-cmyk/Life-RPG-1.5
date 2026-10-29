// Data helpers for Vibe RPG / Grindstone storage.
// Updated: removed wallet/water, added quests/log/gold support.

const { DEFAULT_DATA } = require("./defaults");
const { getHeroClass, resolveHeroClassId } = require("./config/heroClassesConfig");
const {
  normalizeHomeLayout,
  normalizeInterfaceLayout
} = require("./config/layoutConfig");
const { normalizeInterfaceTheme } = require("./config/themeConfig");
const { clone, dateKey } = require("./utils");

function mergeData(data) {
  const next = clone(DEFAULT_DATA);
  if (!data || typeof data !== "object") return next;

  // Player
  next.player = { ...next.player, ...(data.player || {}) };
  const classId = resolveHeroClassId(next.player);
  next.player.classId = classId;
  next.player.className = getHeroClass(classId).title;

  // Settings — preserve existing, normalize layout/theme
  const settings = data.settings && typeof data.settings === "object" ? data.settings : {};
  next.settings = {
    ...next.settings,
    ...settings,
    interfaceLayout: normalizeInterfaceLayout(settings.interfaceLayout),
    interfaceTheme: normalizeInterfaceTheme(settings.interfaceTheme),
    homeLayout: normalizeHomeLayout(settings.homeLayout, normalizeInterfaceLayout(settings.interfaceLayout))
  };
  // Clean out legacy settings keys if present
  delete next.settings.questStatsCards;
  delete next.settings.customQuestStatsCards;

  // Core data arrays
  next.habits = Array.isArray(data.habits) ? data.habits : next.habits;
  next.rewards = Array.isArray(data.rewards) ? data.rewards : next.rewards;
  next.days = data.days && typeof data.days === "object" ? data.days : next.days;
  next.inventory = Array.isArray(data.inventory) ? data.inventory : next.inventory;

  // New fields — quests, log, gold
  next.quests = Array.isArray(data.quests) ? data.quests : next.quests;
  next.log = Array.isArray(data.log) ? data.log : next.log;
  next.gold = typeof data.gold === "number" ? data.gold : next.gold;

  // DO NOT carry over legacy wallet field
  return next;
}

function getDay(data, key = dateKey()) {
  if (!data.days[key]) data.days[key] = { completed: {}, note: "" };
  if (!data.days[key].completed) data.days[key].completed = {};
  // Removed water initialization — water tracking is gone
  return data.days[key];
}

module.exports = {
  mergeData,
  getDay
};
