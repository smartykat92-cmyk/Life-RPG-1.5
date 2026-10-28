const { ItemView, Notice, Plugin } = require("obsidian");
const {
  APP_VIEW,
  SIDEBAR_VIEW,
  AREA_LABELS,
  MOODS,
  RARITIES,
  HABIT_ICONS
} = require("./constants");
const {
  dateKey,
  timeParts,
  dayPhase,
  parseMoney,
  formatMoney,
  monthLabel,
  dateFromKey,
  walletMonthLabel,
  calendarDays
} = require("./utils");
const { mergeData, getDay } = require("./storage");
const { createProgressBar } = require("./ui/components/progressBar");
const { createStatCard } = require("./ui/components/statCard");
const { renderRadarChart } = require("./ui/components/radarChart");
const { renderWaterWidget } = require("./ui/components/waterWidget");
const {
  renderWalletRow: renderWalletRowComponent,
  renderWalletMonth: renderWalletMonthComponent
} = require("./ui/components/walletRows");
const { renderHomeScreen, renderHomeModuleScreen } = require("./ui/screens/homeScreen");
const { renderHomeTodayScreen } = require("./ui/screens/homeTodayScreen");
const { renderHomeHeroScreen } = require("./ui/screens/homeHeroScreen");
const { renderHomeQuestsScreen } = require("./ui/screens/homeQuestsScreen");
const { renderHomeRewardsScreen } = require("./ui/screens/rewardsScreen");
const { renderHomeInventoryScreen } = require("./ui/screens/inventoryScreen");
const { renderHomeWalletScreen } = require("./ui/screens/homeWalletScreen");
const { renderSettingsScreen } = require("./ui/screens/settingsScreen");
const { renderSettingsProfileScreen } = require("./ui/screens/settingsProfileScreen");
const { renderSettingsInterfaceScreen } = require("./ui/screens/settingsInterfaceScreen");
const { renderSettingsResourcesScreen } = require("./ui/screens/settingsResourcesScreen");
const { renderSettingsRewardsScreen } = require("./ui/screens/settingsRewardsScreen");
const { renderSettingsHabitsScreen } = require("./ui/screens/settingsHabitsScreen");
const { renderSettingsQuestsScreen } = require("./ui/screens/settingsQuestsScreen");
const {
  activeHabits,
  applyHabitAdd,
  applyHabitDelete,
  applyHabitToggle,
  applyHabitUpdate,
  dayStats,
  readDayStats,
  sortedDayKeys,
  streak,
  skillStats
} = require("./systems/habitSystem");
const { coreAttributes, achievements } = require("./systems/achievementSystem");
const { applyWaterChange, applyMoodChange } = require("./systems/daySystem");
const { applyInventoryToggleUsed } = require("./systems/inventorySystem");
const {
  applyRewardAdd,
  applyRewardDelete,
  applyRewardPurchase
} = require("./systems/rewardSystem");
const { applyPlayerUpdate, applySettingsUpdate } = require("./systems/playerSystem");
const { waterStats } = require("./systems/waterSystem");
const {
  applyWalletAdd,
  applyWalletDelete,
  walletStats
} = require("./systems/walletSystem");
const { heroTitle, totals } = require("./systems/xpSystem");
const {
  applyCustomQuestStatsCardAdd,
  applyCustomQuestStatsCardDelete,
  applyCustomQuestStatsCardUpdate,
  applyQuestStatsCardUpdate,
  getQuestStatsCards,
  normalizeQuestStatsSettings
} = require("./systems/questStatsSystem");
const { TEXT } = require("./config/textConfig");
const { QUEST_STATS_CARDS } = require("./config/questStatsConfig");
const { FEATURE_FLAGS } = require("./config/featureFlags");
const {
  normalizeHomeLayout,
  normalizeInterfaceLayout
} = require("./config/layoutConfig");
const {
  getThemeClasses,
  getThemeClassList
} = require("./config/themeConfig");
const { getAppSizePreset } = require("./systems/layoutSystem");
const {
  getHeroClassTitle,
  resolveHeroClassId
} = require("./config/heroClassesConfig");

