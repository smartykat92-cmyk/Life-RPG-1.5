// Habit (Dailies) and day-stat business logic for Vibe RPG / Grindstone.
// Extracted from main.js without changing signatures or return values.
// Updated for 5 categories (body/mind/spirit/craft/hearth) and day-of-week scheduling.

const { dateKey, uid } = require("../utils");
const { getDay } = require("../storage");
const { DAILY_XP, ALL_DAYS } = require("../constants");

function activeHabits(data, forDate) {
  const habits = data.habits.filter(habit => habit.enabled !== false);
  if (!forDate) return habits;
  // Filter by day-of-week if habit has days set
  const dayIndex = forDate.getDay(); // 0=Sun, 1=Mon, ...
  const dayKey = ALL_DAYS[dayIndex];
  return habits.filter(habit => {
    if (!habit.days || !Array.isArray(habit.days) || habit.days.length === 0) return true;
    return habit.days.includes(dayKey);
  });
}

function dayStats(data, key = dateKey()) {
  const day = getDay(data, key);
  return readDayStats(data, key, day);
}

function readDayStats(data, key = dateKey(), day = data.days[key]) {
  const habits = activeHabits(data);
  let done = 0;
  let xp = 0;
  const areaDone = { body: 0, mind: 0, spirit: 0, craft: 0, hearth: 0 };
  const areaTotal = { body: 0, mind: 0, spirit: 0, craft: 0, hearth: 0 };
  for (const habit of habits) {
    if (areaTotal[habit.area] !== undefined) areaTotal[habit.area]++;
    if (!day || !day.completed || !day.completed[habit.id]) continue;
    done++;
    xp += DAILY_XP;
    if (areaDone[habit.area] !== undefined) areaDone[habit.area]++;
  }
  const total = habits.length;
  return {
    key,
    done,
    total,
    xp,
    percent: total ? Math.round(done / total * 100) : 0,
    areaDone,
    areaTotal
  };
}

function sortedDayKeys(data) {
  return Object.keys(data.days || {}).sort((a, b) => {
    const pa = a.split(".").reverse().join("-");
    const pb = b.split(".").reverse().join("-");
    return pa.localeCompare(pb);
  });
}

function streak(data) {
  let value = 0;
  const keys = sortedDayKeys(data);
  for (let i = keys.length - 1; i >= 0; i--) {
    const stats = dayStats(data, keys[i]);
    if (stats.percent < 50) break;
    value++;
  }
  return value;
}

function skillStats(data) {
  const keys = sortedDayKeys(data);
  const result = {
    body: { done: 0, total: 0 },
    mind: { done: 0, total: 0 },
    spirit: { done: 0, total: 0 },
    craft: { done: 0, total: 0 },
    hearth: { done: 0, total: 0 }
  };
  for (const key of keys) {
    const stats = dayStats(data, key);
    for (const area of Object.keys(result)) {
      if (stats.areaTotal[area] > 0) result[area].total++;
      if (stats.areaDone[area] > 0) result[area].done++;
    }
  }
  return result;
}

function applyHabitToggle(data, key, habitId) {
  const day = getDay(data, key);
  day.completed[habitId] = !day.completed[habitId];
  return { data, key, day, habitId, completed: day.completed[habitId] };
}

function applyHabitAdd(data, habitInput) {
  const habit = {
    id: uid("habit"),
    title: habitInput.title,
    area: habitInput.area,
    icon: String(habitInput.icon || "✨").trim() || "✨",
    xp: DAILY_XP,
    enabled: true,
    days: habitInput.days || null
  };
  data.habits.push(habit);
  return { data, habit };
}

function applyHabitUpdate(data, habitId, patch) {
  const habit = data.habits.find(item => item.id === habitId);
  if (!habit) return { data, habit };
  const allowed = ["title", "area", "icon", "enabled", "days"];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) habit[key] = patch[key];
  }
  // XP is always fixed
  habit.xp = DAILY_XP;
  return { data, habit };
}

function applyHabitDelete(data, habitId) {
  data.habits = data.habits.filter(habit => habit.id !== habitId);
  for (const day of Object.values(data.days)) {
    if (day && day.completed) delete day.completed[habitId];
  }
  return { data, habitId };
}

module.exports = {
  activeHabits,
  dayStats,
  readDayStats,
  sortedDayKeys,
  streak,
  skillStats,
  applyHabitToggle,
  applyHabitAdd,
  applyHabitUpdate,
  applyHabitDelete
};
