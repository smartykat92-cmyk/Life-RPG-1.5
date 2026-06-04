// Quest stats panel configuration.
// Toggle cards with enabled true/false; values are still calculated in renderHomeQuests.

const QUEST_STATS_CARDS = [
  { id: "dailyXp", label: "XP за день", enabled: true },
  { id: "minimum", label: "Минимум дня", enabled: true },
  { id: "total", label: "Привычки дня", enabled: true },
  { id: "strongDays", label: "Сильных дней за неделю", enabled: true },
  { id: "streak", label: "Серия", enabled: true }
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