function bindMoneyInput(input) {
  input.inputMode = "numeric";
  input.oninput = () => {
    const value = parseMoney(input.value);
    input.value = Number.isFinite(value) && value > 0 ? formatMoney(value) : "";
  };
}

function getScrollContainer(view) {
  if (!view || !view.containerEl) return null;
  return view.containerEl.querySelector(".vrpg-app");
}

function captureScroll(view) {
  const el = getScrollContainer(view);
  if (!el) return null;
  return {
    top: el.scrollTop || 0,
    left: el.scrollLeft || 0
  };
}

function restoreScroll(view, state) {
  if (!state) return;
  const el = getScrollContainer(view);
  if (!el) return;
  el.scrollTop = state.top;
  el.scrollLeft = state.left;
}

function renderViewPreservingScroll(view) {
  if (!view || typeof view.render !== "function") return;
  const state = captureScroll(view);
  view.render();
  restoreScroll(view, state);
  setTimeout(() => {
    restoreScroll(view, state);
  }, 0);
}

class VibeRpgPlugin extends Plugin {
  async onload() {
    this.data = mergeData(await this.loadData());
    await this.save();

    this.registerView(APP_VIEW, leaf => new VibeRpgAppView(leaf, this));
    this.registerView(SIDEBAR_VIEW, leaf => new VibeRpgSidebarView(leaf, this));

    this.addRibbonIcon("sparkles", "Open Life RPG", () => this.openApp());
    this.addCommand({ id: "open-vibe-rpg", name: "Open Life RPG", callback: () => this.openApp() });
    this.addCommand({ id: "open-vibe-rpg-sidebar", name: "Open Life RPG Widget", callback: () => this.openSidebar() });

    this.app.workspace.onLayoutReady(() => this.openSidebar());
  }

  async save() {
    await this.saveData(this.data);
    this.refreshViews();
  }

  refreshViews() {
    for (const leaf of this.app.workspace.getLeavesOfType(APP_VIEW)) {
      renderViewPreservingScroll(leaf.view);
    }
    for (const leaf of this.app.workspace.getLeavesOfType(SIDEBAR_VIEW)) {
      if (leaf.view && typeof leaf.view.render === "function") leaf.view.render();
    }
  }

  async openApp() {
    let leaf = this.app.workspace.getLeavesOfType(APP_VIEW)[0];
    if (!leaf) leaf = this.app.workspace.getLeaf(true);
    await leaf.setViewState({ type: APP_VIEW, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  async openSidebar() {
    let leaf = this.app.workspace.getLeavesOfType(SIDEBAR_VIEW)[0];
    if (!leaf) leaf = this.app.workspace.getRightLeaf(false);
    await leaf.setViewState({ type: SIDEBAR_VIEW, active: false });
  }

  async toggleHabit(id, key = dateKey()) {
    applyHabitToggle(this.data, key, id);
    await this.save();
  }

  async changeWater(delta, key = dateKey()) {
    applyWaterChange(this.data, key, delta);
    await this.save();
  }

  async setMood(value, key = dateKey()) {
    if (!MOODS[value]) return;
    applyMoodChange(this.data, key, value);
    await this.save();
  }

  async buyReward(rewardId) {
    const result = applyRewardPurchase(this.data, rewardId);
    if (!result.ok && result.reason === "not-enough-xp") {
      new Notice("Not enough XP");
      return;
    }
    if (!result.ok) return;
    await this.save();
    new Notice(`Purchased: ${result.reward.title}`);
  }

  async addHabit(title, area, xp = 10, icon = "✨") {
    const clean = String(title || "").trim();
    const value = Number(String(xp || 10).replace(/\s/g, "").replace(",", "."));
    if (!clean) return;
    applyHabitAdd(this.data, { title: clean, area, xp: value, icon });
    await this.save();
  }

  async deleteHabit(id) {
    const habit = this.data.habits.find(h => h.id === id);
    if (!habit) return;
    applyHabitDelete(this.data, id);
    await this.save();
    new Notice(`Deleted: ${habit.title}`);
  }

  async setHabitEnabled(id, enabled) {
    const habit = this.data.habits.find(h => h.id === id);
    if (!habit) return;
    applyHabitUpdate(this.data, id, { enabled });
    await this.save();
  }

  async updateHabit(id, patch) {
    const habit = this.data.habits.find(h => h.id === id);
    if (!habit) return;
    const next = {};
    if (Object.prototype.hasOwnProperty.call(patch, "title")) {
      const title = String(patch.title || "").trim();
      if (title) next.title = title;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "icon")) {
      next.icon = String(patch.icon || "").trim() || "✨";
    }
    if (Object.prototype.hasOwnProperty.call(patch, "xp")) {
      const xp = Number(String(patch.xp || "").replace(/\s/g, "").replace(",", "."));
      if (Number.isFinite(xp) && xp > 0) next.xp = xp;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "area") && AREA_LABELS[patch.area]) {
      next.area = patch.area;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "enabled")) {
      next.enabled = !!patch.enabled;
    }
    applyHabitUpdate(this.data, id, next);
    await this.save();
  }

