// Adventure Log screen for Grindstone.
// Auto-generated activity feed showing recent actions.

function renderHomeLogScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const displayDateFromKey = ctx.displayDateFromKey;

  const panel = parent.createDiv({ cls: "vrpg-panel" });
  panel.createDiv({ cls: "vrpg-section", text: "📜 Adventure Log" });

  const log = Array.isArray(data.log) ? data.log : [];

  if (log.length === 0) {
    panel.createDiv({ cls: "vrpg-subtitle", text: "No entries yet. Complete dailies and quests to fill your log." });
    return;
  }

  // Show most recent entries first, limit to 50
  const entries = [...log].reverse().slice(0, 50);

  for (const entry of entries) {
    const row = panel.createDiv({ cls: "vrpg-log-entry" });
    const icon = logIcon(entry.type);
    const text = logText(entry);
    const time = entry.timestamp ? formatLogTime(entry.timestamp) : "";

    row.createSpan({ cls: "vrpg-log-icon", text: icon });
    row.createSpan({ cls: "vrpg-log-text", text: text });
    if (time) {
      row.createSpan({ cls: "vrpg-log-time", text: time });
    }
  }
}

function logIcon(type) {
  switch (type) {
    case "quest-completed": return "⚔️";
    case "quest-added": return "📜";
    case "quest-abandoned": return "❌";
    case "reward-purchased": return "🛒";
    case "achievement-unlocked": return "🏆";
    case "level-up": return "⬆️";
    default: return "•";
  }
}

function logText(entry) {
  switch (entry.type) {
    case "quest-completed": return `Completed quest: ${entry.title} (+${entry.xp || 0} XP)`;
    case "quest-added": return `New quest accepted: ${entry.title}`;
    case "quest-abandoned": return `Abandoned quest: ${entry.title}`;
    case "reward-purchased": return `Purchased: ${entry.title} (-${entry.cost || 0} Gold)`;
    case "achievement-unlocked": return `Achievement unlocked: ${entry.title}`;
    case "level-up": return `Leveled up to ${entry.level}!`;
    default: return entry.title || entry.type || "Unknown event";
  }
}

function formatLogTime(timestamp) {
  try {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${month}/${day} ${hours}:${minutes} ${ampm}`;
  } catch (e) {
    return "";
  }
}

module.exports = {
  renderHomeLogScreen
};
