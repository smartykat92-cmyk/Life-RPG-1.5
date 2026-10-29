// Quest system for Grindstone.
// Quests are real task items with deadlines, categories, and priorities.
// Priority determines XP/Gold reward: standard (50) or major (100).

const { uid } = require("../utils");
const { QUEST_XP_STANDARD, QUEST_XP_MAJOR } = require("../constants");

function activeQuests(data) {
  const quests = Array.isArray(data.quests) ? data.quests : [];
  return quests.filter(q => !q.completed && !q.abandoned);
}

function completedQuests(data) {
  const quests = Array.isArray(data.quests) ? data.quests : [];
  return quests.filter(q => q.completed);
}

function questXP(quest) {
  return quest.priority === "major" ? QUEST_XP_MAJOR : QUEST_XP_STANDARD;
}

function applyQuestAdd(data, questInput) {
  if (!Array.isArray(data.quests)) data.quests = [];
  const quest = {
    id: uid("quest"),
    title: questInput.title,
    description: questInput.description || "",
    area: questInput.area || "craft",
    priority: questInput.priority || "standard",
    deadline: questInput.deadline || null, // ISO date string or null
    completed: false,
    completedDate: null,
    abandoned: false,
    createdDate: new Date().toISOString()
  };
  data.quests.push(quest);

  // Log entry
  if (!Array.isArray(data.log)) data.log = [];
  data.log.push({
    type: "quest-added",
    questId: quest.id,
    title: quest.title,
    timestamp: new Date().toISOString()
  });

  return { data, quest };
}

function applyQuestComplete(data, questId) {
  const quest = (data.quests || []).find(q => q.id === questId);
  if (!quest || quest.completed) return { data, quest };

  quest.completed = true;
  quest.completedDate = new Date().toISOString();

  // Log entry
  if (!Array.isArray(data.log)) data.log = [];
  data.log.push({
    type: "quest-completed",
    questId: quest.id,
    title: quest.title,
    xp: questXP(quest),
    timestamp: new Date().toISOString()
  });

  return { data, quest };
}

function applyQuestAbandon(data, questId) {
  const quest = (data.quests || []).find(q => q.id === questId);
  if (!quest || quest.completed || quest.abandoned) return { data, quest };

  quest.abandoned = true;

  if (!Array.isArray(data.log)) data.log = [];
  data.log.push({
    type: "quest-abandoned",
    questId: quest.id,
    title: quest.title,
    timestamp: new Date().toISOString()
  });

  return { data, quest };
}

function applyQuestUpdate(data, questId, patch) {
  const quest = (data.quests || []).find(q => q.id === questId);
  if (!quest) return { data, quest };
  const allowed = ["title", "description", "area", "priority", "deadline"];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) quest[key] = patch[key];
  }
  return { data, quest };
}

function applyQuestDelete(data, questId) {
  if (!Array.isArray(data.quests)) return { data, questId };
  data.quests = data.quests.filter(q => q.id !== questId);
  return { data, questId };
}

// Get quests sorted by deadline (soonest first, null deadlines last)
function sortedByDeadline(quests) {
  return [...quests].sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });
}

// Check if a quest is overdue
function isOverdue(quest) {
  if (!quest.deadline || quest.completed || quest.abandoned) return false;
  return new Date(quest.deadline) < new Date();
}

module.exports = {
  activeQuests,
  completedQuests,
  questXP,
  applyQuestAdd,
  applyQuestComplete,
  applyQuestAbandon,
  applyQuestUpdate,
  applyQuestDelete,
  sortedByDeadline,
  isOverdue
};
