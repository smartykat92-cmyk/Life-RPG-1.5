// Active Settings habits panel renderer for Vibe RPG.
// Receives data, labels, icons, and callbacks from main-entry.

function renderSettingsHabitsScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const habitIcons = ctx.habitIcons || [];
  const areaLabels = ctx.areaLabels || {};
  const addHabit = ctx.addHabit;
  const setHabitEnabled = ctx.setHabitEnabled;
  const updateHabit = ctx.updateHabit;
  const deleteHabit = ctx.deleteHabit;
  const confirm = ctx.confirm;
  const areas = [["body", "Body"], ["mind", "Mind"], ["craft", "Craft"], ["control", "Control"]];
  const panel = parent.createDiv({ cls: "vrpg-panel" });
  panel.createDiv({ cls: "vrpg-section", text: "Add Habit" });
  const input = panel.createEl("input", { type: "text", placeholder: "e.g. swimming, English, journaling" });
  const icon = panel.createEl("input", { type: "text", placeholder: "Icon, e.g. 🏃" });
  const iconPicker = panel.createDiv({ cls: "vrpg-icon-picker" });
  habitIcons.forEach(value => {
    const pick = iconPicker.createEl("button", { text: value });
    pick.onclick = () => {
      icon.value = value;
    };
  });
  const xp = panel.createEl("input", { type: "number", placeholder: "XP per completion, usually 10" });
  const select = panel.createEl("select");
  areas.forEach(([value, label]) => {
    select.createEl("option", { text: label, value });
  });
  const button = panel.createEl("button", { cls: "vrpg-primary", text: "Add" });
  button.onclick = () => {
    addHabit(input.value, select.value, xp.value || 10, icon.value || "✨");
    input.value = "";
    icon.value = "";
    xp.value = "";
  };

  const list = parent.createDiv({ cls: "vrpg-panel" });
  list.createDiv({ cls: "vrpg-section", text: "My Habits" });
  for (const habit of data.habits) {
    const row = list.createDiv({ cls: "vrpg-setting-row" });
    row.createDiv({ cls: "vrpg-card-title", text: `${habit.icon || "•"} ${habit.title}` });
    row.createDiv({ cls: "vrpg-subtitle", text: `${areaLabels[habit.area] || habit.area} • ${habit.xp} XP` });
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
      const xpInput = editForm.createEl("input", { type: "number" });
      xpInput.value = String(habit.xp || 10);
      const areaSelect = editForm.createEl("select");
      areas.forEach(([value, label]) => {
        areaSelect.createEl("option", { text: label, value });
      });
      areaSelect.value = habit.area || "body";
      const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Save" });
      save.onclick = () => updateHabit(habit.id, {
        title: titleInput.value,
        icon: iconInput.value,
        xp: xpInput.value,
        area: areaSelect.value
      });
      const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "Cancel" });
      cancel.onclick = () => {
        editForm.remove();
        editForm = null;
      };
    };
    const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
    remove.onclick = () => {
      if (confirm(`Delete habit "${habit.title}"? Its history will also be removed from calculations.`)) {
        deleteHabit(habit.id);
      }
    };
  }
}

module.exports = {
  renderSettingsHabitsScreen
};
