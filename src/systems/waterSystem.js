// Water tracking system for Vibe RPG.
// Owns water totals, goals, glass volume, percentages, and current/target milliliters.
// Keep behavior compatible with the previous main.js implementation.

function dateKey(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getFullYear()}`;
}

function waterStats(data, key = dateKey()) {
  const day = data.days[key] || {};
  const goal = Math.max(1, Number(data.settings && data.settings.waterGoal) || 8);
  const glassMl = Math.max(50, Number(data.settings && data.settings.waterGlassMl) || 250);
  const value = Math.max(0, Number(day.water || 0));
  return {
    value,
    goal,
    glassMl,
    currentMl: value * glassMl,
    targetMl: goal * glassMl,
    percent: Math.min(100, Math.round(value / goal * 100))
  };
}

module.exports = { waterStats };

