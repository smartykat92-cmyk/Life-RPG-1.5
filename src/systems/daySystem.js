// Day-level data mutations for Vibe RPG.
// These helpers only mutate data and return context; saving/rendering stays in main.js.

const { dateKey } = require("../utils");
const { getDay } = require("../storage");

function applyWaterChange(data, selectedDate, delta) {
  const key = selectedDate || dateKey();
  const day = getDay(data, key);
  const goal = Math.max(1, Number(data.settings.waterGoal) || 8);
  day.water = Math.max(0, Math.min(goal + 4, Number(day.water || 0) + delta));
  return { data, key, day };
}

function applyMoodChange(data, selectedDate, mood) {
  const key = selectedDate || dateKey();
  const day = getDay(data, key);
  day.mood = mood;
  return { data, key, day };
}

module.exports = {
  applyWaterChange,
  applyMoodChange
};
