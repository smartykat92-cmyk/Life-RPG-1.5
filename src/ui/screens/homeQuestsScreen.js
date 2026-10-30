// Active Home quests panel renderer for Grindstone.
// Tabbed view: Main Quests | Quests | Bounties | Events | Codex

const { AREA_LABELS } = require("../../constants");
const {
  activeQuests,
  completedQuests,
  questXP,
  sortedByDeadline,
  isOverdue,
  questsByType,
  completedByType,
  mainQuestProgress,
  bountyClaimsToday
} = require("../../systems/questSystem");

// Persist selected tab across re-renders
let selectedQuestTab = "quests";

function renderHomeQuestsScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const completeQuest = ctx.completeQuest || (() => {});
  const abandonQuest = ctx.abandonQuest || (() => {});
  const claimBounty = ctx.claimBounty || (() => {});
  const completeMainQuestStep = ctx.completeMainQuestStep || (() => {});
  const completeEventTask = ctx.completeEventTask || (() => {});
  const addCodexEntry = ctx.addCodexEntry || (() => {});
  const sortCodexEntry = ctx.sortCodexEntry || (() => {});
  const dismissCodexEntry = ctx.dismissCodexEntry || (() => {});
  const deleteCodexEntry = ctx.deleteCodexEntry || (() => {});
  const displayDate = ctx.displayDate;
  const questTypes = ctx.questTypes || {};
  const questTypeIcons = ctx.questTypeIcons || {};
  const bountyDailyCap = ctx.bountyDailyCap || 5;
  const unsortedScrollsFn = ctx.unsortedScrolls || (() => []);

  const unsorted = unsortedScrollsFn(data);

  // Tab bar
  const tabBar = parent.createDiv({ cls: "vrpg-quest-tabs" });
  const tabs = [
    { id: "main_quest", label: "🏰 Main", count: questsByType(data, "main_quest").length },
    { id: "quests", label: "⚔️ Quests", count: questsByType(data, "quest").length },
    { id: "bounties", label: "🎯 Bounties", count: questsByType(data, "bounty").length },
    { id: "events", label: "🔥 Events", count: questsByType(data, "event").length },
    { id: "codex", label: "📜 Codex", count: unsorted.length }
  ];

  for (const tab of tabs) {
    const btn = tabBar.createEl("button", {
      cls: selectedQuestTab === tab.id ? "vrpg-quest-tab is-active" : "vrpg-quest-tab"
    });
    btn.createSpan({ text: tab.label });
    if (tab.count > 0) {
      btn.createSpan({ cls: "vrpg-tab-badge", text: String(tab.count) });
    }
    btn.onclick = () => {
      selectedQuestTab = tab.id;
      parent.empty();
      renderHomeQuestsScreen(parent, ctx);
    };
  }

  const body = parent.createDiv({ cls: "vrpg-quest-body" });

  if (selectedQuestTab === "main_quest") {
    renderMainQuests(body, data, ctx);
  } else if (selectedQuestTab === "quests") {
    renderStandardQuests(body, data, ctx);
  } else if (selectedQuestTab === "bounties") {
    renderBounties(body, data, ctx);
  } else if (selectedQuestTab === "events") {
    renderEvents(body, data, ctx);
  } else if (selectedQuestTab === "codex") {
    renderCodex(body, data, ctx);
  }
}

// ── Main Quests (chain with steps) ──

