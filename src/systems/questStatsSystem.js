// Quest stats card settings and data helpers.
// Keeps system cards stable while allowing safe label/enabled overrides and manual custom cards.

const { QUEST_STATS_CARDS } = require("../config/questStatsConfig");
const { dateKey, uid } = require("../utils");

const CUSTOM_CARD_TYPES = ["manual", "habitCount", "habitStreak"];

function safeGoal(value) {
  const goal = Math.round(Number(value));
  return Number.isFinite(goal) && goal >= 1 ? goal : 1;
}

function safeRewardXp(value) {
  const xp = Math.round(Number(value));
  return Number.isFinite(xp) && xp >= 0 ? xp : 0;
}

function safeType(value) {
  return CUSTOM_CARD_TYPES.includes(value) ? value : "manual";
}

function safeHabitIds(value, fallback = "") {
  const input = Array.isArray(value) ? value : [];
  const ids = input
    .map(id => String(id || "").trim())
    .filter(Boolean);
  const fallbackId = String(fallback || "").trim();
  if (fallbackId && !ids.includes(fallbackId)) ids.unshift(fallbackId);
  return ids;
}

function normalizeQuestStatsSettings(settings = {}, config = QUEST_STATS_CARDS) {
  const rawCards = settings.questStatsCards && typeof settings.questStatsCards === "object" ? settings.questStatsCards : {};
  const questStatsCards = {};

  for (const card of config) {
    const raw = rawCards[card.id];
    if (typeof raw === "boolean") {
      questStatsCards[card.id] = {
        enabled: raw,
        label: card.label
      };
      continue;
    }
    if (raw && typeof raw === "object") {
      questStatsCards[card.id] = {
        enabled: Object.prototype.hasOwnProperty.call(raw, "enabled") ? raw.enabled !== false : card.enabled !== false,
        label: String(raw.label || card.label).trim() || card.label
      };
      continue;
    }
    questStatsCards[card.id] = {
      enabled: card.enabled !== false,
      label: card.label
    };
  }

  const customQuestStatsCards = Array.isArray(settings.customQuestStatsCards)
    ? settings.customQuestStatsCards
      .filter(card => card && typeof card === "object" && card.id)
      .map(card => ({
        id: String(card.id),
        label: String(card.label || "Custom Card").trim() || "Custom Card",
        value: String(card.value || "").trim(),
        habitId: card.habitId ? String(card.habitId) : "",
        habitIds: safeHabitIds(card.habitIds, card.habitId),
        goal: safeGoal(card.goal || 1),
        rewardXp: safeRewardXp(card.rewardXp || 0),
        period: String(card.period || "week"),
        enabled: card.enabled !== false,
        custom: true,
        type: safeType(card.type || "manual")
      }))
    : [];

  return {
    questStatsCards,
    customQuestStatsCards
  };
}

function applyQuestStatsCardUpdate(data, id, patch = {}) {
  const card = QUEST_STATS_CARDS.find(item => item.id === id);
  if (!card) return { ok: false, data, card: null, reason: "unknown-card" };

  const normalized = normalizeQuestStatsSettings(data.settings || {});
  const current = normalized.questStatsCards[id] || { enabled: card.enabled !== false, label: card.label };
  const next = { ...current };

  if (Object.prototype.hasOwnProperty.call(patch, "enabled")) next.enabled = patch.enabled !== false;
  if (Object.prototype.hasOwnProperty.call(patch, "label")) {
    next.label = String(patch.label || card.label).trim() || card.label;
  }

  data.settings.questStatsCards = {
    ...normalized.questStatsCards,
    [id]: next
  };
  data.settings.customQuestStatsCards = normalized.customQuestStatsCards;
  return { ok: true, data, card: next };
}

function applyCustomQuestStatsCardAdd(data, input = {}) {
  const normalized = normalizeQuestStatsSettings(data.settings || {});
  const card = {
    id: uid("questCard"),
    label: String(input.label || "Custom Card").trim() || "Custom Card",
    value: String(input.value || "").trim(),
    habitId: input.habitId ? String(input.habitId) : "",
    habitIds: safeHabitIds(input.habitIds, input.habitId),
    goal: safeGoal(input.goal || 1),
    rewardXp: safeRewardXp(input.rewardXp || 0),
    period: String(input.period || "week"),
    enabled: input.enabled !== false,
    custom: true,
    type: safeType(input.type || "manual")
  };

  data.settings.questStatsCards = normalized.questStatsCards;
  data.settings.customQuestStatsCards = [...normalized.customQuestStatsCards, card];
  return { ok: true, data, card };
}

function applyCustomQuestStatsCardUpdate(data, id, patch = {}) {
  const normalized = normalizeQuestStatsSettings(data.settings || {});
  const cards = normalized.customQuestStatsCards.slice();
  const index = cards.findIndex(card => card.id === id);
  if (index === -1) return { ok: false, data, card: null, reason: "unknown-card" };

  const next = { ...cards[index] };
  if (Object.prototype.hasOwnProperty.call(patch, "label")) {
    next.label = String(patch.label || "Custom Card").trim() || "Custom Card";
  }
  if (Object.prototype.hasOwnProperty.call(patch, "value")) {
    next.value = String(patch.value || "").trim();
  }
  if (Object.prototype.hasOwnProperty.call(patch, "type")) {
    next.type = safeType(patch.type || next.type);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "habitId")) {
    next.habitId = patch.habitId ? String(patch.habitId) : "";
    next.habitIds = safeHabitIds(next.habitIds, next.habitId);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "habitIds")) {
    next.habitIds = safeHabitIds(patch.habitIds, next.habitId);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "goal")) {
    next.goal = safeGoal(patch.goal);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "rewardXp")) {
    next.rewardXp = safeRewardXp(patch.rewardXp);
  }
  if (Object.prototype.hasOwnProperty.call(patch, "period")) {
    next.period = String(patch.period || "week");
  }
  if (Object.prototype.hasOwnProperty.call(patch, "enabled")) {
    next.enabled = patch.enabled !== false;
  }

  cards[index] = next;
  data.settings.questStatsCards = normalized.questStatsCards;
  data.settings.customQuestStatsCards = cards;
  return { ok: true, data, card: next };
}

