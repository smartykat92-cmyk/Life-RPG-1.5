// Active Settings profile panel renderer for Vibe RPG.
// Receives data, hero class helpers, avatar callbacks, and update callback from main-entry.

const {
  HERO_CLASSES,
  getHeroClassDescription,
  getHeroClassTitle,
  resolveHeroClassId
} = require("../../config/heroClassesConfig");

function renderSettingsProfileScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const renderAvatar = ctx.renderAvatar;
  const attachAvatarDropZone = ctx.attachAvatarDropZone;
  const updatePlayer = ctx.updatePlayer;

  const player = data.player || {};
  const profilePanel = parent.createDiv({ cls: "vrpg-panel" });
  profilePanel.createDiv({ cls: "vrpg-section", text: "Hero Profile" });
  const profilePreview = profilePanel.createDiv({ cls: "vrpg-settings-profile" });
  renderAvatar(profilePreview, data, "vrpg-avatar");
  const profileCopy = profilePreview.createDiv();
  profileCopy.createDiv({ cls: "vrpg-card-title", text: player.name || "Hero" });
  profileCopy.createDiv({ cls: "vrpg-subtitle", text: getHeroClassTitle(player) });
  const heroName = profilePanel.createEl("input", {
    type: "text",
    placeholder: "Hero Name",
    value: player.name || ""
  });
  const heroClassId = resolveHeroClassId(player);
  profilePanel.createDiv({ cls: "vrpg-card-title", text: "Hero Class" });
  const heroClass = profilePanel.createEl("select");
  for (const item of HERO_CLASSES) {
    heroClass.createEl("option", {
      text: `${item.icon} ${item.title}`,
      value: item.id
    });
  }
  heroClass.value = heroClassId;
  const heroClassDescription = profilePanel.createDiv({
    cls: "vrpg-subtitle",
    text: getHeroClassDescription(heroClass.value)
  });
  heroClass.onchange = () => {
    heroClassDescription.textContent = getHeroClassDescription(heroClass.value);
  };
  const heroAvatar = profilePanel.createEl("input", {
    type: "hidden",
    value: player.avatarUrl || ""
  });
  const dropZone = profilePanel.createDiv({ cls: "vrpg-avatar-drop" });
  dropZone.createDiv({ cls: "vrpg-card-title", text: "Hero Photo" });
  dropZone.createDiv({ cls: "vrpg-subtitle", text: "Drag an image here or choose a file." });
  const getProfile = () => ({
    name: heroName.value,
    classId: heroClass.value
  });
  const fileInput = profilePanel.createEl("input", {
    type: "file",
    attr: { accept: "image/*" }
  });
  fileInput.addClass("vrpg-file-input");
  fileInput.onchange = () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      heroAvatar.value = String(reader.result || "");
      await updatePlayer({ ...getProfile(), avatarUrl: heroAvatar.value });
    };
    reader.readAsDataURL(file);
  };
  attachAvatarDropZone(dropZone, heroAvatar, getProfile);
  const clearAvatar = profilePanel.createEl("button", { cls: "vrpg-danger", text: "Remove Photo" });
  clearAvatar.onclick = () => {
    heroAvatar.value = "";
    updatePlayer({ ...getProfile(), avatarUrl: "" });
  };
  const saveHero = profilePanel.createEl("button", { cls: "vrpg-primary", text: "Save Hero" });
  saveHero.onclick = () => updatePlayer({
    name: heroName.value,
    classId: heroClass.value,
    avatarUrl: heroAvatar.value
  });
}

module.exports = {
  renderSettingsProfileScreen
};