function renderMainQuests(parent, data, ctx) {
  const active = questsByType(data, "main_quest");
  const done = completedByType(data, "main_quest");

  if (active.length === 0 && done.length === 0) {
    renderEmptyState(parent, "🏰", "No Main Quests", "Main Quests are long-term goals broken into steps. Add one in Settings → Quests.");
    return;
  }

  for (const quest of active) {
    const progress = mainQuestProgress(quest);
    const card = parent.createDiv({ cls: "vrpg-quest-card vrpg-type-main-quest" });

    const header = card.createDiv({ cls: "vrpg-quest-header" });
    header.createDiv({ cls: "vrpg-quest-type-badge", text: "🏰 MAIN QUEST" });
    if (quest.targetDate) {
      const overdue = isOverdue(quest);
      const dateStr = ctx.displayDate ? ctx.displayDate(new Date(quest.targetDate)) : quest.targetDate;
      header.createDiv({ cls: overdue ? "vrpg-quest-deadline vrpg-overdue" : "vrpg-quest-deadline", text: `Target: ${dateStr}` });
    }

    card.createDiv({ cls: "vrpg-card-title", text: quest.title });
    if (quest.description) card.createDiv({ cls: "vrpg-subtitle", text: quest.description });

    // Progress bar
    const progWrap = card.createDiv({ cls: "vrpg-mq-progress" });
    progWrap.createDiv({ cls: "vrpg-mq-progress-text", text: `${progress.done}/${progress.total} steps · ${progress.percent}%` });
    const bar = progWrap.createDiv({ cls: "vrpg-mq-bar" });
    bar.createDiv({ cls: "vrpg-mq-fill" }).style.width = `${progress.percent}%`;

    // Steps list
    const steps = quest.steps || [];
    if (steps.length > 0) {
      const stepList = card.createDiv({ cls: "vrpg-mq-steps" });
      for (const step of steps) {
        const stepRow = stepList.createDiv({ cls: step.completed ? "vrpg-mq-step is-done" : "vrpg-mq-step" });
        const check = stepRow.createEl("button", {
          cls: step.completed ? "vrpg-step-check is-checked" : "vrpg-step-check",
          text: step.completed ? "✓" : "○"
        });
        if (!step.completed) {
          check.onclick = () => ctx.completeMainQuestStep(quest.id, step.id);
        }
        stepRow.createSpan({ cls: "vrpg-step-title", text: step.title });
        if (step.completed) {
          stepRow.createSpan({ cls: "vrpg-step-xp", text: "✓ 25 XP" });
        } else {
          stepRow.createSpan({ cls: "vrpg-step-xp", text: "25 XP" });
        }
      }
    }

    const meta = card.createDiv({ cls: "vrpg-quest-meta" });
    meta.createSpan({ text: `${AREA_LABELS[quest.area] || quest.area} · 200 XP chain bonus` });

    const actions = card.createDiv({ cls: "vrpg-quest-actions" });
    const abandonBtn = actions.createEl("button", { cls: "vrpg-danger vrpg-sm", text: "Abandon" });
    abandonBtn.onclick = () => ctx.abandonQuest(quest.id);
  }

  renderCompletedSection(parent, done, "🏰", ctx);
}

// ── Standard Quests ──

function renderStandardQuests(parent, data, ctx) {
  const active = sortedByDeadline(questsByType(data, "quest"));
  const done = completedByType(data, "quest");

  if (active.length === 0 && done.length === 0) {
    renderEmptyState(parent, "⚔️", "No Quests", "Quests are one-off goals with optional deadlines. Add one in Settings → Quests.");
    return;
  }

  for (const quest of active) {
    const overdue = isOverdue(quest);
    const card = parent.createDiv({ cls: overdue ? "vrpg-quest-card vrpg-type-quest is-overdue" : "vrpg-quest-card vrpg-type-quest" });

    const header = card.createDiv({ cls: "vrpg-quest-header" });
    const priorityTag = quest.priority === "major" ? "⭐ MAJOR" : "STANDARD";
    header.createDiv({ cls: `vrpg-quest-priority vrpg-priority-${quest.priority || "standard"}`, text: priorityTag });

    card.createDiv({ cls: "vrpg-card-title", text: quest.title });
    if (quest.description) card.createDiv({ cls: "vrpg-subtitle", text: quest.description });

    // Subtasks
    const subtasks = quest.subtasks || [];
    if (subtasks.length > 0) {
      const stList = card.createDiv({ cls: "vrpg-quest-subtasks" });
      for (const st of subtasks) {
        stList.createDiv({ cls: "vrpg-subtitle", text: `• ${st}` });
      }
    }

    const meta = card.createDiv({ cls: "vrpg-quest-meta" });
    meta.createSpan({ text: `${AREA_LABELS[quest.area] || quest.area} · ${questXP(quest)} XP + Gold` });
    if (quest.deadline) {
      const dStr = ctx.displayDate ? ctx.displayDate(new Date(quest.deadline)) : quest.deadline;
      meta.createSpan({ cls: overdue ? "vrpg-overdue" : "", text: ` · Due: ${dStr}` });
    }

    const actions = card.createDiv({ cls: "vrpg-quest-actions" });
    const doneBtn = actions.createEl("button", { cls: "vrpg-primary", text: "✓ Complete" });
    doneBtn.onclick = () => ctx.completeQuest(quest.id);
    const abandonBtn = actions.createEl("button", { cls: "vrpg-danger vrpg-sm", text: "Abandon" });
    abandonBtn.onclick = () => ctx.abandonQuest(quest.id);
  }

  renderCompletedSection(parent, done, "⚔️", ctx);
}

