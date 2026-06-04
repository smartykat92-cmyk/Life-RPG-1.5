// Player and settings data mutations for Vibe RPG.
// These helpers only update allowed fields; UI, FileReader, Notice, and saving stay in main.js.

const { getHeroClass, resolveHeroClassId } = require("../config/heroClassesConfig");

function applyPlayerUpdate(data, patch) {
  const allowed = ["name", "goal", "avatarUrl"];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) data.player[key] = patch[key];
  }
  if (
    Object.prototype.hasOwnProperty.call(patch, "classId") ||
    Object.prototype.hasOwnProperty.call(patch, "className")
  ) {
    const classId = resolveHeroClassId({
      classId: patch.classId,
      className: patch.className || data.player.className
    });
    data.player.classId = classId;
    data.player.className = getHeroClass(classId).title;
  }
  return { data, player: data.player };
}

function applySettingsUpdate(data, patch) {
  const allowed = ["waterGoal", "waterGlassMl", "questStatsCards"];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) data.settings[key] = patch[key];
  }
  return { data, settings: data.settings };
}

module.exports = {
  applyPlayerUpdate,
  applySettingsUpdate
};
