// XP and level system for Vibe RPG / Grindstone.
// Dual currency: Lifetime XP (determines level, never drops) + Gold (spendable in shop).
// XP and Gold are earned in equal amounts from dailies and quests.

const { DAILY_XP, MAIN_QUEST_STEP_XP, BOUNTY_XP, EVENT_SUBTASK_XP } = require("../constants");
const { questXP } = require("./questSystem");

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

  // Add XP from completed quests (type-aware)
  const quests = Array.isArray(data.quests) ? data.quests : [];
  for (const quest of quests) {
    const type = quest.type || "quest";

    if (type === "bounty") {
      // Bounties: XP per claim (tracked in log)
      // Don't count here — counted from log below
      continue;
    }

    if (type === "main_quest") {
      // Main quest step XP from completed steps
      const steps = quest.steps || [];
      for (const step of steps) {
        if (step.completed) earned += MAIN_QUEST_STEP_XP;
      }
      // Chain completion bonus (only if all steps done)
      if (quest.completed) earned += questXP(quest);
      continue;
    }

    if (type === "event") {
      // Event daily task XP
      const tasks = quest.dailyTasks || [];
      for (const task of tasks) {
        if (task.completed) earned += EVENT_SUBTASK_XP;
      }
      // Event completion bonus
      if (quest.completed) earned += questXP(quest);
      continue;
    }

    // Standard quest
    if (quest.completed) {
      earned += questXP(quest);
    }
  }

  // Bounty XP from log entries (each claim = BOUNTY_XP)
  const log = Array.isArray(data.log) ? data.log : [];
  for (const entry of log) {
    if (entry.type === "bounty-claimed") {
      earned += BOUNTY_XP;
    }
  }

  // Gold spent = sum of inventory purchases
  let spent = 0;
  for (const item of data.inventory) spent += Number(item.cost || 0);

  // Gold balance: total earned gold minus spent
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