// ── Bounties (repeatable, no schedule, daily cap) ──

function renderBounties(parent, data, ctx) {
  const active = questsByType(data, "bounty");
  const bountyDailyCap = ctx.bountyDailyCap || 5;

  if (active.length === 0) {
    renderEmptyState(parent, "🎯", "No Bounties", "Bounties are small repeatable tasks you can claim daily for quick XP. Add one in Settings → Quests.");
    return;
  }

  for (const quest of active) {
    const todayClaims = bountyClaimsToday(data, quest.id);
    const capped = todayClaims >= bountyDailyCap;
    const card = parent.createDiv({ cls: "vrpg-quest-card vrpg-type-bounty" });

    card.createDiv({ cls: "vrpg-quest-type-badge", text: "🎯 BOUNTY" });
    card.createDiv({ cls: "vrpg-card-title", text: quest.title });
    if (quest.description) card.createDiv({ cls: "vrpg-subtitle", text: quest.description });

    const meta = card.createDiv({ cls: "vrpg-quest-meta" });
    meta.createSpan({ text: `${AREA_LABELS[quest.area] || quest.area} · 15 XP per claim` });
    meta.createSpan({ text: ` · ${quest.completionCount || 0} total claims` });
    meta.createSpan({ text: ` · Today: ${todayClaims}/${bountyDailyCap}` });

    const actions = card.createDiv({ cls: "vrpg-quest-actions" });
    if (capped) {
      const cappedBtn = actions.createEl("button", { cls: "vrpg-disabled", text: "Daily Cap Reached" });
      cappedBtn.disabled = true;
    } else {
      const claimBtn = actions.createEl("button", { cls: "vrpg-primary", text: "🎯 Claim Bounty" });
      claimBtn.onclick = () => ctx.claimBounty(quest.id);
    }
    const removeBtn = actions.createEl("button", { cls: "vrpg-danger vrpg-sm", text: "Remove" });
    removeBtn.onclick = () => ctx.abandonQuest(quest.id);
  }
}

// ── Events (date range with daily sub-tasks) ──

function renderEvents(parent, data, ctx) {
  const active = sortedByDeadline(questsByType(data, "event"));
  const done = completedByType(data, "event");

  if (active.length === 0 && done.length === 0) {
    renderEmptyState(parent, "🔥", "No Events", "Events are time-boxed challenges with daily tasks. Add one in Settings → Quests.");
    return;
  }

  for (const quest of active) {
    const overdue = isOverdue(quest);
    const card = parent.createDiv({ cls: overdue ? "vrpg-quest-card vrpg-type-event is-overdue" : "vrpg-quest-card vrpg-type-event" });

    card.createDiv({ cls: "vrpg-quest-type-badge", text: "🔥 EVENT" });
    card.createDiv({ cls: "vrpg-card-title", text: quest.title });
    if (quest.description) card.createDiv({ cls: "vrpg-subtitle", text: quest.description });

    // Date range
    if (quest.startDate || quest.endDate) {
      const dateRange = card.createDiv({ cls: "vrpg-quest-meta" });
      const start = quest.startDate ? (ctx.displayDate ? ctx.displayDate(new Date(quest.startDate)) : quest.startDate) : "?";
      const end = quest.endDate ? (ctx.displayDate ? ctx.displayDate(new Date(quest.endDate)) : quest.endDate) : "?";
      dateRange.createSpan({ text: `${start} → ${end}` });
      dateRange.createSpan({ text: ` · ${questXP(quest)} XP` });
    }

    // Daily tasks
    const tasks = quest.dailyTasks || [];
    if (tasks.length > 0) {
      const taskList = card.createDiv({ cls: "vrpg-event-tasks" });
      taskList.createDiv({ cls: "vrpg-subtitle", text: "Daily Tasks:" });
      tasks.forEach((task, i) => {
        const taskRow = taskList.createDiv({ cls: task.completed ? "vrpg-event-task is-done" : "vrpg-event-task" });
        const check = taskRow.createEl("button", {
          cls: task.completed ? "vrpg-step-check is-checked" : "vrpg-step-check",
          text: task.completed ? "✓" : "○"
        });
        if (!task.completed) {
          check.onclick = () => ctx.completeEventTask(quest.id, i);
        }
        taskRow.createSpan({ text: task.title || `Task ${i + 1}` });
        if (!task.completed) {
          taskRow.createSpan({ cls: "vrpg-step-xp", text: "15 XP" });
        }
      });
    }

    const actions = card.createDiv({ cls: "vrpg-quest-actions" });
    const doneBtn = actions.createEl("button", { cls: "vrpg-primary", text: "✓ Complete Event" });
    doneBtn.onclick = () => ctx.completeQuest(quest.id);
    const abandonBtn = actions.createEl("button", { cls: "vrpg-danger vrpg-sm", text: "Abandon" });
    abandonBtn.onclick = () => ctx.abandonQuest(quest.id);
  }

  renderCompletedSection(parent, done, "🔥", ctx);
}

