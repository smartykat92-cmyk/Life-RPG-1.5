// Settings quests panel renderer for Grindstone.
// Supports all quest types: Quest, Main Quest, Bounty, Event

const { AREA_LABELS, QUEST_PRIORITIES } = require("../../constants");

function renderSettingsQuestsScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const addQuest = ctx.addQuest || (() => {});
  const updateQuest = ctx.updateQuest || (() => {});
  const deleteQuest = ctx.deleteQuest || (() => {});
  const confirm = ctx.confirm;
  const questTypes = ctx.questTypes || { quest: "Quest", main_quest: "Main Quest", bounty: "Bounty", event: "Event" };
  const questTypeIcons = ctx.questTypeIcons || {};
  const areaLabels = ctx.areaLabels || AREA_LABELS;

  const areas = Object.entries(areaLabels);
  const priorities = Object.entries(QUEST_PRIORITIES);

  // ── Add Quest Panel ──
  const addPanel = parent.createDiv({ cls: "vrpg-panel" });
  addPanel.createDiv({ cls: "vrpg-section", text: "Add Quest" });

  // Quest type selector
  addPanel.createDiv({ cls: "vrpg-subtitle", text: "Type" });
  const typeSelect = addPanel.createEl("select", { cls: "vrpg-type-select" });
  for (const [value, label] of Object.entries(questTypes)) {
    const icon = questTypeIcons[value] || "";
    typeSelect.createEl("option", { text: `${icon} ${label}`, value });
  }

  const titleInput = addPanel.createEl("input", { type: "text", placeholder: "Quest title" });

  addPanel.createDiv({ cls: "vrpg-subtitle", text: "Description (optional)" });
  const descInput = addPanel.createEl("input", { type: "text", placeholder: "Details about the quest" });

  // Area selector (always shown)
  addPanel.createDiv({ cls: "vrpg-subtitle", text: "Category" });
  const areaSelect = addPanel.createEl("select");
  areas.forEach(([value, label]) => areaSelect.createEl("option", { text: label, value }));

  // Dynamic fields container — updates based on selected type
  const dynamicFields = addPanel.createDiv({ cls: "vrpg-dynamic-fields" });

  function refreshDynamicFields() {
    dynamicFields.empty();
    const type = typeSelect.value;

    if (type === "quest") {
      dynamicFields.createDiv({ cls: "vrpg-subtitle", text: "Priority" });
      const prioritySelect = dynamicFields.createEl("select");
      priorities.forEach(([value, label]) => {
        const xp = value === "major" ? "100" : "50";
        prioritySelect.createEl("option", { text: `${label} (${xp} XP)`, value });
      });
      prioritySelect.id = "vrpg-add-priority";

      dynamicFields.createDiv({ cls: "vrpg-subtitle", text: "Deadline (optional)" });
      const deadlineInput = dynamicFields.createEl("input", { type: "date" });
      deadlineInput.id = "vrpg-add-deadline";
    }

    if (type === "main_quest") {
      dynamicFields.createDiv({ cls: "vrpg-subtitle", text: "Target Date (optional)" });
      const targetInput = dynamicFields.createEl("input", { type: "date" });
      targetInput.id = "vrpg-add-target-date";

      dynamicFields.createDiv({ cls: "vrpg-subtitle", text: "Steps (one per line)" });
      const stepsInput = dynamicFields.createEl("textarea", {
        placeholder: "Step 1\nStep 2\nStep 3",
        attr: { rows: 4 }
      });
      stepsInput.id = "vrpg-add-steps";
    }

    if (type === "event") {
      const dateRow = dynamicFields.createDiv({ cls: "vrpg-quest-selects" });

      const startWrap = dateRow.createDiv();
      startWrap.createDiv({ cls: "vrpg-subtitle", text: "Start Date" });
      const startInput = startWrap.createEl("input", { type: "date" });
      startInput.id = "vrpg-add-start-date";

      const endWrap = dateRow.createDiv();
      endWrap.createDiv({ cls: "vrpg-subtitle", text: "End Date" });
      const endInput = endWrap.createEl("input", { type: "date" });
      endInput.id = "vrpg-add-end-date";

      dynamicFields.createDiv({ cls: "vrpg-subtitle", text: "Daily Tasks (one per line, optional)" });
      const tasksInput = dynamicFields.createEl("textarea", {
        placeholder: "Practice 30min\nReview notes\nLog progress",
        attr: { rows: 3 }
      });
      tasksInput.id = "vrpg-add-daily-tasks";
    }

    // Bounty has no extra fields — just title, description, area
  }

  typeSelect.onchange = refreshDynamicFields;
  refreshDynamicFields();

  const addBtn = addPanel.createEl("button", { cls: "vrpg-primary", text: "Add Quest" });
  addBtn.onclick = () => {
    if (!titleInput.value.trim()) return;
    const type = typeSelect.value;
    const input = {
      type,
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      area: areaSelect.value
    };

    if (type === "quest") {
      const pSel = dynamicFields.querySelector("#vrpg-add-priority");
      const dIn = dynamicFields.querySelector("#vrpg-add-deadline");
      input.priority = pSel ? pSel.value : "standard";
      input.deadline = dIn && dIn.value ? dIn.value : null;
    }

    if (type === "main_quest") {
      const tIn = dynamicFields.querySelector("#vrpg-add-target-date");
      const sIn = dynamicFields.querySelector("#vrpg-add-steps");
      input.targetDate = tIn && tIn.value ? tIn.value : null;
      input.steps = sIn && sIn.value.trim()
        ? sIn.value.trim().split("\n").filter(s => s.trim()).map(s => ({ title: s.trim() }))
        : [];
    }

    if (type === "event") {
      const sdIn = dynamicFields.querySelector("#vrpg-add-start-date");
      const edIn = dynamicFields.querySelector("#vrpg-add-end-date");
      const dtIn = dynamicFields.querySelector("#vrpg-add-daily-tasks");
      input.startDate = sdIn && sdIn.value ? sdIn.value : null;
      input.endDate = edIn && edIn.value ? edIn.value : null;
      input.dailyTasks = dtIn && dtIn.value.trim()
        ? dtIn.value.trim().split("\n").filter(s => s.trim()).map(s => ({ title: s.trim(), completed: false }))
        : [];
    }

    addQuest(input);
    titleInput.value = "";
    descInput.value = "";
  };

  // ── Existing Quests List ──
  const quests = Array.isArray(data.quests) ? data.quests : [];
  const active = quests.filter(q => !q.completed && !q.abandoned);
  const completed = quests.filter(q => q.completed);
  const abandoned = quests.filter(q => q.abandoned);

  if (active.length > 0) {
    const listPanel = parent.createDiv({ cls: "vrpg-panel" });
    listPanel.createDiv({ cls: "vrpg-section", text: "Active Quests" });
    for (const quest of active) {
      renderQuestRow(listPanel, quest, { areas, priorities, updateQuest, deleteQuest, confirm, questTypes, questTypeIcons });
    }
  }

  if (completed.length > 0) {
    const donePanel = parent.createDiv({ cls: "vrpg-panel" });
    donePanel.createDiv({ cls: "vrpg-section", text: "Completed Quests" });
    for (const quest of completed.slice(-10).reverse()) {
      const type = quest.type || "quest";
      const icon = questTypeIcons[type] || "⚔️";
      const row = donePanel.createDiv({ cls: "vrpg-setting-row" });
      row.createDiv({ cls: "vrpg-card-title", text: `✅ ${icon} ${quest.title}` });
      row.createDiv({ cls: "vrpg-subtitle", text: `${questTypes[type] || type} · ${AREA_LABELS[quest.area] || quest.area}` });
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
  const { areas, priorities, updateQuest, deleteQuest, confirm, questTypes, questTypeIcons } = opts;
  const type = quest.type || "quest";
  const icon = (questTypeIcons || {})[type] || "⚔️";
  const typeName = (questTypes || {})[type] || type;

  const row = parent.createDiv({ cls: "vrpg-setting-row" });
  row.createDiv({ cls: "vrpg-card-title", text: `${icon} ${quest.title}` });

  const metaParts = [typeName, AREA_LABELS[quest.area] || quest.area];
  if (type === "quest") {
    metaParts.push(quest.priority === "major" ? "⭐ Major" : "Standard");
    if (quest.deadline) metaParts.push(`Due: ${quest.deadline}`);
  }
  if (type === "main_quest") {
    const steps = quest.steps || [];
    const done = steps.filter(s => s.completed).length;
    metaParts.push(`${done}/${steps.length} steps`);
    if (quest.targetDate) metaParts.push(`Target: ${quest.targetDate}`);
  }
  if (type === "bounty") {
    metaParts.push(`${quest.completionCount || 0} claims`);
  }
  if (type === "event") {
    if (quest.startDate && quest.endDate) metaParts.push(`${quest.startDate} → ${quest.endDate}`);
  }
  row.createDiv({ cls: "vrpg-subtitle", text: metaParts.join(" · ") });

  const edit = row.createEl("button", { cls: "vrpg-primary", text: "Edit" });
  let editForm = null;
  edit.onclick = () => {
    if (editForm) { editForm.remove(); editForm = null; return; }
    editForm = row.createDiv({ cls: "vrpg-setting-edit" });
    const titleInput = editForm.createEl("input", { type: "text" });
    titleInput.value = quest.title || "";
    const descInput = editForm.createEl("input", { type: "text", placeholder: "Description" });
    descInput.value = quest.description || "";
    const areaSelect = editForm.createEl("select");
    areas.forEach(([value, label]) => areaSelect.createEl("option", { text: label, value }));
    areaSelect.value = quest.area || "craft";

    // Type-specific edit fields
    if (type === "quest") {
      const prioritySelect = editForm.createEl("select");
      priorities.forEach(([value, label]) => prioritySelect.createEl("option", { text: label, value }));
      prioritySelect.value = quest.priority || "standard";
      editForm.createDiv({ cls: "vrpg-subtitle", text: "Deadline" });
      const deadlineInput = editForm.createEl("input", { type: "date" });
      deadlineInput.value = quest.deadline || "";
      const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Save" });
      save.onclick = () => updateQuest(quest.id, {
        title: titleInput.value, description: descInput.value, area: areaSelect.value,
        priority: prioritySelect.value, deadline: deadlineInput.value || null
      });
    } else if (type === "main_quest") {
      editForm.createDiv({ cls: "vrpg-subtitle", text: "Target Date" });
      const targetInput = editForm.createEl("input", { type: "date" });
      targetInput.value = quest.targetDate || "";
      const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Save" });
      save.onclick = () => updateQuest(quest.id, {
        title: titleInput.value, description: descInput.value, area: areaSelect.value,
        targetDate: targetInput.value || null
      });
    } else if (type === "event") {
      editForm.createDiv({ cls: "vrpg-subtitle", text: "Start Date" });
      const startInput = editForm.createEl("input", { type: "date" });
      startInput.value = quest.startDate || "";
      editForm.createDiv({ cls: "vrpg-subtitle", text: "End Date" });
      const endInput = editForm.createEl("input", { type: "date" });
      endInput.value = quest.endDate || "";
      const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Save" });
      save.onclick = () => updateQuest(quest.id, {
        title: titleInput.value, description: descInput.value, area: areaSelect.value,
        startDate: startInput.value || null, endDate: endInput.value || null
      });
    } else {
      // Bounty — just title/desc/area
      const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Save" });
      save.onclick = () => updateQuest(quest.id, {
        title: titleInput.value, description: descInput.value, area: areaSelect.value
      });
    }

    const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "Cancel" });
    cancel.onclick = () => { editForm.remove(); editForm = null; };
  };

  const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
  remove.onclick = () => {
    if (confirm(`Delete quest "${quest.title}"?`)) deleteQuest(quest.id);
  };
}

module.exports = {
  renderSettingsQuestsScreen
};
