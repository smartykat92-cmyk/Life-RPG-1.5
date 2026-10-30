// Quest system for Grindstone.
// Supports 4 quest types: quest, main_quest, bounty, event
// Plus the Codex (quick capture inbox — "Unbound Scrolls").

const { uid, dateKey } = require("../utils");
const {
  QUEST_XP_STANDARD,
  QUEST_XP_MAJOR,
  MAIN_QUEST_XP,
  MAIN_QUEST_STEP_XP,
  BOUNTY_XP,
  EVENT_XP_SHORT,
  EVENT_XP_MEDIUM,
  EVENT_XP_LONG,
  EVENT_XP_EXTENDED,
  EVENT_SUBTASK_XP,
  BOUNTY_DAILY_CAP
} = require("../constants");

// ── Helpers ──

function ensureQuests(data) {
  if (!Array.isArray(data.quests)) data.quests = [];
}

function ensureCodex(data) {
  if (!Array.isArray(data.codex)) data.codex = [];
}

function ensureLog(data) {
  if (!Array.isArray(data.log)) data.log = [];
}

// ── Queries ──

function activeQuests(data) {
  ensureQuests(data);
  return data.quests.filter(q => !q.completed && !q.abandoned);
}

function completedQuests(data) {
  ensureQuests(data);
  return data.quests.filter(q => q.completed);
}

function questsByType(data, type) {
  return activeQuests(data).filter(q => (q.type || "quest") === type);
}

function completedByType(data, type) {
  return completedQuests(data).filter(q => (q.type || "quest") === type);
}

// ── XP Calculation ──

function questXP(quest) {
  const type = quest.type || "quest";

  if (type === "main_quest") {
    // Full chain completion XP
    return MAIN_QUEST_XP;
  }
  if (type === "bounty") {
    return BOUNTY_XP;
  }
  if (type === "event") {
    return eventXP(quest);
  }
  // Standard quest
  return quest.priority === "major" ? QUEST_XP_MAJOR : QUEST_XP_STANDARD;
}

function eventXP(quest) {
  const days = eventDuration(quest);
  if (days >= 15) return EVENT_XP_EXTENDED;
  if (days >= 8) return EVENT_XP_LONG;
  if (days >= 4) return EVENT_XP_MEDIUM;
  return EVENT_XP_SHORT;
}

function eventDuration(quest) {
  if (!quest.startDate || !quest.endDate) return 1;
  const start = new Date(quest.startDate);
  const end = new Date(quest.endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diff);
}

// ── CRUD: All Quest Types ──

function applyQuestAdd(data, questInput) {
  ensureQuests(data);
  ensureLog(data);

  const type = questInput.type || "quest";
  const quest = {
    id: uid("quest"),
    type,
    title: questInput.title,
    description: questInput.description || "",
    area: questInput.area || "craft",
    completed: false,
    completedDate: null,
    abandoned: false,
    createdDate: new Date().toISOString()
  };

  // Type-specific fields
  if (type === "quest") {
    quest.priority = questInput.priority || "standard";
    quest.deadline = questInput.deadline || null;
    quest.subtasks = Array.isArray(questInput.subtasks) ? questInput.subtasks : [];
  }

  if (type === "main_quest") {
    quest.steps = Array.isArray(questInput.steps) ? questInput.steps.map((s, i) => ({
      id: uid("step"),
      title: s.title || `Step ${i + 1}`,
      description: s.description || "",
      completed: false,
      completedDate: null
    })) : [];
    quest.targetDate = questInput.targetDate || null;
  }

  if (type === "bounty") {
    quest.repeatable = true;
    quest.completionCount = 0;
    quest.lastCompletedDate = null;
  }

  if (type === "event") {
    quest.startDate = questInput.startDate || null;
    quest.endDate = questInput.endDate || null;
    quest.dailyTasks = Array.isArray(questInput.dailyTasks) ? questInput.dailyTasks : [];
  }

  data.quests.push(quest);

  data.log.push({
    type: "quest-added",
    questType: type,
    questId: quest.id,
    title: quest.title,
    timestamp: new Date().toISOString()
  });

  return { data, quest };
}

