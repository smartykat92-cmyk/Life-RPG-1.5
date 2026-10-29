// Active Settings habits (dailies) panel renderer for Grindstone.
// 5 categories, day-of-week selector, fixed XP (no custom XP input).

const { DAYS_OF_WEEK, ALL_DAYS } = require("../../constants");

function renderSettingsHabitsScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const habitIcons = ctx.habitIcons || [];
  const areaLabels = ctx.areaLabels || {};
  const addHabit = ctx.addHabit;
  const setHabitEnabled = ctx.setHabitEnabled;
  const updateHabit = ctx.updateHabit;
  const deleteHabit = ctx.deleteHabit;
  const confirm = ctx.confirm;

  const areas = [["body", "Body"], ["mind", "Mind"], ["spirit", "Spirit"], ["craft", "Craft"], ["hearth", "Hearth"]];

  // Add new daily
  const panel = parent.createDiv({ cls: "vrpg-panel" });
  panel.createDiv({ cls: "vrpg-section", text: "Add Daily" });
  const input = panel.createEl("input", { type: "text", placeholder: "e.g. swimming, English, journaling" });
  const icon = panel.createEl("input", { type: "text", placeholder: "Icon, e.g. 🏃" });
  const iconPicker = panel.createDiv({ cls: "vrpg-icon-picker" });
  habitIcons.forEach(value => {
    const pick = iconPicker.createEl("button", { text: value });
    pick.onclick = () => { icon.value = value; };
  });
  const select = panel.createEl("select");
  areas.forEach(([value, label]) => {
    select.createEl("option", { text: label, value });
  });

  // Day-of-week selector for new daily
  panel.createDiv({ cls: "vrpg-subtitle", text: "Schedule (leave unchecked for every day)" });
  const daysRow = panel.createDiv({ cls: "vrpg-days-picker" });
  const dayCheckboxes = {};
  ALL_DAYS.forEach(dayKey => {
    const label = daysRow.createEl("label", { cls: "vrpg-day-check" });
    const cb = label.createEl("input", { type: "checkbox" });
    cb.value = dayKey;
    label.createSpan({ text: DAYS_OF_WEEK[dayKey] });
    dayCheckboxes[dayKey] = cb;
  });

  const button = panel.createEl("button", { cls: "vrpg-primary", text: "Add" });
  button.onclick = () => {
    const selectedDays = ALL_DAYS.filter(d => dayCheckboxes[d].checked);
    addHabit(input.value, select.value, icon.value || "✨", selectedDays.length > 0 ? selectedDays : null);
    input.value = "";
    icon.value = "";
    ALL_DAYS.forEach(d => { dayCheckboxes[d].checked = false; });
  };

  // Existing dailies list
  const list = parent.createDiv({ cls: "vrpg-panel" });
  list.createDiv({ cls: "vrpg-section", text: "My Dailies" });
  for (const habit of data.habits) {
    const row = list.createDiv({ cls: "vrpg-setting-row" });
    row.createDiv({ cls: "vrpg-card-title", text: `${habit.icon || "•"} ${habit.title}` });
    const daysText = habit.days && Array.isArray(habit.days) && habit.days.length > 0
      ? habit.days.map(d => DAYS_OF_WEEK[d] || d).join(", ")
      : "Every day";
    row.createDiv({ cls: "vrpg-subtitle", text: `${areaLabels[habit.area] || habit.area} · 10 XP · ${daysText}` });

    const toggle = row.createEl("button", { cls: "vrpg-primary", text: habit.enabled === false ? "Enable" : "Hide" });
    toggle.onclick = () => setHabitEnabled(habit.id, habit.enabled === false);

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
      titleInput.value = habit.title || "";
      const iconInput = editForm.createEl("input", { type: "text" });
      iconInput.value = habit.icon || "✨";
      const areaSelect = editForm.createEl("select");
      areas.forEach(([value, label]) => {
        areaSelect.createEl("option", { text: label, value });
      });
      areaSelect.value = habit.area || "body";

      // Day-of-week editor
      editForm.createDiv({ cls: "vrpg-subtitle", text: "Schedule (leave unchecked for every day)" });
      const editDaysRow = editForm.createDiv({ cls: "vrpg-days-picker" });
      const editDayCbs = {};
      ALL_DAYS.forEach(dayKey => {
        const dayLabel = editDaysRow.createEl("label", { cls: "vrpg-day-check" });
        const cb = dayLabel.createEl("input", { type: "checkbox" });
        cb.value = dayKey;
        if (habit.days && Array.isArray(habit.days) && habit.days.includes(dayKey)) {
          cb.checked = true;
        }
        dayLabel.createSpan({ text: DAYS_OF_WEEK[dayKey] });
        editDayCbs[dayKey] = cb;
      });

      const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Save" });
      save.onclick = () => {
        const editSelectedDays = ALL_DAYS.filter(d => editDayCbs[d].checked);
        updateHabit(habit.id, {
          title: titleInput.value,
          icon: iconInput.value,
          area: areaSelect.value,
          days: editSelectedDays.length > 0 ? editSelectedDays : null
        });
      };
      const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "Cancel" });
      cancel.onclick = () => {
        editForm.remove();
        editForm = null;
      };
    };

    const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
    remove.onclick = () => {
      if (confirm(`Delete daily "${habit.title}"? Its history will also be removed from calculations.`)) {
        deleteHabit(habit.id);
      }
    };
  }
}

module.exports = {
  renderSettingsHabitsScreen
};