  async addReward(title, cost, rarity = "common") {
    const clean = String(title || "").trim();
    const value = Number(String(cost || "").replace(/\s/g, "").replace(",", "."));
    if (!clean || !Number.isFinite(value) || value <= 0) {
      new Notice("Title and numeric price required");
      return;
    }
    applyRewardAdd(this.data, { title: clean, cost: value, rarity });
    await this.save();
  }

  async deleteReward(id) {
    const reward = this.data.rewards.find(r => r.id === id);
    if (!reward) return;
    applyRewardDelete(this.data, id);
    await this.save();
    new Notice(`Reward removed from shop: ${reward.title}`);
  }

  async toggleInventoryItemUsed(itemId) {
    const result = applyInventoryToggleUsed(this.data, itemId);
    if (!result.ok) return;
    await this.save();
  }

  async addWallet(type, amount, note, key = dateKey()) {
    const value = parseMoney(amount);
    if (!Number.isFinite(value) || value <= 0) {
      new Notice("Amount must be a number");
      return;
    }
    applyWalletAdd(this.data, { type, amount: value, note, date: key });
    await this.save();
  }

  async setWaterGoal(value) {
    const goal = Number(String(value || "").replace(/\s/g, "").replace(",", "."));
    if (!Number.isFinite(goal) || goal < 1) {
      new Notice("Goal must be at least 1 glass");
      return;
    }
    applySettingsUpdate(this.data, { waterGoal: Math.round(goal) });
    await this.save();
  }

  async setWaterGlassMl(value) {
    const ml = Number(String(value || "").replace(/\s/g, "").replace(",", "."));
    if (!Number.isFinite(ml) || ml < 50) {
      new Notice("Glass size must be at least 50 ml");
      return;
    }
    applySettingsUpdate(this.data, { waterGlassMl: Math.round(ml) });
    await this.save();
  }

  async updateHomeLayout(layout) {
    this.data.settings = this.data.settings || {};
    const interfaceLayout = normalizeInterfaceLayout(this.data.settings.interfaceLayout);
    this.data.settings.homeLayout = normalizeHomeLayout(layout, interfaceLayout);
    await this.save();
  }

  async updateInterfaceLayout(layout) {
    this.data.settings = this.data.settings || {};
    this.data.settings.interfaceLayout = normalizeInterfaceLayout(layout);
    await this.save();
  }

  async setQuestStatsCardEnabled(id, enabled) {
    const result = applyQuestStatsCardUpdate(this.data, id, { enabled });
    if (!result.ok) return;
    await this.save();
  }

