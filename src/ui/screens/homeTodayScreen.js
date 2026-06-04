// Active Home today panel renderer for Vibe RPG.
// Receives data, helpers, and callbacks from main-entry; does not access plugin state directly.

function renderHomeTodayScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const selectedDateKey = ctx.selectedDateKey;
  const dateKey = ctx.dateKey;
  const getDay = ctx.getDay;
  const readDayStats = ctx.readDayStats;
  const activeHabits = ctx.activeHabits;
  const moods = ctx.moods || {};
  const setMood = ctx.setMood || (() => {});
  const toggleHabit = ctx.toggleHabit || (() => {});
  const key = selectedDateKey || dateKey();
  const today = getDay(data, key);
  const stats = readDayStats(data, key, today);
  const habits = activeHabits(data);
  const header = parent.createDiv({ cls: "vrpg-panel vrpg-day-focus vrpg-day-focus-compact" });
  const summary = header.createDiv({ cls: "vrpg-day-focus-summary" });
  summary.createDiv({ cls: "vrpg-card-title", text: key });
  summary.createDiv({ cls: "vrpg-subtitle", text: `${stats.done}/${stats.total} привычек · ${stats.xp} XP` });
  const mood = header.createDiv({ cls: "vrpg-mood-row" });
  mood.createDiv({ cls: "vrpg-section", text: "Настроение / энергия" });
  const moodButtons = mood.createDiv({ cls: "vrpg-segmented" });
  Object.entries(moods).forEach(([id, label]) => {
    const button = moodButtons.createEl("button", { cls: today.mood === id ? "is-active" : "", text: label });
    button.onclick = () => setMood(id, key);
  });
  const list = parent.createDiv({ cls: "vrpg-card-grid vrpg-today-check-grid" });
  for (const habit of habits) {
    const done = !!today.completed[habit.id];
    const button = list.createEl("button", {
      cls: done ? "vrpg-check is-done" : "vrpg-check",
      text: `${habit.icon || "•"} ${habit.title}`
    });
    button.onclick = () => toggleHabit(habit.id, key);
  }
}

module.exports = {
  renderHomeTodayScreen
};
