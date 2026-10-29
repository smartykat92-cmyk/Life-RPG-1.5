// Active Settings quests panel renderer for Grindstone.
// Manages real quest items with title, description, category, priority, deadline.

const { AREA_LABELS, QUEST_PRIORITIES } = require("../../constants");

function renderSettingsQuestsScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const addQuest = ctx.addQuest || (() => {});
  const updateQuest = ctx.updateQuest || (() => {});
  const deleteQuest = ctx.deleteQuest || (() => {});
  const confirm = ctx.confirm;

  const areas = Object.entries(AREA_LABELS);
  const priorities = Object.entries(QUEST_PRIORITIES);

  // Add quest panel
  const addPanel = parent.createDiv({ cls: "vrpg-panel" });
  addPanel.createDiv({ cls: "vrpg-section", text: "Add Quest" });

  const titleInput = addPanel.createEl("input", { type: "text", placeholder: "Quest title, e.g. Complete WGU course" });

  addPanel.createDiv({ cls: "vrpg-subtitle", text: "Description (optional)" });
  const descInput = addPanel.createEl("input", { type: "text", placeholder: "Details about the quest" });

  const selectRow = addPanel.createDiv({ cls: "vrpg-quest-selects" });

  const areaSelect = selectRow.createEl("select");
  areas.forEach(([value, label]) => {
    areaSelect.createEl("option", { text: label, value });
  });

  const prioritySelect = selectRow.createEl("select");
  priorities.forEach(([value, label]) => {
    const xp = value === "major" ? "100" : "50";
    prioritySelect.createEl("option", { text: `${label} (${xp} XP)`, value });
  });

  addPanel.createDiv({ cls: "vrpg-subtitle", text: "Deadline (optional)" });
  const deadlineInput = addPanel.createEl("input", { type: "date" });

  const addBtn = addPanel.createEl("button", { cls: "vrpg-primary", text: "Add Quest" });
  addBtn.onclick = () => {
    if (!titleInput.value.trim()) return;
    addQuest({
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      area: areaSelect.value,
      priority: prioritySelect.value,
      deadline: deadlineInput.value || null
    });
    titleInput.value = "";
    descInput.value = "";
    deadlineInput.value = "";
  };

  // Existing quests list
  const quests = Array.isArray(data.quests) ? data.quests : [];
  const active = quests.filter(q => !q.completed && !q.abandoned);
  const completed = quests.filter(q => q.completed);
  const abandoned = quests.filter(q => q.abandoned);

  if (active.length > 0) {
    const listPanel = parent.createDiv({ cls: "vrpg-panel" });
    listPanel.createDiv({ cls: "vrpg-section", text: "Active Quests" });
    for (const quest of active) {
      renderQuestRow(listPanel, quest, { areas, priorities, updateQuest, deleteQuest, confirm });
    }
  }

  if (completed.length > 0) {
    const donePanel = parent.createDiv({ cls: "vrpg-panel" });
    donePanel.createDiv({ cls: "vrpg-section", text: "Completed Quests" });
    for (const quest of completed.slice(-10).reverse()) {
      const row = donePanel.createDiv({ cls: "vrpg-setting-row" });
      row.createDiv({ cls: "vrpg-card-title", text: `✅ ${quest.title}` });
      row.createDiv({ cls: "vrpg-subtitle", text: `${AREA_LABELS[quest.area] || quest.area} · ${quest.priority === "major" ? "Major" : "Standard"}` });
      const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
      remove.onclick = () => {
        if (confirm(`Remove completed quest "${quest.title}" from history?`)) {
          deleteQuest(quest.id);
        }
      };
    }
  }

  if (abandoned.length > 0) {
    const abPanel = parent.createDiv({ cls: "vrpg-panel" });
    abPanel.createDiv({ cls: "vrpg-section", text: "Abandoned Quests" });
    for (const quest of abandoned.slice(-5).reverse()) {
      const row = abPanel.createDiv({ cls: "vrpg-setting-row" });
      row.createDiv({ cls: "vrpg-card-title", text: `❌ ${quest.title}` });
      const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
      remove.onclick = () => deleteQuest(quest.id);
    }
  }
}

function renderQuestRow(parent, quest, opts) {
  const { areas, priorities, updateQuest, deleteQuest, confirm } = opts;
  const row = parent.createDiv({ cls: "vrpg-setting-row" });
  row.createDiv({ cls: "vrpg-card-title", text: quest.title });
  const priorityLabel = quest.priority === "major" ? "⭐ Major" : "Standard";
  const deadlineText = quest.deadline ? ` · Due: ${quest.deadline}` : "";
  row.createDiv({ cls: "vrpg-subtitle", text: `${AREA_LABELS[quest.area] || quest.area} · ${priorityLabel}${deadlineText}` });

  const edit = row.createEl("button", { cls: "vrpg-primary", text: "Edit" });
  let editForm = null;
  edit.onclick = () => {
    if (editForm) {
      editForm.remove();
      editForm = null;
      return;
    }
    editForm = row.createDiv({ cls: "vrpg-setting-edit" });
    const titleInput = editForm.createEl("input", { type: "text" });
    titleInput.value = quest.title || "";
    const descInput = editForm.createEl("input", { type: "text", placeholder: "Description" });
    descInput.value = quest.description || "";
    const areaSelect = editForm.createEl("select");
    areas.forEach(([value, label]) => {
      areaSelect.createEl("option", { text: label, value });
    });
    areaSelect.value = quest.area || "craft";
    const prioritySelect = editForm.createEl("select");
    priorities.forEach(([value, label]) => {
      prioritySelect.createEl("option", { text: label, value });
    });
    prioritySelect.value = quest.priority || "standard";
    editForm.createDiv({ cls: "vrpg-subtitle", text: "Deadline" });
    const deadlineInput = editForm.createEl("input", { type: "date" });
    deadlineInput.value = quest.deadline || "";

    const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Save" });
    save.onclick = () => updateQuest(quest.id, {
      title: titleInput.value,
      description: descInput.value,
      area: areaSelect.value,
      priority: prioritySelect.value,
      deadline: deadlineInput.value || null
    });
    const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "Cancel" });
    cancel.onclick = () => {
      editForm.remove();
      editForm = null;
    };
  };

  const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
  remove.onclick = () => {
    if (confirm(`Delete quest "${quest.title}"?`)) {
      deleteQuest(quest.id);
    }
  };
}

module.exports = {
  renderSettingsQuestsScreen
};
