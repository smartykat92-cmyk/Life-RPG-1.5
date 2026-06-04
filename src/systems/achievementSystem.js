// Achievement and hero attribute business logic for Vibe RPG.
// Extracted from main.js without changing signatures or return values.

const {
  dayStats,
  skillStats,
  sortedDayKeys,
  streak
} = require("./habitSystem");
const { totals } = require("./xpSystem");

function coreAttributes(data) {
  const stats = skillStats(data);
  return [
    ["Тело", stats.body.total ? Math.round(stats.body.done / stats.body.total * 100) : 0],
    ["Разум", stats.mind.total ? Math.round(stats.mind.done / stats.mind.total * 100) : 0],
    ["Дело", stats.craft.total ? Math.round(stats.craft.done / stats.craft.total * 100) : 0]
  ];
}

function achievements(data) {
  const t = totals(data);
  const keys = sortedDayKeys(data);
  const hasCompleteDay = keys.some(key => {
    const stats = dayStats(data, key);
    return stats.total > 0 && stats.done === stats.total;
  });
  const bought = (data.inventory || []).length > 0;
  return [
    { id: "first-day", title: "Первый день закрыт", done: hasCompleteDay },
    { id: "three-streak", title: "3 дня подряд", done: streak(data) >= 3 },
    { id: "week", title: "Неделя без провала", done: streak(data) >= 7 },
    { id: "xp100", title: "100 XP заработано", done: t.earned >= 100 },
    { id: "first-buy", title: "Первая покупка", done: bought }
  ];
}

module.exports = {
  coreAttributes,
  achievements
};
