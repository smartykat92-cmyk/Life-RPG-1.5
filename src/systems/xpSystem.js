// XP and level system for Vibe RPG.
// Owns XP-facing labels and will later own earned/spent/level calculations.
// Keep behavior compatible with the previous main.js implementation.

function heroTitle(level) {
  if (level >= 20) return "Мастер ритма";
  if (level >= 10) return "Стратег";
  if (level >= 5) return "Искатель";
  return "Новичок";
}

function totals(data) {
  let earned = 0;
  for (const [key, day] of Object.entries(data.days)) {
    if (!day || !day.completed) continue;
    for (const habit of data.habits) {
      if (habit.enabled !== false && day.completed[habit.id]) earned += Number(habit.xp || 0);
    }
  }
  let spent = 0;
  for (const item of data.inventory) spent += Number(item.cost || 0);
  return {
    earned,
    spent,
    balance: Math.max(0, earned - spent),
    level: Math.floor(earned / 100) + 1,
    levelXP: earned % 100
  };
}

module.exports = {
  heroTitle,
  totals
};
