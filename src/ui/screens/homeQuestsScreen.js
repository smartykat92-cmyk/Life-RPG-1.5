// Active Home quests panel renderer for Vibe RPG.
// Receives config, helpers, and components from main-entry; does not access plugin state directly.

function renderHomeQuestsScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const selectedKey = ctx.selectedDateKey;
  const dayStats = ctx.dayStats;
  const sortedDayKeys = ctx.sortedDayKeys;
  const streak = ctx.streak;
  const getQuestStatsCards = ctx.getQuestStatsCards;
  const questStatsCards = ctx.questStatsCards || [];
  const createStatCard = ctx.createStatCard;
  const today = dayStats(data, selectedKey);
  const keys = sortedDayKeys(data);
  const week = keys.slice(-7).map(key => dayStats(data, key));
  const doneWeek = week.filter(day => day.percent >= 50).length;
  const values = {
    dailyXp: `${today.xp} XP`,
    minimum: `${Math.min(today.done, 3)}/3`,
    total: `${today.done}/${today.total}`,
    strongDays: `${doneWeek}/5`,
    streak: `${streak(data)} дней`
  };
  const grid = parent.createDiv({ cls: "vrpg-card-grid" });
  for (const card of getQuestStatsCards(data, values, questStatsCards, selectedKey)) {
    createStatCard(grid, { className: "vrpg-panel", label: card.label, value: card.value, note: card.note });
  }
}

module.exports = {
  renderHomeQuestsScreen
};
