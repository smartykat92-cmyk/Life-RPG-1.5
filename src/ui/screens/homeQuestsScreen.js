// Active Home quests panel renderer for Grindstone.
// Shows real quest items with deadlines, categories, priorities — NOT stat cards.

const { AREA_LABELS, QUEST_PRIORITIES } = require("../../constants");
const { activeQuests, completedQuests, questXP, sortedByDeadline, isOverdue } = require("../../systems/questSystem");

function renderHomeQuestsScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const completeQuest = ctx.completeQuest || (() => {});
  const abandonQuest = ctx.abandonQuest || (() => {});
  const displayDate = ctx.displayDate;

  const active = sortedByDeadline(activeQuests(data));
  const done = completedQuests(data);

  // Active quests
  const activePanel = parent.createDiv({ cls: "vrpg-panel" });
  activePanel.createDiv({ cls: "vrpg-section", text: "⚔️ Active Quests" });

  if (active.length === 0) {
    activePanel.createDiv({ cls: "vrpg-subtitle", text: "No active quests. Add one in Settings → Quests." });
  }

  for (const quest of active) {
    const overdue = isOverdue(quest);
    const card = activePanel.createDiv({ cls: overdue ? "vrpg-quest-card is-overdue" : "vrpg-quest-card" });
    const header = card.createDiv({ cls: "vrpg-quest-header" });

    const priorityTag = quest.priority === "major" ? "⭐ MAJOR" : "STANDARD";
    header.createDiv({ cls: `vrpg-quest-priority vrpg-priority-${quest.priority}`, text: priorityTag });

    card.createDiv({ cls: "vrpg-card-title", text: quest.title });

    if (quest.description) {
      card.createDiv({ cls: "vrpg-subtitle", text: quest.description });
    }

    const meta = card.createDiv({ cls: "vrpg-quest-meta" });
    meta.createSpan({ text: `${AREA_LABELS[quest.area] || quest.area}` });
    meta.createSpan({ text: ` · ${questXP(quest)} XP / Gold` });
    if (quest.deadline) {
      const deadlineDate = new Date(quest.deadline);
      const deadlineStr = displayDate ? displayDate(deadlineDate) : quest.deadline;
      meta.createSpan({ cls: overdue ? "vrpg-overdue" : "", text: ` · Due: ${deadlineStr}` });
    }

    const actions = card.createDiv({ cls: "vrpg-quest-actions" });
    const doneBtn = actions.createEl("button", { cls: "vrpg-primary", text: "✓ Complete" });
    doneBtn.onclick = () => completeQuest(quest.id);
    const abandonBtn = actions.createEl("button", { cls: "vrpg-danger", text: "✗ Abandon" });
    abandonBtn.onclick = () => abandonQuest(quest.id);
  }

  // Completed quests
  if (done.length > 0) {
    const donePanel = parent.createDiv({ cls: "vrpg-panel" });
    donePanel.createDiv({ cls: "vrpg-section", text: "✅ Completed Quests" });
    const recentDone = done.slice(-5).reverse();
    for (const quest of recentDone) {
      const row = donePanel.createDiv({ cls: "vrpg-quest-done" });
      row.createSpan({ text: `${quest.title}` });
      row.createSpan({ cls: "vrpg-subtitle", text: ` · ${questXP(quest)} XP earned` });
    }
    if (done.length > 5) {
      donePanel.createDiv({ cls: "vrpg-subtitle", text: `...and ${done.length - 5} more` });
    }
  }
}

module.exports = {
  renderHomeQuestsScreen
};
