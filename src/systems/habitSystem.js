// Habit and day-stat business logic for Vibe RPG.
// Extracted from main.js without changing signatures or return values.

const { dateKey, uid } = require("../utils");
const { getDay } = require("../storage");

function activeHabits(data) {
  return data.habits.filter(habit => habit.enabled !== false);
}

function dayStats(data, key = dateKey()) {
  const day = getDay(data, key);
  return readDayStats(data, key, day);
}

function readDayStats(data, key = dateKey(), day = data.days[key]) {
  const habits = activeHabits(data);
  let done = 0;
  let xp = 0;
  const areaDone = { body: 0, mind: 0, craft: 0, control: 0 };
  const areaTotal = { body: 0, mind: 0, craft: 0, control: 0 };
  for (const habit of habits) {
    if (areaTotal[habit.area] !== undefined) areaTotal[habit.area]++;
    if (!day || !day.completed || !day.completed[habit.id]) continue;
    done++;
    xp += Number(habit.xp || 0);
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
    craft: { done: 0, total: 0 },
    control: { done: 0, total: 0 }
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
  const value = Number(habitInput.xp);
  const habit = {
    id: uid("habit"),
    title: habitInput.title,
    area: habitInput.area,
    icon: String(habitInput.icon || "✨").trim() || "✨",
    xp: Number.isFinite(value) && value > 0 ? value : 10,
    enabled: true
  };
  data.habits.push(habit);
  return { data, habit };
}

function applyHabitUpdate(data, habitId, patch) {
  const habit = data.habits.find(item => item.id === habitId);
  if (!habit) return { data, habit };
  const allowed = ["title", "area", "icon", "xp", "enabled"];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) habit[key] = patch[key];
  }
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
