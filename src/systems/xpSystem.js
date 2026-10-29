// XP and level system for Vibe RPG.
// Dual currency: Lifetime XP (determines level, never drops) + Gold (spendable in shop).
// XP and Gold are earned in equal amounts from dailies and quests.

const { DAILY_XP, QUEST_XP_STANDARD, QUEST_XP_MAJOR } = require("../constants");

function heroTitle(level) {
  if (level >= 50) return "Legend";
  if (level >= 30) return "Champion";
  if (level >= 20) return "Rhythm Master";
  if (level >= 10) return "Strategist";
  if (level >= 5) return "Seeker";
  return "Novice";
}

function totals(data) {
  // Calculate lifetime XP from daily completions
  let earned = 0;
  for (const [key, day] of Object.entries(data.days)) {
    if (!day || !day.completed) continue;
    for (const habit of data.habits) {
      if (habit.enabled !== false && day.completed[habit.id]) {
        earned += DAILY_XP;
      }
    }
  }

  // Add XP from completed quests
  const quests = Array.isArray(data.quests) ? data.quests : [];
  for (const quest of quests) {
    if (quest.completed) {
      earned += quest.priority === "major" ? QUEST_XP_MAJOR : QUEST_XP_STANDARD;
    }
  }

  // Gold spent = sum of inventory purchases
  let spent = 0;
  for (const item of data.inventory) spent += Number(item.cost || 0);

  // Gold balance: total earned gold minus spent
  // Gold earned = same as XP earned, but tracked separately so spending doesn't affect level
  const goldEarned = earned;
  const goldBalance = Math.max(0, goldEarned - spent);

  return {
    earned,        // Lifetime XP — never decreases
    spent,         // Total gold spent
    balance: goldBalance,  // Current gold available
    level: Math.floor(earned / 100) + 1,
    levelXP: earned % 100,
    gold: goldBalance,
    goldEarned
  };
}

module.exports = {
  heroTitle,
  totals
};
