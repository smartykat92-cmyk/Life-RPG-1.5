// Active Settings quests panel renderer for Vibe RPG.
// Receives data, config, and callbacks from main-entry.

const { Notice } = require("obsidian");
const { activeHabits } = require("../../systems/habitSystem");
const { normalizeQuestStatsSettings } = require("../../systems/questStatsSystem");
const { QUEST_STATS_CARDS } = require("../../config/questStatsConfig");

function renderSettingsQuestsScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const addCustomQuestStatsCard = ctx.addCustomQuestStatsCard;
  const setQuestStatsCardEnabled = ctx.setQuestStatsCardEnabled;
  const updateQuestStatsCard = ctx.updateQuestStatsCard;
  const updateCustomQuestStatsCard = ctx.updateCustomQuestStatsCard;
  const deleteCustomQuestStatsCard = ctx.deleteCustomQuestStatsCard;
  const confirm = ctx.confirm;

  const addPanel = parent.createDiv({ cls: "vrpg-panel" });
  addPanel.createDiv({ cls: "vrpg-section", text: "Add Card" });
  addPanel.createDiv({ cls: "vrpg-card-title", text: "Card Type" });
  addPanel.createDiv({ cls: "vrpg-subtitle", text: "What the card will track." });
  const typeSelect = addPanel.createEl("select");
  [
    ["manual", "Manual Card"],
    ["habitCount", "Habit: Count"],
    ["habitStreak", "Habit: Streak"]
  ].forEach(([value, label]) => typeSelect.createEl("option", { text: label, value }));
  const addForm = addPanel.createDiv({ cls: "vrpg-setting-edit" });
  const renderAddForm = () => {
    addForm.empty();
    const type = typeSelect.value;
    addForm.createDiv({ cls: "vrpg-card-title", text: "Card Name" });
    addForm.createDiv({ cls: "vrpg-subtitle", text: "How the card will appear in the Quests panel." });
    const customLabel = addForm.createEl("input", { type: "text", placeholder: "e.g. Don't skip workouts" });
    if (type === "manual") {
      addForm.createDiv({ cls: "vrpg-card-title", text: "Value / Caption" });
      addForm.createDiv({ cls: "vrpg-subtitle", text: "Text that will be shown inside the card." });
      const customValue = addForm.createEl("input", { type: "text", placeholder: "e.g. 3 important tasks" });
      const add = addForm.createEl("button", { cls: "vrpg-primary", text: "Add" });
      add.onclick = async () => {
        await addCustomQuestStatsCard({
          type: "manual",
          label: customLabel.value,
          value: customValue.value,
          enabled: true
        });
        customLabel.value = "";
        customValue.value = "";
      };
      return;
    }

    addForm.createDiv({ cls: "vrpg-subtitle", text: "Linked quest progress is calculated automatically from selected habits. A day counts if at least one of them is completed." });
    const habits = activeHabits(data);
    if (!habits.length) {
      addForm.createDiv({ cls: "vrpg-subtitle", text: "First add or enable at least one habit." });
      return;
    }

    addForm.createDiv({ cls: "vrpg-card-title", text: "Linked Habits" });
    addForm.createDiv({ cls: "vrpg-subtitle", text: "e.g. running, cycling, and gym for an overall fitness streak." });
    const habitChoices = addForm.createDiv({ cls: "vrpg-habit-choice-list" });
    const habitInputs = [];
    for (const habit of habits) {
      const label = habitChoices.createEl("label", { cls: "vrpg-habit-choice" });
      const checkbox = label.createEl("input", { type: "checkbox" });
      checkbox.value = habit.id;
      label.createSpan({ text: `${habit.icon || "•"} ${habit.title}` });
      habitInputs.push(checkbox);
    }
    addForm.createDiv({ cls: "vrpg-card-title", text: "Goal in Days" });
    addForm.createDiv({ cls: "vrpg-subtitle", text: "How many days needed to complete the quest." });
    const goalInput = addForm.createEl("input", { type: "number", placeholder: "e.g. 7 days" });
    goalInput.value = "7";
    addForm.createDiv({ cls: "vrpg-card-title", text: "XP Reward" });
    addForm.createDiv({ cls: "vrpg-subtitle", text: "Currently display-only. XP is not awarded automatically." });
    const rewardXpInput = addForm.createEl("input", { type: "number", placeholder: "e.g. 100" });
    rewardXpInput.value = "0";
    const add = addForm.createEl("button", { cls: "vrpg-primary", text: "Add" });
    add.onclick = async () => {
      const habitIds = habitInputs
        .filter(input => input.checked)
        .map(input => input.value);
      if (!habitIds.length) {
        new Notice("Select at least one habit");
        return;
      }
      await addCustomQuestStatsCard({
        type,
        label: customLabel.value,
        habitId: habitIds[0],
        habitIds,
        goal: goalInput.value,
        rewardXp: rewardXpInput.value,
        period: "lastDays",
        enabled: true
      });
      customLabel.value = "";
      goalInput.value = "7";
      rewardXpInput.value = "0";
    };
  };
  typeSelect.onchange = renderAddForm;
  renderAddForm();

  const panel = parent.createDiv({ cls: "vrpg-panel" });
  panel.createDiv({ cls: "vrpg-section", text: "Quests Panel" });
  panel.createDiv({ cls: "vrpg-subtitle", text: "Manage stat cards in the Quests panel." });
  const normalized = normalizeQuestStatsSettings(data.settings || {}, QUEST_STATS_CARDS);
  const settings = normalized.questStatsCards;
  for (const card of QUEST_STATS_CARDS) {
    const cardSettings = settings[card.id] || {};
    const enabled = card.enabled !== false && cardSettings.enabled !== false;
    const row = panel.createDiv({ cls: "vrpg-setting-row" });
    const title = cardSettings.label || card.label;
    row.createDiv({ cls: "vrpg-card-title", text: title });
    row.createDiv({ cls: "vrpg-subtitle", text: enabled ? "Shown in Quests panel" : "Hidden from Quests panel" });
    const toggle = row.createEl("button", { cls: "vrpg-primary", text: enabled ? "Hide" : "Show" });
    toggle.onclick = () => setQuestStatsCardEnabled(card.id, !enabled);
    const edit = row.createEl("button", { cls: "vrpg-primary", text: "Edit" });
    let editForm = null;
    edit.onclick = () => {
      if (editForm) {
        editForm.remove();
        editForm = null;
        return;
      }
      editForm = row.createDiv({ cls: "vrpg-setting-edit" });
      const labelInput = editForm.createEl("input", { type: "text", placeholder: "Name" });
      labelInput.value = title;
      const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Save" });
      save.onclick = () => updateQuestStatsCard(card.id, { label: labelInput.value });
      const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "Cancel" });
      cancel.onclick = () => {
        editForm.remove();
        editForm = null;
      };
    };
  }

  for (const card of normalized.customQuestStatsCards) {
    const enabled = card.enabled !== false;
    const row = panel.createDiv({ cls: "vrpg-setting-row" });
    const linkedCount = Array.isArray(card.habitIds) && card.habitIds.length ? card.habitIds.length : (card.habitId ? 1 : 0);
    const linkedText = card.type === "manual" ? card.value || "No value" : `${linkedCount} habits • ${card.value || "auto-progress"}`;
    row.createDiv({ cls: "vrpg-card-title", text: card.label });
    row.createDiv({ cls: "vrpg-subtitle", text: `${linkedText} • ${enabled ? "Shown" : "Hidden"}` });
    const toggle = row.createEl("button", { cls: "vrpg-primary", text: enabled ? "Hide" : "Show" });
    toggle.onclick = () => updateCustomQuestStatsCard(card.id, { enabled: !enabled });
    if (card.type === "manual") {
      const edit = row.createEl("button", { cls: "vrpg-primary", text: "Edit" });
      let editForm = null;
      edit.onclick = () => {
        if (editForm) {
          editForm.remove();
          editForm = null;
          return;
        }
        editForm = row.createDiv({ cls: "vrpg-setting-edit" });
        const labelInput = editForm.createEl("input", { type: "text", placeholder: "Name" });
        labelInput.value = card.label;
        const valueInput = editForm.createEl("input", { type: "text", placeholder: "Value / Caption" });
        valueInput.value = card.value || "";
        const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Save" });
        save.onclick = () => updateCustomQuestStatsCard(card.id, {
          label: labelInput.value,
          value: valueInput.value
        });
        const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "Cancel" });
        cancel.onclick = () => {
          editForm.remove();
          editForm = null;
        };
      };
    }
    const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
    remove.onclick = () => {
      if (confirm(`Delete card "${card.label}"?`)) {
        deleteCustomQuestStatsCard(card.id);
      }
    };
  }
}

module.exports = {
  renderSettingsQuestsScreen
};
