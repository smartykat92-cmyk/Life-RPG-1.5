// Active Home today panel renderer for Grindstone.
// Shows dailies checklist with day-of-week filtering, daily bounty progress.

function renderHomeTodayScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const selectedDateKey = ctx.selectedDateKey;
  const dateKey = ctx.dateKey;
  const displayDateFromKey = ctx.displayDateFromKey;
  const getDay = ctx.getDay;
  const readDayStats = ctx.readDayStats;
  const activeHabits = ctx.activeHabits;
  const moods = ctx.moods || {};
  const setMood = ctx.setMood || (() => {});
  const toggleHabit = ctx.toggleHabit || (() => {});

  const key = selectedDateKey || dateKey();
  const today = getDay(data, key);
  const stats = readDayStats(data, key, today);

  // Get habits filtered by day-of-week for the selected date
  const dateFromKey = ctx.dateFromKey;
  const selectedDate = dateFromKey ? dateFromKey(key) : new Date();
  const habits = activeHabits(data, selectedDate);

  const header = parent.createDiv({ cls: "vrpg-panel vrpg-day-focus vrpg-day-focus-compact" });
  const summary = header.createDiv({ cls: "vrpg-day-focus-summary" });
  const displayKey = displayDateFromKey ? displayDateFromKey(key) : key;
  summary.createDiv({ cls: "vrpg-card-title", text: displayKey });
  summary.createDiv({ cls: "vrpg-subtitle", text: `${stats.done}/${stats.total} dailies · ${stats.xp} XP` });

  // Daily Bounty indicator (3+ dailies = bonus)
  const bountyDone = stats.done >= 3;
  const bountyRow = header.createDiv({ cls: bountyDone ? "vrpg-bounty is-done" : "vrpg-bounty" });
  bountyRow.createSpan({ text: bountyDone ? "🎯 Daily Bounty Complete!" : `🎯 Daily Bounty: ${Math.min(stats.done, 3)}/3` });

  // Mood
  const mood = header.createDiv({ cls: "vrpg-mood-row" });
  mood.createDiv({ cls: "vrpg-section", text: "Mood / Energy" });
  const moodButtons = mood.createDiv({ cls: "vrpg-segmented" });
  Object.entries(moods).forEach(([id, label]) => {
    const button = moodButtons.createEl("button", { cls: today.mood === id ? "is-active" : "", text: label });
    button.onclick = () => setMood(id, key);
  });

  // Dailies checklist
  const list = parent.createDiv({ cls: "vrpg-card-grid vrpg-today-check-grid" });
  for (const habit of habits) {
    const done = !!today.completed[habit.id];
    const button = list.createEl("button", {
      cls: done ? "vrpg-check is-done" : "vrpg-check",
      text: `${habit.icon || "•"} ${habit.title}`
    });
    button.onclick = () => toggleHabit(habit.id, key);
  }

  if (habits.length === 0) {
    list.createDiv({ cls: "vrpg-subtitle", text: "No dailies scheduled for today." });
  }
}

module.exports = {
  renderHomeTodayScreen
};