function applyQuestComplete(data, questId) {
  const quest = (data.quests || []).find(q => q.id === questId);
  if (!quest) return { data, quest };
  ensureLog(data);

  const type = quest.type || "quest";

  if (type === "bounty") {
    // Bounties don't "complete" — they get claimed (increment count)
    return applyBountyClaim(data, questId);
  }

  if (quest.completed) return { data, quest };
  quest.completed = true;
  quest.completedDate = new Date().toISOString();

  data.log.push({
    type: "quest-completed",
    questType: type,
    questId: quest.id,
    title: quest.title,
    xp: questXP(quest),
    timestamp: new Date().toISOString()
  });

  return { data, quest };
}

function applyBountyClaim(data, questId) {
  const quest = (data.quests || []).find(q => q.id === questId);
  if (!quest || (quest.type || "quest") !== "bounty") return { data, quest };
  ensureLog(data);

  // Check daily cap
  const today = dateKey();
  const todayClaims = (data.log || []).filter(
    e => e.type === "bounty-claimed" && e.questId === questId && e.dayKey === today
  ).length;

  if (todayClaims >= BOUNTY_DAILY_CAP) {
    return { data, quest, capped: true };
  }

  quest.completionCount = (quest.completionCount || 0) + 1;
  quest.lastCompletedDate = new Date().toISOString();

  data.log.push({
    type: "bounty-claimed",
    questId: quest.id,
    title: quest.title,
    xp: BOUNTY_XP,
    dayKey: today,
    claimNumber: quest.completionCount,
    timestamp: new Date().toISOString()
  });

  return { data, quest, claimed: true };
}

function applyMainQuestStepComplete(data, questId, stepId) {
  const quest = (data.quests || []).find(q => q.id === questId);
  if (!quest || (quest.type || "quest") !== "main_quest") return { data, quest };
  ensureLog(data);

  const step = (quest.steps || []).find(s => s.id === stepId);
  if (!step || step.completed) return { data, quest };

  step.completed = true;
  step.completedDate = new Date().toISOString();

  data.log.push({
    type: "main-quest-step-completed",
    questId: quest.id,
    stepId: step.id,
    title: `${quest.title}: ${step.title}`,
    xp: MAIN_QUEST_STEP_XP,
    timestamp: new Date().toISOString()
  });

  // Check if all steps complete → auto-complete the chain
  const allDone = (quest.steps || []).every(s => s.completed);
  if (allDone) {
    quest.completed = true;
    quest.completedDate = new Date().toISOString();

    data.log.push({
      type: "main-quest-chain-completed",
      questId: quest.id,
      title: quest.title,
      xp: MAIN_QUEST_XP,
      timestamp: new Date().toISOString()
    });
  }

  return { data, quest, allDone };
}

function applyEventDailyTaskComplete(data, questId, taskIndex) {
  const quest = (data.quests || []).find(q => q.id === questId);
  if (!quest || (quest.type || "quest") !== "event") return { data, quest };
  ensureLog(data);

  if (!quest.dailyTasks || !quest.dailyTasks[taskIndex]) return { data, quest };
  const task = quest.dailyTasks[taskIndex];
  if (task.completed) return { data, quest };

  task.completed = true;
  task.completedDate = new Date().toISOString();

  data.log.push({
    type: "event-task-completed",
    questId: quest.id,
    title: `${quest.title}: ${task.title}`,
    xp: EVENT_SUBTASK_XP,
    timestamp: new Date().toISOString()
  });

  return { data, quest };
}

function applyQuestAbandon(data, questId) {
  const quest = (data.quests || []).find(q => q.id === questId);
  if (!quest || quest.completed || quest.abandoned) return { data, quest };
  ensureLog(data);

  quest.abandoned = true;

  data.log.push({
    type: "quest-abandoned",
    questType: quest.type || "quest",
    questId: quest.id,
    title: quest.title,
    timestamp: new Date().toISOString()
  });

  return { data, quest };
}