function applyCustomQuestStatsCardDelete(data, id) {
  const normalized = normalizeQuestStatsSettings(data.settings || {});
  const before = normalized.customQuestStatsCards.length;
  const cards = normalized.customQuestStatsCards.filter(card => card.id !== id);
  if (cards.length === before) return { ok: false, data, cardId: id, reason: "unknown-card" };

  data.settings.questStatsCards = normalized.questStatsCards;
  data.settings.customQuestStatsCards = cards;
  return { ok: true, data, cardId: id };
}

function parseDateKey(key = dateKey()) {
  const [day, month, year] = String(key || "").split(".").map(Number);
  const date = new Date(year, month - 1, day);
  if (!Number.isFinite(date.getTime())) return new Date();
  return date;
}

function shiftDateKey(key, deltaDays) {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + deltaDays);
  return dateKey(date);
}

function habitExists(data, habitId) {
  return !!(data.habits || []).find(habit => habit.id === habitId);
}

function getQuestHabitIds(card = {}) {
  return safeHabitIds(card.habitIds, card.habitId);
}

function isHabitDoneOnDate(data, habitId, key) {
  if (!data || !habitId || !key || !habitExists(data, habitId)) return false;
  const day = data.days && data.days[key];
  return !!(day && day.completed && day.completed[habitId]);
}

function isAnyHabitDoneOnDate(data, habitIds = [], key) {
  return habitIds.some(habitId => isHabitDoneOnDate(data, habitId, key));
}

function countHabitDoneInLastDays(data, habitId, selectedDateKey = dateKey(), days = 7) {
  const totalDays = Math.max(1, Math.round(Number(days)) || 7);
  let done = 0;
  for (let index = 0; index < totalDays; index++) {
    const key = shiftDateKey(selectedDateKey, -index);
    if (isHabitDoneOnDate(data, habitId, key)) done++;
  }
  return done;
}

function countAnyHabitDoneInLastDays(data, habitIds = [], selectedDateKey = dateKey(), days = 7) {
  const totalDays = Math.max(1, Math.round(Number(days)) || 7);
  let done = 0;
  for (let index = 0; index < totalDays; index++) {
    const key = shiftDateKey(selectedDateKey, -index);
    if (isAnyHabitDoneOnDate(data, habitIds, key)) done++;
  }
  return done;
}

function habitStreakForHabit(data, habitId, selectedDateKey = dateKey()) {
  let value = 0;
  let offset = 0;
  while (true) {
    const key = shiftDateKey(selectedDateKey, -offset);
    if (!isHabitDoneOnDate(data, habitId, key)) break;
    value++;
    offset++;
  }
  return value;
}

function habitStreakForAnyHabit(data, habitIds = [], selectedDateKey = dateKey()) {
  let value = 0;
  let offset = 0;
  while (true) {
    const key = shiftDateKey(selectedDateKey, -offset);
    if (!isAnyHabitDoneOnDate(data, habitIds, key)) break;
    value++;
    offset++;
  }
  return value;
}

function resolveCustomQuestCardValue(data, card, selectedDateKey = dateKey()) {
  const goal = safeGoal(card.goal || 1);
  const habitIds = getQuestHabitIds(card);
  if (card.type === "habitCount") {
    const days = card.period === "today" ? 1 : goal;
    const done = countAnyHabitDoneInLastDays(data, habitIds, selectedDateKey, days);
    return `${done}/${goal} days`;
  }
  if (card.type === "habitStreak") {
    const streak = habitStreakForAnyHabit(data, habitIds, selectedDateKey);
    return `${streak}/${goal} days`;
  }
  return card.value || "";
}

function getQuestStatsCards(data, computedValues = {}, config = QUEST_STATS_CARDS, selectedDateKey = dateKey()) {
  const normalized = normalizeQuestStatsSettings(data.settings || {}, config);
  const systemCards = [];

  for (const card of config) {
    if (card.enabled === false) continue;
    const settings = normalized.questStatsCards[card.id] || {};
    if (settings.enabled === false) continue;
    systemCards.push({
      id: card.id,
      label: settings.label || card.label,
      value: computedValues[card.id] || "",
      custom: false,
      type: "system"
    });
  }

  const customCards = normalized.customQuestStatsCards
    .filter(card => card.enabled !== false)
    .map(card => ({
      id: card.id,
      label: card.label,
      value: resolveCustomQuestCardValue(data, card, selectedDateKey),
      note: card.rewardXp > 0 ? `🏆 ${card.rewardXp} XP` : "",
      custom: true,
      type: card.type
    }));

  return [...systemCards, ...customCards];
}

module.exports = {
  normalizeQuestStatsSettings,
  applyQuestStatsCardUpdate,
  applyCustomQuestStatsCardAdd,
  applyCustomQuestStatsCardUpdate,
  applyCustomQuestStatsCardDelete,
  isHabitDoneOnDate,
  countHabitDoneInLastDays,
  countAnyHabitDoneInLastDays,
  habitStreakForHabit,
  habitStreakForAnyHabit,
  resolveCustomQuestCardValue,
  getQuestStatsCards
};