  async updateQuestStatsCard(id, patch) {
    const result = applyQuestStatsCardUpdate(this.data, id, patch);
    if (!result.ok) {
      new Notice("Card not found");
      return;
    }
    await this.save();
  }

  async addCustomQuestStatsCard(input) {
    const result = applyCustomQuestStatsCardAdd(this.data, input);
    if (!result.ok) {
      new Notice("Failed to add card");
      return;
    }
    await this.save();
  }

  async updateCustomQuestStatsCard(id, patch) {
    const result = applyCustomQuestStatsCardUpdate(this.data, id, patch);
    if (!result.ok) {
      new Notice("Card not found");
      return;
    }
    await this.save();
  }

  async deleteCustomQuestStatsCard(id) {
    const result = applyCustomQuestStatsCardDelete(this.data, id);
    if (!result.ok) {
      new Notice("Card not found");
      return;
    }
    await this.save();
  }

  async updatePlayer(profile) {
    const name = String(profile.name || "").trim();
    const classId = resolveHeroClassId({ classId: profile.classId, className: profile.className });
    const goal = String(profile.goal || "").trim();
    const avatarUrl = String(profile.avatarUrl || "").trim();
    applyPlayerUpdate(this.data, {
      ...(name ? { name } : {}),
      classId,
      ...(goal ? { goal } : {}),
      avatarUrl
    });
    await this.save();
    new Notice("Hero profile updated");
  }

  async deleteWallet(id) {
    applyWalletDelete(this.data, id);
    await this.save();
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(APP_VIEW);
    this.app.workspace.detachLeavesOfType(SIDEBAR_VIEW);
  }
}

