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
  addPanel.createDiv({ cls: "vrpg-section", text: "Добавить карточку" });
  addPanel.createDiv({ cls: "vrpg-card-title", text: "Тип карточки" });
  addPanel.createDiv({ cls: "vrpg-subtitle", text: "Что будет считать карточка." });
  const typeSelect = addPanel.createEl("select");
  [
    ["manual", "Ручная карточка"],
    ["habitCount", "Привычка: количество"],
    ["habitStreak", "Привычка: серия"]
  ].forEach(([value, label]) => typeSelect.createEl("option", { text: label, value }));
  const addForm = addPanel.createDiv({ cls: "vrpg-setting-edit" });
  const renderAddForm = () => {
    addForm.empty();
    const type = typeSelect.value;
    addForm.createDiv({ cls: "vrpg-card-title", text: "Название карточки" });
    addForm.createDiv({ cls: "vrpg-subtitle", text: "Как карточка будет называться в панели Квесты." });
    const customLabel = addForm.createEl("input", { type: "text", placeholder: "Например: Не пропускать тренировки" });
    if (type === "manual") {
      addForm.createDiv({ cls: "vrpg-card-title", text: "Значение / подпись" });
      addForm.createDiv({ cls: "vrpg-subtitle", text: "Текст, который будет показан внутри карточки." });
      const customValue = addForm.createEl("input", { type: "text", placeholder: "Например: 3 важных дела" });
      const add = addForm.createEl("button", { cls: "vrpg-primary", text: "Добавить" });
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

    addForm.createDiv({ cls: "vrpg-subtitle", text: "Прогресс linked-квеста считается автоматически по выбранным привычкам. День засчитывается, если выполнена хотя бы одна из них." });
    const habits = activeHabits(data);
    if (!habits.length) {
      addForm.createDiv({ cls: "vrpg-subtitle", text: "Сначала добавь или включи хотя бы одну привычку." });
      return;
    }

    addForm.createDiv({ cls: "vrpg-card-title", text: "Связанные привычки" });
    addForm.createDiv({ cls: "vrpg-subtitle", text: "Например: бег, велосипед и зал для общего спортивного стрика." });
    const habitChoices = addForm.createDiv({ cls: "vrpg-habit-choice-list" });
    const habitInputs = [];
    for (const habit of habits) {
      const label = habitChoices.createEl("label", { cls: "vrpg-habit-choice" });
      const checkbox = label.createEl("input", { type: "checkbox" });
      checkbox.value = habit.id;
      label.createSpan({ text: `${habit.icon || "•"} ${habit.title}` });
      habitInputs.push(checkbox);
    }
    addForm.createDiv({ cls: "vrpg-card-title", text: "Цель в днях" });
    addForm.createDiv({ cls: "vrpg-subtitle", text: "Сколько дней нужно выполнить для завершения квеста." });
    const goalInput = addForm.createEl("input", { type: "number", placeholder: "Например: 7 дней" });
    goalInput.value = "7";
    addForm.createDiv({ cls: "vrpg-card-title", text: "Награда XP" });
    addForm.createDiv({ cls: "vrpg-subtitle", text: "Пока только отображается. XP не начисляется автоматически." });
    const rewardXpInput = addForm.createEl("input", { type: "number", placeholder: "Например: 100" });
    rewardXpInput.value = "0";
    const add = addForm.createEl("button", { cls: "vrpg-primary", text: "Добавить" });
    add.onclick = async () => {
      const habitIds = habitInputs
        .filter(input => input.checked)
        .map(input => input.value);
      if (!habitIds.length) {
        new Notice("Выбери хотя бы одну привычку");
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
  panel.createDiv({ cls: "vrpg-section", text: "Панель Квестов" });
  panel.createDiv({ cls: "vrpg-subtitle", text: "Управляй карточками статистики в панели Квесты." });
  const normalized = normalizeQuestStatsSettings(data.settings || {}, QUEST_STATS_CARDS);
  const settings = normalized.questStatsCards;
  for (const card of QUEST_STATS_CARDS) {
    const cardSettings = settings[card.id] || {};
    const enabled = card.enabled !== false && cardSettings.enabled !== false;
    const row = panel.createDiv({ cls: "vrpg-setting-row" });
    const title = cardSettings.label || card.label;
    row.createDiv({ cls: "vrpg-card-title", text: title });
    row.createDiv({ cls: "vrpg-subtitle", text: enabled ? "Показывается в панели Квесты" : "Скрыта из панели Квесты" });
    const toggle = row.createEl("button", { cls: "vrpg-primary", text: enabled ? "Скрыть" : "Показать" });
    toggle.onclick = () => setQuestStatsCardEnabled(card.id, !enabled);
    const edit = row.createEl("button", { cls: "vrpg-primary", text: "Изменить" });
    let editForm = null;
    edit.onclick = () => {
      if (editForm) {
        editForm.remove();
        editForm = null;
        return;
      }
      editForm = row.createDiv({ cls: "vrpg-setting-edit" });
      const labelInput = editForm.createEl("input", { type: "text", placeholder: "Название" });
      labelInput.value = title;
      const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Сохранить" });
      save.onclick = () => updateQuestStatsCard(card.id, { label: labelInput.value });
      const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "Отмена" });
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
    const linkedText = card.type === "manual" ? card.value || "Без значения" : `${linkedCount} привычек • ${card.value || "авто-прогресс"}`;
    row.createDiv({ cls: "vrpg-card-title", text: card.label });
    row.createDiv({ cls: "vrpg-subtitle", text: `${linkedText} • ${enabled ? "Показывается" : "Скрыта"}` });
    const toggle = row.createEl("button", { cls: "vrpg-primary", text: enabled ? "Скрыть" : "Показать" });
    toggle.onclick = () => updateCustomQuestStatsCard(card.id, { enabled: !enabled });
    if (card.type === "manual") {
      const edit = row.createEl("button", { cls: "vrpg-primary", text: "Изменить" });
      let editForm = null;
      edit.onclick = () => {
        if (editForm) {
          editForm.remove();
          editForm = null;
          return;
        }
        editForm = row.createDiv({ cls: "vrpg-setting-edit" });
        const labelInput = editForm.createEl("input", { type: "text", placeholder: "Название" });
        labelInput.value = card.label;
        const valueInput = editForm.createEl("input", { type: "text", placeholder: "Значение / подпись" });
        valueInput.value = card.value || "";
        const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Сохранить" });
        save.onclick = () => updateCustomQuestStatsCard(card.id, {
          label: labelInput.value,
          value: valueInput.value
        });
        const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "Отмена" });
        cancel.onclick = () => {
          editForm.remove();
          editForm = null;
        };
      };
    }
    const remove = row.createEl("button", { cls: "vrpg-danger", text: "Удалить" });
    remove.onclick = () => {
      if (confirm(`Удалить карточку "${card.label}"?`)) {
        deleteCustomQuestStatsCard(card.id);
      }
    };
  }
}

module.exports = {
  renderSettingsQuestsScreen
};
