// Quest stats panel configuration.
// Toggle cards with enabled true/false; values are still calculated in renderHomeQuests.

const QUEST_STATS_CARDS = [
  { id: "dailyXp", label: "Daily XP", enabled: true },
  { id: "minimum", label: "Day's Minimum", enabled: true },
  { id: "total", label: "Today's Habits", enabled: true },
  { id: "strongDays", label: "Strong Days This Week", enabled: true },
  { id: "streak", label: "Streak", enabled: true }
];

function createDefaultQuestStatsCards() {
  return QUEST_STATS_CARDS.reduce((result, card) => {
    result[card.id] = {
      enabled: card.enabled !== false,
      label: card.label
    };
    return result;
  }, {});
}

module.exports = {
  QUEST_STATS_CARDS,
  createDefaultQuestStatsCards
};
