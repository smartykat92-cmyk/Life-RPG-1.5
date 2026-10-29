// Achievement and hero attribute business logic for Vibe RPG / Grindstone.
// Updated for 5 categories (body/mind/spirit/craft/hearth).

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
    ["Spirit", stats.spirit.total ? Math.round(stats.spirit.done / stats.spirit.total * 100) : 0],
    ["Craft", stats.craft.total ? Math.round(stats.craft.done / stats.craft.total * 100) : 0],
    ["Hearth", stats.hearth.total ? Math.round(stats.hearth.done / stats.hearth.total * 100) : 0]
  ];
}

function achievements(data) {
  const t = totals(data);
  const keys = sortedDayKeys(data);
  const currentStreak = streak(data);
  const hasCompleteDay = keys.some(key => {
    const stats = dayStats(data, key);
    return stats.total > 0 && stats.done === stats.total;
  });
  const bought = (data.inventory || []).length > 0;
  const questsDone = (data.quests || []).filter(q => q.completed).length;
  const dailyBountyDays = keys.filter(key => {
    const stats = dayStats(data, key);
    return stats.done >= 3;
  }).length;

  return [
    { id: "first-day", title: "First Day Complete", done: hasCompleteDay, icon: "⚔️" },
    { id: "three-streak", title: "3-Day Streak", done: currentStreak >= 3, icon: "🔥" },
    { id: "week", title: "Week Without Fail", done: currentStreak >= 7, icon: "🏆" },
    { id: "two-weeks", title: "Fortnight Fighter", done: currentStreak >= 14, icon: "⚡" },
    { id: "month", title: "Monthly Master", done: currentStreak >= 30, icon: "👑" },
    { id: "xp100", title: "100 XP Earned", done: t.earned >= 100, icon: "✨" },
    { id: "xp500", title: "500 XP Earned", done: t.earned >= 500, icon: "💎" },
    { id: "xp1000", title: "1000 XP Earned", done: t.earned >= 1000, icon: "🌟" },
    { id: "first-buy", title: "First Purchase", done: bought, icon: "🛒" },
    { id: "first-quest", title: "First Quest Complete", done: questsDone >= 1, icon: "📜" },
    { id: "five-quests", title: "Questmaster", done: questsDone >= 5, icon: "🗡️" },
    { id: "bounty-hunter", title: "Daily Bounty x10", done: dailyBountyDays >= 10, icon: "🎯" },
    { id: "level5", title: "Level 5 Reached", done: t.level >= 5, icon: "🛡️" },
    { id: "level10", title: "Level 10 Reached", done: t.level >= 10, icon: "⭐" },
    { id: "level20", title: "Level 20 Reached", done: t.level >= 20, icon: "🔱" }
  ];
}

module.exports = {
  coreAttributes,
  achievements
};
