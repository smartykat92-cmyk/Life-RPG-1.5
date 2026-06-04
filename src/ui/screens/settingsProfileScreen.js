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
  profilePanel.createDiv({ cls: "vrpg-section", text: "Профиль героя" });
  const profilePreview = profilePanel.createDiv({ cls: "vrpg-settings-profile" });
  renderAvatar(profilePreview, data, "vrpg-avatar");
  const profileCopy = profilePreview.createDiv();
  profileCopy.createDiv({ cls: "vrpg-card-title", text: player.name || "Герой" });
  profileCopy.createDiv({ cls: "vrpg-subtitle", text: getHeroClassTitle(player) });
  const heroName = profilePanel.createEl("input", {
    type: "text",
    placeholder: "Имя героя",
    value: player.name || ""
  });
  const heroClassId = resolveHeroClassId(player);
  profilePanel.createDiv({ cls: "vrpg-card-title", text: "Класс героя" });
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
  dropZone.createDiv({ cls: "vrpg-card-title", text: "Фото героя" });
  dropZone.createDiv({ cls: "vrpg-subtitle", text: "Перетащи картинку сюда или выбери файл. Технический путь больше не показываем." });
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
  const clearAvatar = profilePanel.createEl("button", { cls: "vrpg-danger", text: "Убрать фото" });
  clearAvatar.onclick = () => {
    heroAvatar.value = "";
    updatePlayer({ ...getProfile(), avatarUrl: "" });
  };
  const saveHero = profilePanel.createEl("button", { cls: "vrpg-primary", text: "Сохранить героя" });
  saveHero.onclick = () => updatePlayer({
    name: heroName.value,
    classId: heroClass.value,
    avatarUrl: heroAvatar.value
  });
}

module.exports = {
  renderSettingsProfileScreen
};