// ── Codex (Quick Capture Inbox — "Unbound Scrolls") ──

function renderCodex(parent, data, ctx) {
  const unsorted = (ctx.unsortedScrolls || (() => []))(data);
  const questTypes = ctx.questTypes || {};

  // Quick capture input
  const captureBox = parent.createDiv({ cls: "vrpg-codex-capture" });
  captureBox.createDiv({ cls: "vrpg-section", text: "📜 Quick Capture" });
  const inputRow = captureBox.createDiv({ cls: "vrpg-codex-input-row" });
  const input = inputRow.createEl("input", {
    type: "text",
    placeholder: "Capture a thought, idea, or task...",
    cls: "vrpg-codex-input"
  });
  const addBtn = inputRow.createEl("button", { cls: "vrpg-primary", text: "Add" });
  addBtn.onclick = () => {
    const text = input.value.trim();
    if (text) ctx.addCodexEntry(text);
  };
  input.onkeydown = e => {
    if (e.key === "Enter") {
      const text = input.value.trim();
      if (text) ctx.addCodexEntry(text);
    }
  };

  // Unsorted scrolls
  if (unsorted.length === 0) {
    parent.createDiv({ cls: "vrpg-codex-empty" }).createDiv({
      cls: "vrpg-subtitle",
      text: "All scrolls have been sorted. Capture new ideas above."
    });
    return;
  }

  const scrollsPanel = parent.createDiv({ cls: "vrpg-codex-scrolls" });
  scrollsPanel.createDiv({ cls: "vrpg-section", text: `Unbound Scrolls (${unsorted.length})` });

  for (const scroll of unsorted) {
    const card = scrollsPanel.createDiv({ cls: "vrpg-codex-scroll" });
    card.createDiv({ cls: "vrpg-card-title", text: scroll.text });

    const actions = card.createDiv({ cls: "vrpg-codex-actions" });

    // Sort buttons — one per quest type
    for (const [typeId, typeLabel] of Object.entries(questTypes)) {
      const btn = actions.createEl("button", { cls: "vrpg-sm vrpg-codex-sort-btn", text: typeLabel });
      btn.onclick = () => ctx.sortCodexEntry(scroll.id, typeId, { title: scroll.text });
    }

    const dismissBtn = actions.createEl("button", { cls: "vrpg-sm vrpg-ghost", text: "Dismiss" });
    dismissBtn.onclick = () => ctx.dismissCodexEntry(scroll.id);
  }
}

// ── Shared Helpers ──

function renderEmptyState(parent, icon, title, subtitle) {
  const empty = parent.createDiv({ cls: "vrpg-empty-state" });
  empty.createDiv({ cls: "vrpg-empty-icon", text: icon });
  empty.createDiv({ cls: "vrpg-empty-title", text: title });
  empty.createDiv({ cls: "vrpg-subtitle", text: subtitle });
}

function renderCompletedSection(parent, done, icon, ctx) {
  if (done.length === 0) return;
  const panel = parent.createDiv({ cls: "vrpg-panel" });
  panel.createDiv({ cls: "vrpg-section", text: `${icon} Completed` });
  const recent = done.slice(-5).reverse();
  for (const quest of recent) {
    const row = panel.createDiv({ cls: "vrpg-quest-done" });
    row.createSpan({ text: quest.title });
    row.createSpan({ cls: "vrpg-subtitle", text: ` · ${questXP(quest)} XP earned` });
  }
  if (done.length > 5) {
    panel.createDiv({ cls: "vrpg-subtitle", text: `...and ${done.length - 5} more` });
  }
}

module.exports = {
  renderHomeQuestsScreen
};