class VibeRpgAppView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.tab = "home";
    this.selectedDateKey = dateKey();
    this.homePanel = "hero";
    this.settingsPanel = "profile";
    this.isHomeEditMode = false;
  }

  getViewType() { return APP_VIEW; }
  getDisplayText() { return "Life RPG"; }
  getIcon() { return "sparkles"; }

  getState() {
    return {
      tab: this.tab,
      selectedDateKey: this.selectedDateKey,
      homePanel: this.homePanel,
      settingsPanel: this.settingsPanel
    };
  }

  async setState(state) {
    this.isRestoringState = true;
    this.applyState(state || {});
    this.render();
    this.isRestoringState = false;
  }

  applyState(state) {
    if (["home", "settings"].includes(state.tab)) this.tab = state.tab;
    if (state.selectedDateKey) this.selectedDateKey = state.selectedDateKey;
    if (state.homePanel === "dashboard") this.homePanel = "hero";
    if (["today", "hero", "quests", "rewards", "inventory", "wallet"].includes(state.homePanel)) this.homePanel = state.homePanel;
    if (["profile", "interface", "resources", "habits", "quests", "rewards"].includes(state.settingsPanel)) this.settingsPanel = state.settingsPanel;
  }

  navigate(state) {
    const previousHomePanel = this.homePanel;
    this.applyState(state);
    const shouldResetHomeScroll = this.tab === "home" &&
      state &&
      Object.prototype.hasOwnProperty.call(state, "homePanel") &&
      previousHomePanel !== this.homePanel;
    const scrollState = shouldResetHomeScroll ? { top: 0, left: 0 } : captureScroll(this);
    this.render();
    restoreScroll(this, scrollState);
    setTimeout(() => restoreScroll(this, scrollState), 0);
    this.saveNavigationState();
  }

  async saveNavigationState() {
    if (this.isRestoringState || !this.leaf || !this.leaf.setViewState) return;
    try {
      await this.leaf.setViewState({ type: APP_VIEW, active: true, state: this.getState() });
    } catch (error) {
      console.warn("Life RPG: navigation state was not saved", error);
    }
  }

  async onOpen() {
    this.render();
    this.clock = window.setInterval(() => {
      if (this.tab === "home") this.render();
    }, 60000);
  }

  async onClose() {
    if (this.clock) window.clearInterval(this.clock);
  }

  render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("vibe-rpg-plugin");
    for (const cls of getThemeClassList()) root.removeClass(cls);
    for (const cls of getThemeClasses(this.plugin.data && this.plugin.data.settings && this.plugin.data.settings.interfaceTheme)) {
      root.addClass(cls);
    }
    root.style.position = "relative";
    root.style.width = "100%";
    root.style.height = "100%";
    root.style.overflow = "hidden";
    const appSize = getAppSizePreset(this.plugin.data && this.plugin.data.settings);
    const app = root.createDiv({ cls: `vrpg-app vrpg-app-size-${appSize}` });
    if (!["home", "settings"].includes(this.tab)) this.tab = "home";
    if (this.tab === "home") this.renderHome(app);
    if (this.tab === "settings") this.renderSettings(app);
    this.renderTabs(app);
  }

  renderTabs(parent) {
    const tabs = parent.createDiv({ cls: "vrpg-tabs" });
    [
      ["home", "Home"],
      ["settings", "Settings"]
    ].forEach(([id, label]) => {
      const button = tabs.createEl("button", { text: label, cls: id === this.tab ? "is-active" : "" });
      button.onclick = () => {
        this.navigate({ tab: id });
      };
    });
  }

  renderAvatar(parent, data, cls = "vrpg-avatar") {
    const player = data.player || {};
    const avatar = parent.createDiv({ cls });
    const src = String(player.avatarUrl || "").trim();
    if (src) {
      avatar.createEl("img", { attr: { src, alt: player.name || "Hero" } });
      return avatar;
    }
    const letter = String(player.name || "P").trim().slice(0, 1).toUpperCase() || "P";
    avatar.createSpan({ text: letter });
    return avatar;
  }

  attachAvatarDropZone(zone, input, getProfile) {
    zone.ondragover = event => {
      event.preventDefault();
      zone.addClass("is-dragging");
    };
    zone.ondragleave = () => zone.removeClass("is-dragging");
    zone.ondrop = event => {
      event.preventDefault();
      zone.removeClass("is-dragging");
      const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
      const text = event.dataTransfer && event.dataTransfer.getData("text/plain");
      if (file && file.type && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = async () => {
          input.value = String(reader.result || "");
          await this.plugin.updatePlayer({ ...getProfile(), avatarUrl: input.value });
        };
        reader.readAsDataURL(file);
        return;
      }
      if (text) {
        input.value = text.trim();
        this.plugin.updatePlayer({ ...getProfile(), avatarUrl: input.value });
      }
    };
  }

  renderHome(parent) {
    return renderHomeScreen(parent, this.getHomeScreenContext());
  }

  renderHomeModule(parent) {
    return renderHomeModuleScreen(parent, this.getHomeScreenContext());
  }

  toggleHomeEditMode() {
    this.isHomeEditMode = !this.isHomeEditMode;
    this.render();
  }

  getHomeScreenContext() {
    return {
      data: this.plugin.data,
      homePanel: this.homePanel,
      isHomeEditMode: this.isHomeEditMode,
      selectedDateKey: this.selectedDateKey,
      totals,
      dateKey,
      readDayStats,
      waterStats,
      streak,
      getHeroClassTitle,
      createProgressBar,
      text: TEXT,
      timeParts,
      dayPhase,
      monthLabel,
      dateFromKey,
      calendarDays,
      renderWaterWidget,
      renderAvatar: (avatarParent, data, cls) => this.renderAvatar(avatarParent, data, cls),
      navigate: state => this.navigate(state),
      toggleHomeEditMode: () => this.toggleHomeEditMode(),
      updateHomeLayout: layout => this.plugin.updateHomeLayout(layout),
      changeWater: (delta, key) => this.plugin.changeWater(delta, key),
      getDay,
      activeHabits,
      skillStats,
      heroTitle,
      walletStats,
      formatMoney,
      toggleHabit: (habitId, key) => this.plugin.toggleHabit(habitId, key),
      renderHomeToday: body => this.renderHomeToday(body),
      renderHomeHero: body => this.renderHomeHero(body),
      renderHomeQuests: body => this.renderHomeQuests(body),
      renderHomeRewards: body => this.renderHomeRewards(body),
      renderHomeInventory: body => this.renderHomeInventory(body),
      renderHomeWallet: body => this.renderHomeWallet(body)
    };
  }

  renderHomeToday(parent) {
    return renderHomeTodayScreen(parent, {
      data: this.plugin.data,
      selectedDateKey: this.selectedDateKey,
      dateKey,
      getDay,
      readDayStats,
      activeHabits,
      moods: MOODS,
      setMood: (id, key) => this.plugin.setMood(id, key),
      toggleHabit: (habitId, key) => this.plugin.toggleHabit(habitId, key)
    });
  }

  renderHomeHero(parent) {
    const data = this.plugin.data;
    return renderHomeHeroScreen(parent, {
      data,
      totals,
      skillStats,
      waterStats,
      streak,
      getHeroClassTitle,
      heroTitle,
      createProgressBar,
      renderRadar: (radarParent, metrics) => this.renderRadar(radarParent, metrics),
      featureFlags: FEATURE_FLAGS,
      achievements
    });
  }

  renderHomeQuests(parent) {
    const data = this.plugin.data;
    const selectedKey = this.selectedDateKey || dateKey();
    return renderHomeQuestsScreen(parent, {
      data,
      selectedDateKey: selectedKey,
      dayStats,
      sortedDayKeys,
      streak,
      getQuestStatsCards,
      questStatsCards: QUEST_STATS_CARDS,
      createStatCard
    });
  }

  renderHomeRewards(parent) {
    const data = this.plugin.data;
    return renderHomeRewardsScreen(parent, {
      data,
      totals: totals(data),
      rarities: RARITIES,
      buyReward: rewardId => this.plugin.buyReward(rewardId)
    });
  }

  renderHomeInventory(parent) {
    return renderHomeInventoryScreen(parent, {
      data: this.plugin.data,
      toggleInventoryItemUsed: itemId => this.plugin.toggleInventoryItemUsed(itemId)
    });
  }

  renderHomeWallet(parent) {
    const wallet = this.plugin.data.wallet || [];
    return renderHomeWalletScreen(parent, {
      wallet,
      selectedDateKey: this.selectedDateKey,
      dateKey,
      walletStats,
      formatMoney,
      bindMoneyInput,
      walletMonthLabel,
      addWallet: (type, amount, note, key) => this.plugin.addWallet(type, amount, note, key),
      renderWalletRow: (walletParent, item) => this.renderWalletRow(walletParent, item),
      renderWalletMonth: (walletParent, walletItems, selectedKey) => this.renderWalletMonth(walletParent, walletItems, selectedKey)
    });
  }

  renderWalletRow(parent, item) {
    return renderWalletRowComponent(parent, item, {
      formatMoney,
      deleteWallet: itemId => this.plugin.deleteWallet(itemId)
    });
  }

  renderWalletMonth(parent, wallet, selectedKey = dateKey()) {
    return renderWalletMonthComponent(parent, wallet, selectedKey, {
      dateKey,
      dateFromKey,
      formatMoney,
      deleteWallet: itemId => this.plugin.deleteWallet(itemId)
    });
  }

  renderRadar(parent, metrics) {
    return renderRadarChart(parent, metrics);
  }

  renderSettings(parent) {
    return renderSettingsScreen(parent, {
      settingsPanel: this.settingsPanel,
      navigate: state => this.navigate(state),
      renderSettingsProfile: body => this.renderSettingsProfile(body),
      renderSettingsInterface: body => this.renderSettingsInterface(body),
      renderSettingsResources: body => this.renderSettingsResources(body),
      renderSettingsHabits: body => this.renderSettingsHabits(body),
      renderSettingsQuests: body => this.renderSettingsQuests(body),
      renderSettingsRewards: body => this.renderSettingsRewards(body)
    });
  }

  renderSettingsProfile(parent) {
    return renderSettingsProfileScreen(parent, {
      data: this.plugin.data,
      renderAvatar: (avatarParent, data, cls) => this.renderAvatar(avatarParent, data, cls),
      attachAvatarDropZone: (zone, input, getProfile) => this.attachAvatarDropZone(zone, input, getProfile),
      updatePlayer: profile => this.plugin.updatePlayer(profile)
    });
  }

  renderSettingsInterface(parent) {
    return renderSettingsInterfaceScreen(parent, {
      settings: this.plugin.data.settings,
      updateHomeLayout: layout => this.plugin.updateHomeLayout(layout),
      updateInterfaceLayout: layout => this.plugin.updateInterfaceLayout(layout)
    });
  }

  renderSettingsResources(parent) {
    return renderSettingsResourcesScreen(parent, {
      settings: this.plugin.data.settings,
      setWaterGoal: value => this.plugin.setWaterGoal(value),
      setWaterGlassMl: value => this.plugin.setWaterGlassMl(value)
    });
  }

  renderSettingsHabits(parent) {
    return renderSettingsHabitsScreen(parent, {
      data: this.plugin.data,
      habitIcons: HABIT_ICONS,
      areaLabels: AREA_LABELS,
      addHabit: (title, area, xp, icon) => this.plugin.addHabit(title, area, xp, icon),
      setHabitEnabled: (habitId, enabled) => this.plugin.setHabitEnabled(habitId, enabled),
      updateHabit: (habitId, patch) => this.plugin.updateHabit(habitId, patch),
      deleteHabit: habitId => this.plugin.deleteHabit(habitId),
      confirm
    });
  }

  renderSettingsQuests(parent) {
    return renderSettingsQuestsScreen(parent, {
      data: this.plugin.data,
      addCustomQuestStatsCard: card => this.plugin.addCustomQuestStatsCard(card),
      setQuestStatsCardEnabled: (cardId, enabled) => this.plugin.setQuestStatsCardEnabled(cardId, enabled),
      updateQuestStatsCard: (cardId, patch) => this.plugin.updateQuestStatsCard(cardId, patch),
      updateCustomQuestStatsCard: (cardId, patch) => this.plugin.updateCustomQuestStatsCard(cardId, patch),
      deleteCustomQuestStatsCard: cardId => this.plugin.deleteCustomQuestStatsCard(cardId),
      confirm
    });
  }

  renderSettingsRewards(parent) {
    return renderSettingsRewardsScreen(parent, {
      data: this.plugin.data,
      rarities: RARITIES,
      addReward: (title, cost, rarity) => this.plugin.addReward(title, cost, rarity),
      deleteReward: rewardId => this.plugin.deleteReward(rewardId),
      confirm
    });
  }
}

class VibeRpgSidebarView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() { return SIDEBAR_VIEW; }
  getDisplayText() { return "Life RPG"; }
  getIcon() { return "sparkles"; }

  async onOpen() {
    this.render();
  }

  render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("vibe-rpg-plugin");
    const data = this.plugin.data;
    const today = getDay(data);
    const active = data.habits.filter(h => h.enabled !== false);
    const done = active.filter(h => today.completed[h.id]).length;
    const t = totals(data);

    const box = root.createDiv({ cls: "vrpg-sidebar" });
    box.createDiv({ cls: "vrpg-section", text: "Today" });
    box.createDiv({ cls: "vrpg-side-number", text: `${done}/${active.length}` });
    createProgressBar(box, active.length ? Math.round(done / active.length * 100) : 0);
    box.createDiv({ cls: "vrpg-side-note", text: `Balance: ${t.balance} XP` });
    const open = box.createEl("button", { cls: "vrpg-primary", text: "Open App" });
    open.onclick = () => this.plugin.openApp();
  }
}

module.exports = VibeRpgPlugin;
