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
    ["Body", stats.body.total ? Math.round(stats.body.done / stats.body.total * 100) : 0],
    ["Mind", stats.mind.total ? Math.round(stats.mind.done / stats.mind.total * 100) : 0],
    ["Craft", stats.craft.total ? Math.round(stats.craft.done / stats.craft.total * 100) : 0]
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
    { id: "first-day", title: "First Day Complete", done: hasCompleteDay },
    { id: "three-streak", title: "3-Day Streak", done: streak(data) >= 3 },
    { id: "week", title: "Week Without Fail", done: streak(data) >= 7 },
    { id: "xp100", title: "100 XP Earned", done: t.earned >= 100 },
    { id: "first-buy", title: "First Purchase", done: bought }
  ];
}

module.exports = {
  coreAttributes,
  achievements
};