function applyQuestUpdate(data, questId, patch) {
  const quest = (data.quests || []).find(q => q.id === questId);
  if (!quest) return { data, quest };
  const allowed = ["title", "description", "area", "priority", "deadline", "targetDate", "startDate", "endDate", "steps", "dailyTasks", "subtasks"];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) quest[key] = patch[key];
  }
  return { data, quest };
}

function applyQuestDelete(data, questId) {
  ensureQuests(data);
  data.quests = data.quests.filter(q => q.id !== questId);
  return { data, questId };
}

// ── Codex (Quick Capture Inbox) ──

function applyCodexAdd(data, scrollInput) {
  ensureCodex(data);
  const scroll = {
    id: uid("scroll"),
    text: scrollInput.text || "",
    createdDate: new Date().toISOString(),
    sorted: false
  };
  data.codex.push(scroll);
  return { data, scroll };
}

function applyCodexSort(data, scrollId, targetType, questInput) {
  ensureCodex(data);
  const scroll = data.codex.find(s => s.id === scrollId);
  if (!scroll || scroll.sorted) return { data };

  scroll.sorted = true;
  scroll.sortedTo = targetType;
  scroll.sortedDate = new Date().toISOString();

  // Create the quest from this codex entry
  const input = {
    ...questInput,
    type: targetType,
    title: questInput.title || scroll.text
  };
  const result = applyQuestAdd(data, input);

  return { data, scroll, quest: result.quest };
}

function applyCodexDismiss(data, scrollId) {
  ensureCodex(data);
  const scroll = data.codex.find(s => s.id === scrollId);
  if (!scroll) return { data };
  scroll.sorted = true;
  scroll.sortedTo = "dismissed";
  scroll.sortedDate = new Date().toISOString();
  return { data, scroll };
}

function applyCodexDelete(data, scrollId) {
  ensureCodex(data);
  data.codex = data.codex.filter(s => s.id !== scrollId);
  return { data };
}

function unsortedScrolls(data) {
  ensureCodex(data);
  return data.codex.filter(s => !s.sorted);
}

// ── Sorting ──

function sortedByDeadline(quests) {
  return [...quests].sort((a, b) => {
    const aDate = a.deadline || a.targetDate || a.endDate;
    const bDate = b.deadline || b.targetDate || b.endDate;
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return new Date(aDate) - new Date(bDate);
  });
}

function isOverdue(quest) {
  const deadline = quest.deadline || quest.targetDate || quest.endDate;
  if (!deadline || quest.completed || quest.abandoned) return false;
  return new Date(deadline) < new Date();
}

// Main quest progress (steps done / total)
function mainQuestProgress(quest) {
  if ((quest.type || "quest") !== "main_quest") return { done: 0, total: 0, percent: 0 };
  const steps = quest.steps || [];
  const done = steps.filter(s => s.completed).length;
  return { done, total: steps.length, percent: steps.length ? Math.round(done / steps.length * 100) : 0 };
}

// Bounty claims today
function bountyClaimsToday(data, questId) {
  const today = dateKey();
  return (data.log || []).filter(
    e => e.type === "bounty-claimed" && e.questId === questId && e.dayKey === today
  ).length;
}

module.exports = {
  activeQuests,
  completedQuests,
  questsByType,
  completedByType,
  questXP,
  eventXP,
  eventDuration,
  applyQuestAdd,
  applyQuestComplete,
  applyBountyClaim,
  applyMainQuestStepComplete,
  applyEventDailyTaskComplete,
  applyQuestAbandon,
  applyQuestUpdate,
  applyQuestDelete,
  applyCodexAdd,
  applyCodexSort,
  applyCodexDismiss,
  applyCodexDelete,
  unsortedScrolls,
  sortedByDeadline,
  isOverdue,
  mainQuestProgress,
  bountyClaimsToday
};
