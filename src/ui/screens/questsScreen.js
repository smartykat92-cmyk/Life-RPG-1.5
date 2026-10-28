// Quests screen renderer for Vibe RPG.
// Receives data and system functions from main.js; does not access plugin state directly.

function renderQuestsScreen(parent, ctx = {}) {
  const data = ctx.data;
  const { dayStats, sortedDayKeys } = ctx.systems;
  const today = dayStats(data);
  const keys = sortedDayKeys(data);
  const week = keys.slice(-7).map(key => dayStats(data, key));
  const bodyToday = today.areaDone.body > 0;
  const allAreas = ["body", "mind", "craft", "control"].every(area => today.areaDone[area] > 0 || today.areaTotal[area] === 0);
  const fiveFilled = week.filter(day => day.percent >= 50).length >= 5;
  const rows = [
    ["Complete 3 habits today", today.done >= 3, `${today.done}/3`],
    ["Complete a body activity", bodyToday, bodyToday ? "done" : "0/1"],
    ["Complete all areas for the day", allAreas, allAreas ? "done" : "not all"],
    ["5 strong days per week", fiveFilled, `${week.filter(day => day.percent >= 50).length}/5`]
  ];
  const panel = parent.createDiv({ cls: "vrpg-hero-card" });
  panel.createDiv({ cls: "vrpg-kicker", text: "Quests" });
  panel.createDiv({ cls: "vrpg-title", text: `${rows.filter(row => row[1]).length}/${rows.length}` });
  panel.createDiv({ cls: "vrpg-subtitle", text: "Habits are counted automatically from day buttons." });
  const list = parent.createDiv({ cls: "vrpg-card-grid" });
  for (const [title, done, progress] of rows) {
    const card = list.createDiv({ cls: done ? "vrpg-panel is-complete" : "vrpg-panel" });
    card.createDiv({ cls: "vrpg-section", text: done ? "Completed" : "In Progress" });
    card.createDiv({ cls: "vrpg-card-title", text: title });
    card.createDiv({ cls: "vrpg-subtitle", text: progress });
  }
}

module.exports = {
  renderQuestsScreen
};
