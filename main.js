var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/constants.js
var require_constants = __commonJS({
  "src/constants.js"(exports2, module2) {
    var APP_VIEW2 = "vibe-rpg-app-view";
    var SIDEBAR_VIEW2 = "vibe-rpg-sidebar-view";
    var AREA_LABELS2 = {
      body: "Body",
      mind: "Mind",
      spirit: "Spirit",
      craft: "Craft",
      hearth: "Hearth"
    };
    var DAILY_XP = 10;
    var QUEST_XP_STANDARD = 50;
    var QUEST_XP_MAJOR = 100;
    var QUEST_PRIORITIES = {
      standard: "Standard",
      major: "Major"
    };
    var MOODS2 = {
      low: "Low",
      normal: "Normal",
      high: "High"
    };
    var RARITIES2 = {
      common: "Common",
      rare: "Rare",
      epic: "Epic",
      legendary: "Legendary"
    };
    var HABIT_ICONS2 = ["\u{1F3CB}\uFE0F", "\u{1F6B6}", "\u{1F9D8}", "\u{1F3C3}", "\u{1F6B4}", "\u{1F9E0}", "\u{1F6E0}\uFE0F", "\u{1F6E1}\uFE0F", "\u{1F4DA}", "\u270D\uFE0F", "\u{1F3A7}", "\u{1F9F9}", "\u{1F4AC}", "\u{1F3AF}", "\u{1F525}", "\u{1F64F}", "\u{1F3E1}", "\u{1F41D}", "\u{1F331}", "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}"];
    var DAYS_OF_WEEK = {
      sun: "Sun",
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat"
    };
    var ALL_DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    module2.exports = {
      APP_VIEW: APP_VIEW2,
      SIDEBAR_VIEW: SIDEBAR_VIEW2,
      AREA_LABELS: AREA_LABELS2,
      MOODS: MOODS2,
      RARITIES: RARITIES2,
      HABIT_ICONS: HABIT_ICONS2,
      DAILY_XP,
      QUEST_XP_STANDARD,
      QUEST_XP_MAJOR,
      QUEST_PRIORITIES,
      DAYS_OF_WEEK,
      ALL_DAYS
    };
  }
});

// src/utils.js
var require_utils = __commonJS({
  "src/utils.js"(exports2, module2) {
    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }
    function dateKey2(date = /* @__PURE__ */ new Date()) {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      return `${dd}.${mm}.${date.getFullYear()}`;
    }
    function displayDate2(date = /* @__PURE__ */ new Date()) {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      return `${mm}/${dd}/${date.getFullYear()}`;
    }
    function displayDateFromKey2(key) {
      const date = dateFromKey2(key);
      return displayDate2(date);
    }
    function timeKey(date = /* @__PURE__ */ new Date()) {
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    function timeParts2(date = /* @__PURE__ */ new Date()) {
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return {
        hours: String(hours),
        minutes,
        ampm
      };
    }
    function dayPhase2(date = /* @__PURE__ */ new Date()) {
      const hour = date.getHours();
      if (hour < 6) return "night";
      if (hour < 12) return "morning";
      if (hour < 18) return "afternoon";
      return "evening";
    }
    function monthLabel2(date = /* @__PURE__ */ new Date()) {
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    function dateFromKey2(key) {
      const [day, month, year] = String(key || "").split(".").map(Number);
      return new Date(year || 1970, (month || 1) - 1, day || 1);
    }
    function calendarDays2(date = /* @__PURE__ */ new Date()) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const first = new Date(year, month, 1);
      const last = new Date(year, month + 1, 0);
      const offset = (first.getDay() + 6) % 7;
      const days = [];
      for (let i = 0; i < offset; i++) days.push(null);
      for (let day = 1; day <= last.getDate(); day++) days.push(day);
      return days;
    }
    function uid(prefix) {
      return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
    module2.exports = {
      clone,
      dateKey: dateKey2,
      displayDate: displayDate2,
      displayDateFromKey: displayDateFromKey2,
      timeKey,
      timeParts: timeParts2,
      dayPhase: dayPhase2,
      monthLabel: monthLabel2,
      dateFromKey: dateFromKey2,
      calendarDays: calendarDays2,
      uid
    };
  }
});

// src/config/heroClassesConfig.js
var require_heroClassesConfig = __commonJS({
  "src/config/heroClassesConfig.js"(exports2, module2) {
    var DEFAULT_HERO_CLASS_ID = "habit_warrior";
    var HERO_CLASSES = [
      {
        id: "habit_warrior",
        icon: "\u2694\uFE0F",
        title: "Habit Warrior",
        description: "Consistency, daily actions, and steady progress."
      },
      {
        id: "discipline_mage",
        icon: "\u{1F9D9}",
        title: "Discipline Mage",
        description: "Self-control, focus, and achieving goals despite obstacles."
      },
      {
        id: "balance_keeper",
        icon: "\u{1F33F}",
        title: "Balance Keeper",
        description: "Harmonious growth across all areas of life."
      },
      {
        id: "change_architect",
        icon: "\u{1F525}",
        title: "Change Architect",
        description: "Building new habits and transforming your life step by step."
      }
    ];
    function getHeroClass(id) {
      return HERO_CLASSES.find((item) => item.id === id) || HERO_CLASSES.find((item) => item.id === DEFAULT_HERO_CLASS_ID);
    }
    function getHeroClassLabel(id) {
      const heroClass = getHeroClass(id);
      return `${heroClass.icon} ${heroClass.title}`;
    }
    function getHeroClassTitle2(player = {}) {
      return getHeroClassLabel(resolveHeroClassId2(player));
    }
    function getHeroClassDescription(id) {
      return getHeroClass(id).description;
    }
    function resolveHeroClassId2(player = {}) {
      if (HERO_CLASSES.some((item) => item.id === player.classId)) return player.classId;
      const raw = String(player.className || "").trim().toLowerCase();
      if (!raw) return DEFAULT_HERO_CLASS_ID;
      const matched = HERO_CLASSES.find((item) => {
        const title = item.title.toLowerCase();
        const label = `${item.icon} ${item.title}`.toLowerCase();
        return raw === title || raw === label || raw.includes(title);
      });
      return matched ? matched.id : DEFAULT_HERO_CLASS_ID;
    }
    module2.exports = {
      HERO_CLASSES,
      DEFAULT_HERO_CLASS_ID,
      getHeroClass,
      getHeroClassLabel,
      getHeroClassTitle: getHeroClassTitle2,
      getHeroClassDescription,
      resolveHeroClassId: resolveHeroClassId2
    };
  }
});

// src/config/layoutConfig.js
var require_layoutConfig = __commonJS({
  "src/config/layoutConfig.js"(exports2, module2) {
    var WIDGET_SIZES = ["small", "medium", "large", "full"];
    var APP_SIZE_PRESETS = ["compact", "comfortable", "expanded"];
    var HOME_LAYOUT_MODES = ["grid", "freeform"];
    var DEFAULT_INTERFACE_LAYOUT = {
      version: 1,
      appSize: "comfortable",
      homeLayoutMode: "grid",
      columns: 12,
      rowHeight: 96
    };
    var HOME_WIDGET_DEFINITIONS = [
      {
        id: "command",
        title: "Command Center",
        description: "Hero profile, overall progress, and home navigation",
        defaultEnabled: true,
        defaultSize: "large",
        allowedSizes: ["large", "full"],
        defaultGeometry: { x: 0, y: 0, w: 8, h: 3 },
        minW: 4,
        minH: 2,
        maxW: 12,
        maxH: 5,
        rendererKey: "command",
        category: "home"
      },
      {
        id: "clock",
        title: "Now",
        description: "Current time and time of day",
        defaultEnabled: true,
        defaultSize: "small",
        allowedSizes: ["small", "medium"],
        defaultGeometry: { x: 8, y: 0, w: 4, h: 2 },
        minW: 3,
        minH: 2,
        maxW: 4,
        maxH: 3,
        rendererKey: "clock",
        category: "home"
      },
      {
        id: "calendar",
        title: "Calendar",
        description: "Day selection and weekly stats",
        defaultEnabled: true,
        defaultSize: "medium",
        allowedSizes: ["medium", "large"],
        defaultGeometry: { x: 8, y: 2, w: 4, h: 3 },
        minW: 3,
        minH: 2,
        maxW: 6,
        maxH: 5,
        rendererKey: "calendar",
        category: "home"
      },
      {
        id: "today",
        title: "Today",
        description: "Habits, mood, and progress for the selected day",
        defaultEnabled: true,
        defaultSize: "large",
        allowedSizes: ["medium", "large", "full"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 4 },
        minW: 4,
        minH: 3,
        maxW: 12,
        maxH: 8,
        rendererKey: "today",
        category: "home"
      },
      {
        id: "hero",
        title: "Hero",
        description: "Level, XP, radar, and hero progress",
        defaultEnabled: true,
        defaultSize: "large",
        allowedSizes: ["medium", "large", "full"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 5 },
        minW: 4,
        minH: 3,
        maxW: 12,
        maxH: 9,
        rendererKey: "hero",
        category: "home"
      },
      {
        id: "quests",
        title: "Quests",
        description: "Active quests with deadlines and priorities",
        defaultEnabled: true,
        defaultSize: "medium",
        allowedSizes: ["medium", "large", "full"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 4 },
        minW: 4,
        minH: 3,
        maxW: 12,
        maxH: 8,
        rendererKey: "quests",
        category: "home"
      },
      {
        id: "rewards",
        title: "Rewards",
        description: "Reward shop for Gold",
        defaultEnabled: true,
        defaultSize: "medium",
        allowedSizes: ["medium", "large", "full"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 4 },
        minW: 4,
        minH: 3,
        maxW: 12,
        maxH: 8,
        rendererKey: "rewards",
        category: "home"
      },
      {
        id: "inventory",
        title: "Inventory",
        description: "Purchased rewards and usage status",
        defaultEnabled: true,
        defaultSize: "medium",
        allowedSizes: ["small", "medium", "large"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 4 },
        minW: 3,
        minH: 3,
        maxW: 10,
        maxH: 7,
        rendererKey: "inventory",
        category: "home"
      },
      {
        id: "log",
        title: "Adventure Log",
        description: "Activity feed of completed quests, purchases, and achievements",
        defaultEnabled: true,
        defaultSize: "medium",
        allowedSizes: ["medium", "large", "full"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 4 },
        minW: 4,
        minH: 3,
        maxW: 12,
        maxH: 8,
        rendererKey: "log",
        category: "home"
      }
    ];
    var DEFAULT_HOME_LAYOUT = {
      version: 1,
      widgets: HOME_WIDGET_DEFINITIONS.map((widget) => ({
        id: widget.id,
        enabled: widget.defaultEnabled,
        size: widget.defaultSize
      }))
    };
    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }
    function getHomeWidgetDefinitions() {
      return clone(HOME_WIDGET_DEFINITIONS);
    }
    function getDefaultHomeLayout() {
      return clone(DEFAULT_HOME_LAYOUT);
    }
    function getDefaultInterfaceLayout() {
      return clone(DEFAULT_INTERFACE_LAYOUT);
    }
    function normalizePositiveNumber(value, fallback, min) {
      const number = Number(value);
      if (!Number.isFinite(number) || number < min) return fallback;
      return number;
    }
    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
    function getDefinition(idOrDefinition) {
      if (idOrDefinition && typeof idOrDefinition === "object" && idOrDefinition.id) {
        return HOME_WIDGET_DEFINITIONS.find((definition) => definition.id === idOrDefinition.id) || idOrDefinition;
      }
      return HOME_WIDGET_DEFINITIONS.find((definition) => definition.id === idOrDefinition) || null;
    }
    function normalizeInterfaceLayout2(interfaceLayout) {
      const input = interfaceLayout && typeof interfaceLayout === "object" ? interfaceLayout : {};
      const defaults = DEFAULT_INTERFACE_LAYOUT;
      const appSize = APP_SIZE_PRESETS.includes(input.appSize) ? input.appSize : defaults.appSize;
      const homeLayoutMode = HOME_LAYOUT_MODES.includes(input.homeLayoutMode) ? input.homeLayoutMode : defaults.homeLayoutMode;
      const columns = normalizePositiveNumber(input.columns, defaults.columns, 1);
      const rowHeight = normalizePositiveNumber(input.rowHeight, defaults.rowHeight, 1);
      return {
        version: 1,
        appSize,
        homeLayoutMode,
        columns,
        rowHeight
      };
    }
    function getWidgetMinGeometry(idOrDefinition) {
      const definition = getDefinition(idOrDefinition);
      return {
        w: normalizePositiveNumber(definition && definition.minW, 1, 1),
        h: normalizePositiveNumber(definition && definition.minH, 1, 1)
      };
    }
    function getWidgetMaxGeometry(idOrDefinition, options = {}) {
      const definition = getDefinition(idOrDefinition);
      const columns = normalizePositiveNumber(options.columns, DEFAULT_INTERFACE_LAYOUT.columns, 1);
      return {
        w: Math.min(normalizePositiveNumber(definition && definition.maxW, columns, 1), columns),
        h: normalizePositiveNumber(definition && definition.maxH, 12, 1)
      };
    }
    function getWidgetDefaultGeometry(idOrDefinition, options = {}) {
      const definition = getDefinition(idOrDefinition);
      const columns = normalizePositiveNumber(options.columns, DEFAULT_INTERFACE_LAYOUT.columns, 1);
      const fallback = { x: 0, y: 0, w: Math.min(4, columns), h: 2 };
      const source = definition && definition.defaultGeometry ? definition.defaultGeometry : fallback;
      return clampWidgetGeometry(definition, {
        x: source.x,
        y: source.y,
        w: source.w,
        h: source.h
      }, { columns });
    }
    function clampWidgetGeometry(idOrDefinition, geometry = {}, options = {}) {
      const definition = getDefinition(idOrDefinition);
      const columns = normalizePositiveNumber(options.columns, DEFAULT_INTERFACE_LAYOUT.columns, 1);
      const min = getWidgetMinGeometry(definition);
      const max = getWidgetMaxGeometry(definition, { columns });
      const w = clamp(normalizePositiveNumber(geometry.w, min.w, 1), min.w, Math.max(min.w, max.w));
      const h = clamp(normalizePositiveNumber(geometry.h, min.h, 1), min.h, Math.max(min.h, max.h));
      const x = clamp(normalizePositiveNumber(geometry.x, 0, 0), 0, Math.max(0, columns - w));
      const y = normalizePositiveNumber(geometry.y, 0, 0);
      return { x, y, w, h };
    }
    function normalizeGeometry(widget, definition, columns = DEFAULT_INTERFACE_LAYOUT.columns) {
      const hasGeometry = ["x", "y", "w", "h"].some((key) => Object.prototype.hasOwnProperty.call(widget, key));
      if (!hasGeometry) return {};
      const x = normalizePositiveNumber(widget.x, null, 0);
      const y = normalizePositiveNumber(widget.y, null, 0);
      const w = normalizePositiveNumber(widget.w, null, 1);
      const h = normalizePositiveNumber(widget.h, null, 1);
      if (x === null || y === null || w === null || h === null) return getWidgetDefaultGeometry(definition, { columns });
      return clampWidgetGeometry(definition, { x, y, w, h }, { columns });
    }
    function normalizeHomeLayout2(layout, options = {}) {
      const input = layout && typeof layout === "object" ? layout : {};
      const inputWidgets = Array.isArray(input.widgets) ? input.widgets : [];
      const columns = normalizePositiveNumber(options.columns, DEFAULT_INTERFACE_LAYOUT.columns, 1);
      const definitionsById = new Map(HOME_WIDGET_DEFINITIONS.map((definition) => [definition.id, definition]));
      const usedIds = /* @__PURE__ */ new Set();
      const widgets = [];
      const appendWidget = (definition, widget = {}) => {
        const enabled = typeof widget.enabled === "boolean" ? widget.enabled : definition.defaultEnabled;
        const size = definition.allowedSizes.includes(widget.size) ? widget.size : definition.defaultSize;
        widgets.push({
          id: definition.id,
          enabled,
          size,
          ...normalizeGeometry(widget, definition, columns)
        });
        usedIds.add(definition.id);
      };
      for (const widget of inputWidgets) {
        if (!widget || typeof widget !== "object") continue;
        const definition = definitionsById.get(widget.id);
        if (!definition || usedIds.has(definition.id)) continue;
        appendWidget(definition, widget);
      }
      for (const definition of HOME_WIDGET_DEFINITIONS) {
        if (!usedIds.has(definition.id)) appendWidget(definition);
      }
      return { version: 1, widgets };
    }
    module2.exports = {
      WIDGET_SIZES,
      APP_SIZE_PRESETS,
      HOME_LAYOUT_MODES,
      HOME_WIDGET_DEFINITIONS,
      DEFAULT_HOME_LAYOUT,
      DEFAULT_INTERFACE_LAYOUT,
      getHomeWidgetDefinitions,
      getDefaultHomeLayout,
      getDefaultInterfaceLayout,
      getWidgetDefaultGeometry,
      getWidgetMinGeometry,
      getWidgetMaxGeometry,
      clampWidgetGeometry,
      normalizeInterfaceLayout: normalizeInterfaceLayout2,
      normalizeHomeLayout: normalizeHomeLayout2
    };
  }
});

// src/config/themeConfig.js
var require_themeConfig = __commonJS({
  "src/config/themeConfig.js"(exports2, module2) {
    var THEME_PRESETS = [
      {
        id: "brand-dark",
        title: "Brand Dark",
        description: "Brand dark purple/blue Life RPG palette",
        className: "vrpg-theme-brand-dark"
      }
    ];
    var ACCENT_PRESETS = [
      { id: "purple", title: "Purple", className: "vrpg-accent-purple" },
      { id: "cyan", title: "Cyan", className: "vrpg-accent-cyan" },
      { id: "emerald", title: "Emerald", className: "vrpg-accent-emerald" },
      { id: "crimson", title: "Crimson", className: "vrpg-accent-crimson" },
      { id: "gold", title: "Gold", className: "vrpg-accent-gold" }
    ];
    var DEFAULT_INTERFACE_THEME = {
      version: 1,
      themeId: "brand-dark",
      accentPreset: "purple"
    };
    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }
    function getThemePresets() {
      return clone(THEME_PRESETS);
    }
    function getAccentPresets() {
      return clone(ACCENT_PRESETS);
    }
    function normalizeInterfaceTheme(theme) {
      const input = theme && typeof theme === "object" ? theme : {};
      const themeId = THEME_PRESETS.some((preset) => preset.id === input.themeId) ? input.themeId : DEFAULT_INTERFACE_THEME.themeId;
      const accentPreset = ACCENT_PRESETS.some((preset) => preset.id === input.accentPreset) ? input.accentPreset : DEFAULT_INTERFACE_THEME.accentPreset;
      return {
        version: 1,
        themeId,
        accentPreset
      };
    }
    function getThemeClasses2(theme) {
      const normalized = normalizeInterfaceTheme(theme);
      const themePreset = THEME_PRESETS.find((preset) => preset.id === normalized.themeId);
      const accentPreset = ACCENT_PRESETS.find((preset) => preset.id === normalized.accentPreset);
      return [themePreset && themePreset.className, accentPreset && accentPreset.className].filter(Boolean);
    }
    function getThemeClassList2() {
      return [
        ...THEME_PRESETS.map((preset) => preset.className),
        ...ACCENT_PRESETS.map((preset) => preset.className)
      ];
    }
    module2.exports = {
      THEME_PRESETS,
      ACCENT_PRESETS,
      DEFAULT_INTERFACE_THEME,
      getThemePresets,
      getAccentPresets,
      normalizeInterfaceTheme,
      getThemeClasses: getThemeClasses2,
      getThemeClassList: getThemeClassList2
    };
  }
});

// src/defaults.js
var require_defaults = __commonJS({
  "src/defaults.js"(exports2, module2) {
    var { DEFAULT_HERO_CLASS_ID } = require_heroClassesConfig();
    var {
      getDefaultHomeLayout,
      getDefaultInterfaceLayout
    } = require_layoutConfig();
    var { DEFAULT_INTERFACE_THEME } = require_themeConfig();
    var { DAILY_XP } = require_constants();
    var DEFAULT_DATA = {
      player: {
        name: "Hero",
        classId: DEFAULT_HERO_CLASS_ID,
        className: "Habit Warrior",
        goal: "complete at least 3 dailies per day",
        avatarUrl: ""
      },
      settings: {
        homeLayout: getDefaultHomeLayout(),
        interfaceLayout: getDefaultInterfaceLayout(),
        interfaceTheme: DEFAULT_INTERFACE_THEME
      },
      habits: [
        { id: "gym", title: "Gym", area: "body", icon: "\u{1F3CB}\uFE0F", xp: DAILY_XP, enabled: true, days: null },
        { id: "walk", title: "Walk", area: "body", icon: "\u{1F6B6}", xp: DAILY_XP, enabled: true, days: null },
        { id: "stretch", title: "Stretch", area: "body", icon: "\u{1F9D8}", xp: DAILY_XP, enabled: true, days: null },
        { id: "focus", title: "20 Minutes Quiet Focus", area: "mind", icon: "\u{1F9E0}", xp: DAILY_XP, enabled: true, days: null },
        { id: "bible", title: "Bible Study", area: "spirit", icon: "\u{1F64F}", xp: DAILY_XP, enabled: true, days: null },
        { id: "journal", title: "Journaling", area: "spirit", icon: "\u270D\uFE0F", xp: DAILY_XP, enabled: true, days: null },
        { id: "project", title: "Work / Project", area: "craft", icon: "\u{1F6E0}\uFE0F", xp: DAILY_XP, enabled: true, days: null },
        { id: "chores", title: "Household Chores", area: "hearth", icon: "\u{1F3E1}", xp: DAILY_XP, enabled: true, days: null }
      ],
      quests: [],
      rewards: [
        { id: "youtube", title: "30 Minutes YouTube", cost: 100, icon: "\u25B6\uFE0F", rarity: "common" },
        { id: "coffee", title: "Coffee / Drink", cost: 100, icon: "\u2615", rarity: "common" },
        { id: "dinner", title: "Dinner Out", cost: 250, icon: "\u{1F35C}", rarity: "rare" },
        { id: "game", title: "Game Night", cost: 250, icon: "\u{1F3AE}", rarity: "rare" }
      ],
      days: {},
      inventory: [],
      log: [],
      gold: 0
    };
    module2.exports = { DEFAULT_DATA };
  }
});

// src/storage.js
var require_storage = __commonJS({
  "src/storage.js"(exports2, module2) {
    var { DEFAULT_DATA } = require_defaults();
    var { getHeroClass, resolveHeroClassId: resolveHeroClassId2 } = require_heroClassesConfig();
    var {
      normalizeHomeLayout: normalizeHomeLayout2,
      normalizeInterfaceLayout: normalizeInterfaceLayout2
    } = require_layoutConfig();
    var { normalizeInterfaceTheme } = require_themeConfig();
    var { clone, dateKey: dateKey2 } = require_utils();
    function mergeData2(data) {
      const next = clone(DEFAULT_DATA);
      if (!data || typeof data !== "object") return next;
      next.player = { ...next.player, ...data.player || {} };
      const classId = resolveHeroClassId2(next.player);
      next.player.classId = classId;
      next.player.className = getHeroClass(classId).title;
      const settings = data.settings && typeof data.settings === "object" ? data.settings : {};
      next.settings = {
        ...next.settings,
        ...settings,
        interfaceLayout: normalizeInterfaceLayout2(settings.interfaceLayout),
        interfaceTheme: normalizeInterfaceTheme(settings.interfaceTheme),
        homeLayout: normalizeHomeLayout2(settings.homeLayout, normalizeInterfaceLayout2(settings.interfaceLayout))
      };
      delete next.settings.questStatsCards;
      delete next.settings.customQuestStatsCards;
      next.habits = Array.isArray(data.habits) ? data.habits : next.habits;
      next.rewards = Array.isArray(data.rewards) ? data.rewards : next.rewards;
      next.days = data.days && typeof data.days === "object" ? data.days : next.days;
      next.inventory = Array.isArray(data.inventory) ? data.inventory : next.inventory;
      next.quests = Array.isArray(data.quests) ? data.quests : next.quests;
      next.log = Array.isArray(data.log) ? data.log : next.log;
      next.gold = typeof data.gold === "number" ? data.gold : next.gold;
      return next;
    }
    function getDay2(data, key = dateKey2()) {
      if (!data.days[key]) data.days[key] = { completed: {}, note: "" };
      if (!data.days[key].completed) data.days[key].completed = {};
      return data.days[key];
    }
    module2.exports = {
      mergeData: mergeData2,
      getDay: getDay2
    };
  }
});

// src/ui/components/progressBar.js
var require_progressBar = __commonJS({
  "src/ui/components/progressBar.js"(exports2, module2) {
    function createProgressBar2(parent, percent, className = "") {
      const bar = parent.createDiv({ cls: `vrpg-bar ${className}`.trim() });
      bar.createDiv({ cls: "vrpg-fill", attr: { style: `width:${percent}%` } });
      return bar;
    }
    module2.exports = {
      createProgressBar: createProgressBar2
    };
  }
});

// src/ui/components/statCard.js
var require_statCard = __commonJS({
  "src/ui/components/statCard.js"(exports2, module2) {
    function createStatCard2(parent, options, value, className = "vrpg-panel") {
      const config = typeof options === "object" && options !== null ? options : { label: options, value, className };
      const card = parent.createDiv({ cls: config.className || "vrpg-panel" });
      card.createDiv({ cls: "vrpg-section", text: config.label });
      card.createDiv({ cls: "vrpg-stat-value", text: config.value });
      if (config.note) card.createDiv({ cls: "vrpg-subtitle", text: config.note });
      return card;
    }
    module2.exports = {
      createStatCard: createStatCard2
    };
  }
});

// src/ui/components/radarChart.js
var require_radarChart = __commonJS({
  "src/ui/components/radarChart.js"(exports2, module2) {
    function renderRadarChart2(parent, metrics) {
      const size = 280;
      const center = size / 2;
      const radius = 92;
      const angle = (index) => -Math.PI / 2 + index * Math.PI * 2 / metrics.length;
      const point = (index, value = 100) => {
        const r = radius * value / 100;
        const a = angle(index);
        return [center + Math.cos(a) * r, center + Math.sin(a) * r];
      };
      const polygon = metrics.map((metric, index) => point(index, metric[1]).join(",")).join(" ");
      const ns = "http://www.w3.org/2000/svg";
      const wrap = parent.createDiv({ cls: "vrpg-radar-wrap" });
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("class", "vrpg-radar");
      for (const scale of [25, 50, 75, 100]) {
        const ring = document.createElementNS(ns, "polygon");
        ring.setAttribute("points", metrics.map((_, index) => point(index, scale).join(",")).join(" "));
        ring.setAttribute("class", "vrpg-radar-ring");
        svg.appendChild(ring);
      }
      metrics.forEach((metric, index) => {
        const [x, y] = point(index, 112);
        const linePoint = point(index, 100);
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", String(center));
        line.setAttribute("y1", String(center));
        line.setAttribute("x2", String(linePoint[0]));
        line.setAttribute("y2", String(linePoint[1]));
        line.setAttribute("class", "vrpg-radar-axis");
        svg.appendChild(line);
        const label = document.createElementNS(ns, "text");
        label.setAttribute("x", String(x));
        label.setAttribute("y", String(y));
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute("class", "vrpg-radar-label");
        label.textContent = metric[0];
        svg.appendChild(label);
      });
      const shape = document.createElementNS(ns, "polygon");
      shape.setAttribute("points", polygon);
      shape.setAttribute("class", "vrpg-radar-shape");
      svg.appendChild(shape);
      wrap.appendChild(svg);
    }
    module2.exports = {
      renderRadarChart: renderRadarChart2
    };
  }
});

// src/systems/layoutSystem.js
var require_layoutSystem = __commonJS({
  "src/systems/layoutSystem.js"(exports2, module2) {
    var {
      getDefaultHomeLayout,
      getDefaultInterfaceLayout,
      getHomeWidgetDefinitions,
      normalizeInterfaceLayout: normalizeInterfaceLayout2,
      normalizeHomeLayout: normalizeHomeLayout2
    } = require_layoutConfig();
    var HOME_WIDGET_SIZE_CLASSES = {
      small: "vrpg-widget-small",
      medium: "vrpg-widget-medium",
      large: "vrpg-widget-large",
      full: "vrpg-widget-full"
    };
    function getHomeLayout(settings = {}) {
      const interfaceLayout = getInterfaceLayout(settings);
      const source = settings && typeof settings === "object" ? settings.homeLayout : null;
      return source ? normalizeHomeLayout2(source, interfaceLayout) : normalizeHomeLayout2(getDefaultHomeLayout(), interfaceLayout);
    }
    function mergeHomeLayout(layout) {
      return normalizeHomeLayout2(layout);
    }
    function clearHomeLayoutGeometry(layout) {
      const normalized = normalizeHomeLayout2(layout);
      return {
        version: normalized.version || 1,
        widgets: normalized.widgets.map(({ x, y, w, h, ...widget }) => widget)
      };
    }
    function resetHomeLayoutToDefault() {
      return normalizeHomeLayout2(getDefaultHomeLayout());
    }
    function getInterfaceLayout(settings = {}) {
      const source = settings && typeof settings === "object" ? settings.interfaceLayout : null;
      return source ? normalizeInterfaceLayout2(source) : normalizeInterfaceLayout2(getDefaultInterfaceLayout());
    }
    function getHomeLayoutMode(settings = {}) {
      return getInterfaceLayout(settings).homeLayoutMode;
    }
    function getAppSizePreset2(settings = {}) {
      return getInterfaceLayout(settings).appSize;
    }
    function getHomeLayoutColumns(settings = {}) {
      return getInterfaceLayout(settings).columns;
    }
    function getHomeLayoutRowHeight(settings = {}) {
      return getInterfaceLayout(settings).rowHeight;
    }
    function getEnabledHomeWidgets(layout) {
      const normalized = normalizeHomeLayout2(layout);
      return normalized.widgets.filter((widget) => widget.enabled !== false);
    }
    function getHomeWidgetById(id) {
      return getHomeWidgetDefinitions().find((widget) => widget.id === id) || null;
    }
    function getHomeWidgetSizeClass(size) {
      return HOME_WIDGET_SIZE_CLASSES[size] || HOME_WIDGET_SIZE_CLASSES.medium;
    }
    module2.exports = {
      getHomeLayout,
      mergeHomeLayout,
      clearHomeLayoutGeometry,
      resetHomeLayoutToDefault,
      getInterfaceLayout,
      getHomeLayoutMode,
      getAppSizePreset: getAppSizePreset2,
      getHomeLayoutColumns,
      getHomeLayoutRowHeight,
      getEnabledHomeWidgets,
      getHomeWidgetById,
      getHomeWidgetSizeClass
    };
  }
});

// src/systems/widgetSystem.js
var require_widgetSystem = __commonJS({
  "src/systems/widgetSystem.js"(exports2, module2) {
    var {
      clampWidgetGeometry,
      getDefaultHomeLayout,
      getHomeWidgetDefinitions,
      getWidgetDefaultGeometry,
      getWidgetMaxGeometry,
      getWidgetMinGeometry
    } = require_layoutConfig();
    var {
      getEnabledHomeWidgets,
      getHomeLayout,
      getHomeWidgetById,
      getHomeWidgetSizeClass,
      mergeHomeLayout
    } = require_layoutSystem();
    var WIDGET_SIZE_FALLBACK = "medium";
    function getWidgetRegistry() {
      return getHomeWidgetDefinitions().reduce((registry, widget) => {
        registry[widget.id] = widget;
        return registry;
      }, {});
    }
    function getWidgetDefinition(id) {
      return getHomeWidgetById(id);
    }
    function getDefaultWidgetLayout() {
      return getDefaultHomeLayout();
    }
    function getEnabledWidgets(settings = {}) {
      return getEnabledHomeWidgets(getHomeLayout(settings));
    }
    function getWidgetSize(widget = {}) {
      const definition = getWidgetDefinition(widget.id);
      if (definition && definition.allowedSizes.includes(widget.size)) return widget.size;
      return WIDGET_SIZE_FALLBACK;
    }
    function getWidgetCssClass(widget = {}) {
      return getHomeWidgetSizeClass(getWidgetSize(widget));
    }
    function hasWidgetGeometry(widget = {}) {
      return ["x", "y", "w", "h"].every((key) => Number.isFinite(Number(widget[key])));
    }
    function getWidgetGeometry(widget = {}) {
      if (!hasWidgetGeometry(widget)) return null;
      return {
        x: Number(widget.x),
        y: Number(widget.y),
        w: Number(widget.w),
        h: Number(widget.h)
      };
    }
    function getWidgetOrder(layout) {
      return mergeHomeLayout(layout).widgets.map((widget) => widget.id);
    }
    module2.exports = {
      getWidgetRegistry,
      getWidgetDefinition,
      getDefaultWidgetLayout,
      getEnabledWidgets,
      getWidgetSize,
      getWidgetCssClass,
      getWidgetDefaultGeometry,
      hasWidgetGeometry,
      getWidgetGeometry,
      getWidgetMinGeometry,
      getWidgetMaxGeometry,
      clampWidgetGeometry,
      getWidgetOrder
    };
  }
});

// src/ui/screens/homeScreen.js
var require_homeScreen = __commonJS({
  "src/ui/screens/homeScreen.js"(exports2, module2) {
    var {
      clampWidgetGeometry,
      getEnabledWidgets,
      getWidgetCssClass,
      getWidgetDefinition,
      getWidgetGeometry,
      getWidgetMaxGeometry,
      getWidgetMinGeometry
    } = require_widgetSystem();
    var {
      getHomeLayout,
      getHomeLayoutColumns,
      getHomeLayoutMode,
      getHomeLayoutRowHeight
    } = require_layoutSystem();
    var {
      normalizeHomeLayout: normalizeHomeLayout2
    } = require_layoutConfig();
    var HOME_PANEL_WIDGET_IDS = ["today", "hero", "quests", "rewards", "inventory", "log"];
    var ENABLE_HOME_FREEFORM = false;
    var ENABLE_HOME_FREEFORM_RESIZE = false;
    function isHomePanelWidget(id) {
      return HOME_PANEL_WIDGET_IDS.includes(id);
    }
    function getWidgetClass(baseClass, widget) {
      return [
        baseClass,
        "vrpg-widget",
        getWidgetCssClass(widget)
      ].filter(Boolean).join(" ");
    }
    function getWidgetAttr(widget) {
      return { "data-widget-id": widget.id };
    }
    function getEnabledLayoutWidgets(data = {}) {
      return getEnabledWidgets(data.settings || {});
    }
    function getActivePanelWidget(panelWidgets, requestedPanel) {
      if (!panelWidgets.length) return null;
      const defaultPanel = panelWidgets.find((widget) => widget.id === "hero") || panelWidgets[0];
      if (!requestedPanel || requestedPanel === "dashboard") return defaultPanel;
      return panelWidgets.find((widget) => widget.id === requestedPanel) || defaultPanel;
    }
    function getFallbackGeometry(widget, index, columns) {
      const sizeGeometry = {
        small: { w: 3, h: 2 },
        medium: { w: 6, h: 2 },
        large: { w: 8, h: 3 },
        full: { w: columns, h: 3 }
      };
      const base = sizeGeometry[widget.size] || sizeGeometry.medium;
      const w = Math.min(base.w, columns);
      const h = base.h;
      const x = index % 2 === 0 ? 0 : Math.max(0, columns - w);
      const y = Math.floor(index / 2) * 3;
      return { x, y, w, h };
    }
    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
    function renderHomeScreen2(parent, ctx = {}) {
      const data = ctx.data;
      const totals2 = ctx.totals;
      const dateKey2 = ctx.dateKey;
      const readDayStats2 = ctx.readDayStats;
      const displayDateFromKey2 = ctx.displayDateFromKey;
      const streak2 = ctx.streak;
      const getHeroClassTitle2 = ctx.getHeroClassTitle;
      const getDay2 = ctx.getDay || (() => ({ completed: {}, mood: "normal" }));
      const activeHabits2 = ctx.activeHabits || (() => []);
      const skillStats2 = ctx.skillStats || (() => ({
        body: { done: 0, total: 0 },
        mind: { done: 0, total: 0 },
        craft: { done: 0, total: 0 },
        control: { done: 0, total: 0 }
      }));
      const heroTitle2 = ctx.heroTitle || ((level) => `Level ${level}`);
      const renderHomeLog = ctx.renderHomeLog;
      const createProgressBar2 = ctx.createProgressBar;
      const text = ctx.text;
      const timeParts2 = ctx.timeParts;
      const dayPhase2 = ctx.dayPhase;
      const monthLabel2 = ctx.monthLabel;
      const dateFromKey2 = ctx.dateFromKey || (() => /* @__PURE__ */ new Date());
      const calendarDays2 = ctx.calendarDays;
      const coreAttributes2 = ctx.coreAttributes;
      const renderAvatar = ctx.renderAvatar;
      const navigate = ctx.navigate;
      const toggleHomeEditMode = ctx.toggleHomeEditMode || (() => {
      });
      const updateHomeLayout = ctx.updateHomeLayout || (() => {
      });
      const toggleHabit = ctx.toggleHabit || (() => {
      });
      const t = totals2(data);
      const now = /* @__PURE__ */ new Date();
      const selectedKey = ctx.selectedDateKey || dateKey2(now);
      const selectedDate = dateFromKey2(selectedKey);
      const selectedStats = readDayStats2(data, selectedKey);
      const weekKeys = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        weekKeys.push(dateKey2(date));
      }
      const weekStats = weekKeys.map((key) => readDayStats2(data, key));
      const strongDays = weekStats.filter((day) => day.percent >= 50).length;
      const bestDay = weekStats.reduce((best, day) => day.xp > best.xp ? day : best, { xp: 0, key: "" });
      const today = selectedStats;
      const selectedDay = getDay2(data, selectedKey);
      const habits = activeHabits2(data);
      const isTodaySelected = selectedKey === dateKey2(now);
      const nextReward = data.rewards.slice().sort((a, b) => Number(a.cost || 0) - Number(b.cost || 0)).find((reward) => Number(reward.cost || 0) > t.gold);
      const nextRewardText = nextReward ? `${Number(nextReward.cost || 0) - t.gold} Gold until "${nextReward.title}"` : "All rewards available";
      const todayPercent = today.total ? Math.round(today.done / today.total * 100) : 0;
      const layoutWidgets = getEnabledLayoutWidgets(data);
      const widgetById = new Map(layoutWidgets.map((widget) => [widget.id, widget]));
      const panelWidgets = layoutWidgets.filter((widget) => isHomePanelWidget(widget.id));
      const activePanelWidget = getActivePanelWidget(panelWidgets, ctx.homePanel);
      const activePanelId = activePanelWidget ? activePanelWidget.id : "";
      const visibleWidgetIds = /* @__PURE__ */ new Set(["command", "clock", "calendar"]);
      if (activePanelWidget) visibleWidgetIds.add(activePanelWidget.id);
      const rawHomeEditMode = !!ctx.isHomeEditMode;
      const homeLayoutMode = getHomeLayoutMode(data.settings || {});
      const isFreeformMode = ENABLE_HOME_FREEFORM && homeLayoutMode === "freeform";
      const isGridMode = !isFreeformMode;
      const isHomeEditMode = isFreeformMode && rawHomeEditMode;
      const columns = getHomeLayoutColumns(data.settings || {});
      const rowHeight = getHomeLayoutRowHeight(data.settings || {});
      let fallbackGeometryIndex = 0;
      let draggedWidgetId = null;
      const widgetGeometryById = /* @__PURE__ */ new Map();
      if (isFreeformMode) {
        const editBar = parent.createDiv({ cls: "vrpg-home-edit-bar" });
        const editButton = editBar.createEl("button", {
          cls: isHomeEditMode ? "vrpg-primary is-active" : "vrpg-primary",
          text: isHomeEditMode ? "Done" : "Edit Screen"
        });
        editButton.onclick = toggleHomeEditMode;
      }
      const top = parent.createDiv({
        cls: [
          "vrpg-home-top",
          isFreeformMode ? "vrpg-freeform-canvas" : "vrpg-widget-grid",
          isGridMode ? "vrpg-home-shell" : "",
          isHomeEditMode ? "vrpg-home-edit-mode" : ""
        ].filter(Boolean).join(" ")
      });
      if (isFreeformMode) {
        top.style.setProperty("--vrpg-freeform-columns", String(columns));
        top.style.setProperty("--vrpg-freeform-row-height", `${rowHeight}px`);
        top.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
      }
      const getGridMetrics = () => {
        const canvasRect = top.getBoundingClientRect();
        const styles = window.getComputedStyle(top);
        const columnGap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
        const rowGap = Number.parseFloat(styles.rowGap || styles.gap || "0") || 0;
        const columnWidth = columns > 0 ? (canvasRect.width - columnGap * Math.max(0, columns - 1)) / columns : canvasRect.width;
        return {
          canvasRect,
          columnGap,
          rowGap,
          columnWidth,
          columnStep: Math.max(1, columnWidth + columnGap),
          rowStep: Math.max(1, rowHeight + rowGap)
        };
      };
      const isFreeformInteractionDisabled = () => {
        const rect = top.getBoundingClientRect();
        return rect.width < 720 || window.matchMedia && window.matchMedia("(max-width: 820px)").matches;
      };
      const applyFreeformGeometry = (root, geometry) => {
        root.style.setProperty("--vrpg-widget-x", String(geometry.x));
        root.style.setProperty("--vrpg-widget-y", String(geometry.y));
        root.style.setProperty("--vrpg-widget-w", String(geometry.w));
        root.style.setProperty("--vrpg-widget-h", String(geometry.h));
        root.style.gridColumn = `${geometry.x + 1} / span ${geometry.w}`;
        root.style.gridRow = `${geometry.y + 1} / span ${geometry.h}`;
      };
      const geometriesOverlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
      const hasGeometryCollision = (id, geometry) => {
        for (const widget of layoutWidgets) {
          if (widget.id === id || !visibleWidgetIds.has(widget.id)) continue;
          const otherGeometry = widgetGeometryById.get(widget.id);
          if (otherGeometry && geometriesOverlap(geometry, otherGeometry)) return true;
        }
        return false;
      };
      const setGeometryValidation = (root, id, geometry) => {
        const invalid = hasGeometryCollision(id, geometry);
        root.classList.toggle("is-invalid-drop", invalid);
        root.classList.toggle("is-valid-drop", !invalid);
        return !invalid;
      };
      const clearGeometryValidation = (root) => {
        root.classList.remove("is-invalid-drop", "is-valid-drop");
      };
      const returnToGeometry = (root, geometry) => {
        root.classList.add("is-returning");
        clearPixelPreview(root);
        applyFreeformGeometry(root, geometry);
        window.setTimeout(() => {
          root.classList.remove("is-returning");
          clearGeometryValidation(root);
        }, 220);
      };
      const geometryWidthToPixels = (w, metrics) => Math.max(1, w * metrics.columnWidth + Math.max(0, w - 1) * metrics.columnGap);
      const geometryHeightToPixels = (h, metrics) => Math.max(1, h * rowHeight + Math.max(0, h - 1) * metrics.rowGap);
      const clearPixelPreview = (root) => {
        root.style.transform = "";
        root.style.width = "";
        root.style.height = "";
        root.style.minHeight = "";
      };
      const pixelPositionToGeometry = (left, topValue, geometry, metrics) => ({
        x: clamp(Math.round(left / metrics.columnStep), 0, Math.max(0, columns - geometry.w)),
        y: Math.max(0, Math.round(topValue / metrics.rowStep)),
        w: geometry.w,
        h: geometry.h
      });
      const pixelSizeToGeometry = (id, width, height, geometry, metrics) => clampWidgetGeometry(id, {
        x: geometry.x,
        y: geometry.y,
        w: Math.max(1, Math.round((width + metrics.columnGap) / metrics.columnStep)),
        h: Math.max(1, Math.round((height + metrics.rowGap) / metrics.rowStep))
      }, { columns });
      const clearDragState = () => {
        top.querySelectorAll(".is-dragging, .is-drag-over, .is-drag-over-before, .is-drag-over-after").forEach((element) => {
          element.classList.remove("is-dragging", "is-drag-over", "is-drag-over-before", "is-drag-over-after");
        });
      };
      const moveHomeWidgetTo = (id, targetId, placeAfter) => {
        const current = getHomeLayout(data.settings || {});
        const widgets = current.widgets.map((widget2) => ({ ...widget2 }));
        const fromIndex = widgets.findIndex((widget2) => widget2.id === id);
        const targetIndex = widgets.findIndex((widget2) => widget2.id === targetId);
        if (fromIndex < 0 || targetIndex < 0 || id === targetId) return;
        const [widget] = widgets.splice(fromIndex, 1);
        const adjustedTargetIndex = widgets.findIndex((item) => item.id === targetId);
        widgets.splice(adjustedTargetIndex + (placeAfter ? 1 : 0), 0, widget);
        updateHomeLayout(normalizeHomeLayout2({
          version: current.version || 1,
          widgets
        }, { columns }));
      };
      const saveWidgetGeometry = (id, geometry) => {
        const current = getHomeLayout(data.settings || {});
        const widgets = current.widgets.map((widget2) => ({ ...widget2 }));
        const widget = widgets.find((item) => item.id === id);
        if (!widget) return;
        Object.assign(widget, {
          x: geometry.x,
          y: geometry.y,
          w: geometry.w,
          h: geometry.h
        });
        updateHomeLayout(normalizeHomeLayout2({
          version: current.version || 1,
          widgets
        }, { columns }));
      };
      const attachGridEditHandle = (root, widget) => {
        root.classList.add("vrpg-widget-editing");
        const handle = root.createEl("button", {
          cls: "vrpg-home-drag-handle",
          text: "\u2195",
          attr: {
            draggable: "true",
            title: "Drag widget"
          }
        });
        handle.ondragstart = (event) => {
          draggedWidgetId = widget.id;
          root.classList.add("is-dragging");
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", widget.id);
          }
        };
        handle.ondragend = () => {
          draggedWidgetId = null;
          clearDragState();
        };
        root.ondragover = (event) => {
          if (!draggedWidgetId || draggedWidgetId === widget.id) return;
          event.preventDefault();
          const rect = root.getBoundingClientRect();
          const placeAfter = event.clientY > rect.top + rect.height / 2;
          root.classList.add("is-drag-over");
          root.classList.toggle("is-drag-over-before", !placeAfter);
          root.classList.toggle("is-drag-over-after", placeAfter);
          if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        };
        root.ondragleave = () => {
          root.classList.remove("is-drag-over", "is-drag-over-before", "is-drag-over-after");
        };
        root.ondrop = (event) => {
          const sourceId = draggedWidgetId || event.dataTransfer && event.dataTransfer.getData("text/plain");
          if (!sourceId || sourceId === widget.id) return;
          event.preventDefault();
          const rect = root.getBoundingClientRect();
          const placeAfter = event.clientY > rect.top + rect.height / 2;
          draggedWidgetId = null;
          clearDragState();
          moveHomeWidgetTo(sourceId, widget.id, placeAfter);
        };
      };
      const attachFreeformEditHandle = (root, widget, geometry) => {
        root.classList.add("vrpg-widget-editing");
        const definition = getWidgetDefinition(widget.id) || {};
        const header = root.createDiv({ cls: "vrpg-home-widget-header" });
        const meta = header.createDiv({ cls: "vrpg-home-widget-header-meta" });
        meta.createDiv({ cls: "vrpg-home-widget-title", text: definition.title || widget.id });
        meta.createDiv({ cls: "vrpg-home-widget-description", text: definition.description || widget.id });
        const actions = header.createDiv({ cls: "vrpg-home-widget-actions" });
        const handle = actions.createEl("button", {
          cls: "vrpg-home-drag-handle",
          text: "\u2195",
          attr: {
            title: "Drag widget"
          }
        });
        handle.onpointerdown = (event) => {
          if (isFreeformInteractionDisabled()) return;
          event.preventDefault();
          event.stopPropagation();
          const metrics = getGridMetrics();
          const widgetRect = root.getBoundingClientRect();
          const start = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            left: widgetRect.left - metrics.canvasRect.left,
            top: widgetRect.top - metrics.canvasRect.top,
            x: geometry.x,
            y: geometry.y,
            w: geometry.w,
            h: geometry.h
          };
          let nextGeometry = { ...geometry };
          let isValidGeometry = true;
          root.classList.add("is-dragging");
          top.classList.add("is-freeform-dragging");
          if (handle.setPointerCapture) handle.setPointerCapture(event.pointerId);
          const onPointerMove = (moveEvent) => {
            moveEvent.preventDefault();
            const deltaX = moveEvent.clientX - start.pointerX;
            const deltaY = moveEvent.clientY - start.pointerY;
            const finalLeft = start.left + deltaX;
            const finalTop = start.top + deltaY;
            nextGeometry = pixelPositionToGeometry(finalLeft, finalTop, geometry, metrics);
            root.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.012)`;
            isValidGeometry = setGeometryValidation(root, widget.id, nextGeometry);
          };
          const onPointerUp = (upEvent) => {
            upEvent.preventDefault();
            handle.removeEventListener("pointermove", onPointerMove);
            handle.removeEventListener("pointerup", onPointerUp);
            handle.removeEventListener("pointercancel", onPointerUp);
            if (handle.releasePointerCapture) {
              try {
                handle.releasePointerCapture(upEvent.pointerId);
              } catch (error) {
              }
            }
            root.classList.remove("is-dragging");
            top.classList.remove("is-freeform-dragging");
            if (!isValidGeometry) {
              returnToGeometry(root, geometry);
              return;
            }
            clearGeometryValidation(root);
            clearPixelPreview(root);
            applyFreeformGeometry(root, nextGeometry);
            if (nextGeometry.x !== geometry.x || nextGeometry.y !== geometry.y) {
              saveWidgetGeometry(widget.id, nextGeometry);
            }
          };
          handle.addEventListener("pointermove", onPointerMove);
          handle.addEventListener("pointerup", onPointerUp);
          handle.addEventListener("pointercancel", onPointerUp);
        };
        if (!ENABLE_HOME_FREEFORM_RESIZE) return;
        const resize = root.createEl("button", {
          cls: "vrpg-home-resize-handle",
          text: "\u2198",
          attr: {
            title: "Resize widget"
          }
        });
        resize.onpointerdown = (event) => {
          if (isFreeformInteractionDisabled()) return;
          event.preventDefault();
          event.stopPropagation();
          const metrics = getGridMetrics();
          const widgetRect = root.getBoundingClientRect();
          const min = getWidgetMinGeometry(widget.id);
          const max = getWidgetMaxGeometry(widget.id, { columns });
          const maxW = Math.min(max.w, Math.max(min.w, columns - geometry.x));
          const minWidth = geometryWidthToPixels(min.w, metrics);
          const minHeight = geometryHeightToPixels(min.h, metrics);
          const maxWidth = geometryWidthToPixels(maxW, metrics);
          const maxHeight = geometryHeightToPixels(max.h, metrics);
          const start = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            width: widgetRect.width,
            height: widgetRect.height,
            x: geometry.x,
            y: geometry.y,
            w: geometry.w,
            h: geometry.h
          };
          let nextGeometry = { ...geometry };
          let isValidGeometry = true;
          root.classList.add("is-resizing");
          top.classList.add("is-freeform-resizing");
          if (resize.setPointerCapture) resize.setPointerCapture(event.pointerId);
          const onPointerMove = (moveEvent) => {
            moveEvent.preventDefault();
            const previewWidth = clamp(start.width + moveEvent.clientX - start.pointerX, minWidth, maxWidth);
            const previewHeight = clamp(start.height + moveEvent.clientY - start.pointerY, minHeight, maxHeight);
            nextGeometry = pixelSizeToGeometry(widget.id, previewWidth, previewHeight, geometry, metrics);
            root.style.width = `${previewWidth}px`;
            root.style.height = `${previewHeight}px`;
            root.style.minHeight = `${previewHeight}px`;
            isValidGeometry = setGeometryValidation(root, widget.id, nextGeometry);
          };
          const onPointerUp = (upEvent) => {
            upEvent.preventDefault();
            resize.removeEventListener("pointermove", onPointerMove);
            resize.removeEventListener("pointerup", onPointerUp);
            resize.removeEventListener("pointercancel", onPointerUp);
            if (resize.releasePointerCapture) {
              try {
                resize.releasePointerCapture(upEvent.pointerId);
              } catch (error) {
              }
            }
            root.classList.remove("is-resizing");
            top.classList.remove("is-freeform-resizing");
            if (!isValidGeometry) {
              returnToGeometry(root, geometry);
              return;
            }
            clearGeometryValidation(root);
            clearPixelPreview(root);
            applyFreeformGeometry(root, nextGeometry);
            if (nextGeometry.w !== geometry.w || nextGeometry.h !== geometry.h) {
              saveWidgetGeometry(widget.id, nextGeometry);
            }
          };
          resize.addEventListener("pointermove", onPointerMove);
          resize.addEventListener("pointerup", onPointerUp);
          resize.addEventListener("pointercancel", onPointerUp);
        };
      };
      const attachHomeEditHandle = (root, widget, geometry) => {
        if (!isHomeEditMode || !root || !widget) return;
        if (isFreeformMode) {
          attachFreeformEditHandle(root, widget, geometry);
          return;
        }
        if (isGridMode) attachGridEditHandle(root, widget);
      };
      const prepareWidgetRoot = (root, widget) => {
        if (!root || !widget) return root;
        let geometry = null;
        if (isFreeformMode) {
          geometry = getWidgetGeometry(widget) || getFallbackGeometry(widget, fallbackGeometryIndex, columns);
          fallbackGeometryIndex += 1;
          widgetGeometryById.set(widget.id, geometry);
          root.classList.add("vrpg-freeform-widget");
          applyFreeformGeometry(root, geometry);
        }
        attachHomeEditHandle(root, widget, geometry);
        return root;
      };
      const renderCommandWidget = (widget, parentEl = top) => {
        const card = parentEl.createDiv({
          cls: getWidgetClass("vrpg-hero-card vrpg-command-card", widget),
          attr: getWidgetAttr(widget)
        });
        prepareWidgetRoot(card, widget);
        const commandHeader = card.createDiv({ cls: "vrpg-command-header" });
        const profile = commandHeader.createDiv({ cls: "vrpg-command-profile" });
        renderAvatar(profile, data, "vrpg-command-avatar");
        const profileText = profile.createDiv({ cls: "vrpg-command-identity" });
        profileText.createDiv({ cls: "vrpg-kicker", text: isTodaySelected ? text.dayPanel : selectedKey });
        profileText.createDiv({ cls: "vrpg-title", text: data.player.name || `Level ${t.level}` });
        profileText.createDiv({ cls: "vrpg-subtitle", text: `${getHeroClassTitle2(data.player)} \xB7 Level ${t.level}` });
        const commandVitals = commandHeader.createDiv({ cls: "vrpg-command-vitals" });
        const goldVital = commandVitals.createDiv({ cls: "vrpg-command-vital" });
        goldVital.createDiv({ cls: "vrpg-section", text: "Gold" });
        goldVital.createDiv({ cls: "vrpg-card-title", text: `${t.gold}` });
        goldVital.createDiv({ cls: "vrpg-subtitle", text: `${t.levelXP}/100 to level` });
        const streakVital = commandVitals.createDiv({ cls: "vrpg-command-vital" });
        streakVital.createDiv({ cls: "vrpg-section", text: "Streak" });
        streakVital.createDiv({ cls: "vrpg-card-title", text: `${streak2(data)}` });
        streakVital.createDiv({ cls: "vrpg-subtitle", text: "days" });
        createProgressBar2(card, todayPercent, "vrpg-command-progress");
        const commandGrid = card.createDiv({ cls: "vrpg-command-grid" });
        const commandItems = {
          today: [isTodaySelected ? "Today" : "Day", "Check off dailies"],
          hero: ["Hero", `${t.levelXP}/100 XP to level`],
          quests: ["Quests", `${(data.quests || []).filter((q) => !q.completed && !q.abandoned).length} active`],
          rewards: ["Shop", nextRewardText],
          inventory: ["Inventory", `${data.inventory.filter((item) => !item.used).length} active`],
          log: ["Log", `${(data.log || []).length} entries`]
        };
        const panelWidgetById = new Map(panelWidgets.map((panelWidget) => [panelWidget.id, panelWidget]));
        HOME_PANEL_WIDGET_IDS.forEach((id) => {
          const panelWidget = panelWidgetById.get(id);
          if (!panelWidget) return;
          const [title, desc] = commandItems[panelWidget.id];
          const action = commandGrid.createEl("button", { cls: activePanelId === panelWidget.id ? "vrpg-command-action is-active" : "vrpg-command-action" });
          action.createEl("strong", { text: title });
          action.createSpan({ text: desc });
          action.onclick = () => {
            navigate({ tab: "home", homePanel: panelWidget.id });
          };
        });
      };
      const renderClockWidget = (widget, parentEl = top) => {
        const clock = parentEl.createDiv({
          cls: getWidgetClass("vrpg-glass-widget vrpg-clock-widget", widget),
          attr: getWidgetAttr(widget)
        });
        prepareWidgetRoot(clock, widget);
        clock.createDiv({ cls: "vrpg-kicker", text: "Now" });
        const parts = timeParts2(now);
        const clockFace = clock.createDiv({ cls: "vrpg-clock" });
        clockFace.createSpan({ text: parts.hours });
        clockFace.createSpan({ cls: "vrpg-clock-colon", text: ":" });
        clockFace.createSpan({ text: parts.minutes });
        clock.createDiv({ cls: "vrpg-phase", text: dayPhase2(now) });
        clock.createDiv({ cls: "vrpg-subtitle", text: now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" }) });
      };
      const renderCalendarWidget = (widget, parentEl = top) => {
        const calendarDate = Number.isFinite(selectedDate.getTime()) ? selectedDate : now;
        const monthDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
        const moveMonth = (delta) => {
          const targetYear = monthDate.getFullYear();
          const targetMonth = monthDate.getMonth() + delta;
          const maxDay = new Date(targetYear, targetMonth + 1, 0).getDate();
          const targetDay = Math.min(calendarDate.getDate(), maxDay);
          navigate({ selectedDateKey: dateKey2(new Date(targetYear, targetMonth, targetDay)) });
        };
        const calendar = parentEl.createDiv({
          cls: getWidgetClass("vrpg-glass-widget", widget),
          attr: getWidgetAttr(widget)
        });
        prepareWidgetRoot(calendar, widget);
        const calendarHeader = calendar.createDiv({ cls: "vrpg-preview-header" });
        calendarHeader.createEl("button", { cls: "vrpg-icon-action", text: "\u2039" }).onclick = () => moveMonth(-1);
        calendarHeader.createDiv({ cls: "vrpg-kicker", text: monthLabel2(monthDate) });
        calendarHeader.createEl("button", { cls: "vrpg-icon-action", text: "\u203A" }).onclick = () => moveMonth(1);
        const week = calendar.createDiv({ cls: "vrpg-calendar" });
        ["M", "T", "W", "T", "F", "S", "S"].forEach((day) => week.createSpan({ cls: "vrpg-calendar-head", text: day }));
        for (const day of calendarDays2(monthDate)) {
          const key = day ? dateKey2(new Date(monthDate.getFullYear(), monthDate.getMonth(), day)) : "";
          const dayButton = week.createEl("button", {
            cls: [
              "vrpg-calendar-day",
              key === dateKey2(now) ? "is-today" : "",
              key === selectedKey ? "is-selected" : ""
            ].filter(Boolean).join(" "),
            text: day ? String(day) : ""
          });
          if (day) {
            dayButton.onclick = () => {
              navigate({ selectedDateKey: key });
            };
          } else {
            dayButton.disabled = true;
          }
        }
        const dayDetails = calendar.createDiv({ cls: "vrpg-calendar-details" });
        dayDetails.createDiv({ cls: "vrpg-card-title", text: selectedKey });
        dayDetails.createDiv({ cls: "vrpg-subtitle", text: `Dailies: ${selectedStats.done}/${selectedStats.total} \xB7 ${selectedStats.xp} XP earned` });
        dayDetails.createDiv({ cls: "vrpg-subtitle", text: isGridMode ? `Week: ${strongDays}/7 \xB7 streak ${streak2(data)}` : `Week: ${strongDays}/7 strong days \xB7 best day ${bestDay.xp} XP \xB7 streak ${streak2(data)}` });
      };
      const renderPreviewWidget = (widget, className, title, subtitle, renderBody, options = {}) => {
        const card = top.createDiv({
          cls: getWidgetClass(`vrpg-home-module vrpg-home-preview ${className}`, widget),
          attr: getWidgetAttr(widget)
        });
        prepareWidgetRoot(card, widget);
        const header = card.createDiv({ cls: "vrpg-preview-header" });
        const titleWrap = header.createDiv();
        titleWrap.createDiv({ cls: "vrpg-section", text: title });
        if (subtitle) titleWrap.createDiv({ cls: "vrpg-subtitle", text: subtitle });
        const body = card.createDiv({ cls: "vrpg-preview-body" });
        renderBody(body, card);
        if (options.openPanel) {
          const open = body.createEl("button", { cls: "vrpg-primary vrpg-preview-open", text: options.openLabel || "Open" });
          open.onclick = () => navigate({ tab: "home", homePanel: options.openPanel });
        }
        return card;
      };
      const renderTodayPreview = (widget) => {
        renderPreviewWidget(widget, "vrpg-preview-today", "Today", `${today.done}/${today.total} completed \xB7 ${today.xp} XP`, (body) => {
          const topLine = body.createDiv({ cls: "vrpg-preview-progress-line" });
          topLine.createDiv({ cls: "vrpg-card-title", text: `${today.done}/${today.total}` });
          topLine.createDiv({ cls: "vrpg-subtitle", text: today.done >= 3 ? "daily minimum met" : `${Math.min(today.done, 3)}/3 to minimum` });
          createProgressBar2(body, todayPercent, "vrpg-preview-progress");
          const list = body.createDiv({ cls: "vrpg-preview-task-list" });
          if (!habits.length) {
            list.createDiv({ cls: "vrpg-preview-empty", text: "No habits added for today" });
          } else {
            habits.slice(0, 3).forEach((habit) => {
              const done = !!(selectedDay.completed && selectedDay.completed[habit.id]);
              const button = list.createEl("button", {
                cls: done ? "vrpg-preview-task is-done" : "vrpg-preview-task"
              });
              button.createSpan({ text: `${habit.icon || "\u2022"} ${habit.title}` });
              button.createEl("strong", { text: done ? "\u2713" : `+${Number(habit.xp || 10)} XP` });
              button.onclick = () => toggleHabit(habit.id, selectedKey);
            });
          }
          if (habits.length > 3) {
            body.createDiv({ cls: "vrpg-subtitle", text: `${habits.length - 3} more habits in the Today section` });
          }
        }, { openPanel: "today", openLabel: "Open Today" });
      };
      const renderHeroProgressPreview = (widget) => {
        renderPreviewWidget(widget, "vrpg-preview-hero", "Hero Progress", `${heroTitle2(t.level)} \xB7 ${t.levelXP}/100 XP to level`, (body) => {
          body.createDiv({ cls: "vrpg-preview-level", text: `LEVEL ${t.level}` });
          createProgressBar2(body, t.levelXP, "vrpg-preview-progress");
          const statsGrid = body.createDiv({ cls: "vrpg-preview-stat-grid" });
          [
            ["Gold", `${t.gold}`],
            ["Streak", `${streak2(data)} days`],
            ["Week", `${strongDays}/7`]
          ].forEach(([label, value]) => {
            const item = statsGrid.createDiv({ cls: "vrpg-preview-stat" });
            item.createSpan({ text: label });
            item.createEl("strong", { text: value });
          });
        }, { openPanel: "hero", openLabel: "Open Hero" });
      };
      const renderQuestsPreview = (widget) => {
        renderPreviewWidget(widget, "vrpg-preview-quests", "Quests", `${Math.min(today.done, 3)}/3 to minimum`, (body) => {
          if (!habits.length) {
            body.createDiv({ cls: "vrpg-preview-empty", text: "No quests configured" });
            return;
          }
          const rows = [
            ["Daily Minimum", `${Math.min(today.done, 3)}/3`, today.done >= 3 ? "met" : "in progress"],
            ["Strong Week", `${strongDays}/7`, `best day ${bestDay.xp} XP`]
          ];
          rows.forEach(([label, value, note]) => {
            const row = body.createDiv({ cls: "vrpg-preview-row" });
            row.createDiv({ cls: "vrpg-card-title", text: value });
            const copy = row.createDiv();
            copy.createDiv({ cls: "vrpg-section", text: label });
            copy.createDiv({ cls: "vrpg-subtitle", text: note });
          });
        }, { openPanel: "quests", openLabel: "Open Quests" });
      };
      const renderRewardsPreview = (widget) => {
        const rewards = (data.rewards || []).slice().sort((a, b) => Number(a.cost || 0) - Number(b.cost || 0));
        const available = rewards.filter((reward) => t.gold >= Number(reward.cost || 0));
        const previewRewards = available.length ? available.slice(0, 2) : rewards.slice(0, 2);
        renderPreviewWidget(widget, "vrpg-preview-rewards", "Rewards", available.length ? `Available: ${available.length}` : nextRewardText, (body) => {
          if (!previewRewards.length) {
            body.createDiv({ cls: "vrpg-preview-empty", text: "No rewards added" });
            return;
          }
          previewRewards.forEach((reward) => {
            const row = body.createDiv({ cls: "vrpg-preview-row" });
            row.createDiv({ cls: "vrpg-card-title", text: `${reward.icon || "\u{1F381}"} ${reward.title}` });
            row.createDiv({ cls: "vrpg-subtitle", text: `${reward.cost} Gold` });
          });
        }, { openPanel: "rewards", openLabel: "Open Shop" });
      };
      const renderInventoryPreview = (widget) => {
        const items = (data.inventory || []).slice().reverse();
        const activeItems = items.filter((item) => !item.used);
        renderPreviewWidget(widget, "vrpg-preview-inventory", "Inventory", `${activeItems.length} active \xB7 ${items.length} total`, (body) => {
          if (!items.length) {
            body.createDiv({ cls: "vrpg-preview-empty", text: "Inventory empty" });
          } else {
            const loot = body.createDiv({ cls: "vrpg-preview-loot-row" });
            items.slice(0, 3).forEach((item) => {
              const chip = loot.createDiv({ cls: item.used ? "vrpg-preview-loot is-muted" : "vrpg-preview-loot" });
              chip.createDiv({ cls: "vrpg-card-title", text: item.icon || "\u{1F381}" });
              chip.createDiv({ cls: "vrpg-subtitle", text: item.title });
            });
          }
        }, { openPanel: "inventory", openLabel: "Open Inventory" });
      };
      const renderLogPreview = (widget) => {
        const log = Array.isArray(data.log) ? data.log : [];
        const recent = log.slice(-3).reverse();
        renderPreviewWidget(widget, "vrpg-preview-log", "Adventure Log", `${log.length} entries`, (body) => {
          if (!recent.length) {
            body.createDiv({ cls: "vrpg-preview-empty", text: "No entries yet" });
          } else {
            recent.forEach((entry) => {
              const row = body.createDiv({ cls: "vrpg-preview-row" });
              row.createDiv({ cls: "vrpg-card-title", text: entry.title || entry.type || "Event" });
              row.createDiv({ cls: "vrpg-subtitle", text: entry.type ? entry.type.replace(/-/g, " ") : "" });
            });
          }
        }, { openPanel: "log", openLabel: "Open Log" });
      };
      const renderModuleWidget = (widget) => {
        if (!widget || !isHomePanelWidget(widget.id)) return;
        renderHomeModuleScreen2(top, { ...ctx, homePanel: widget.id, prepareWidgetRoot }, widget);
      };
      if (isGridMode) {
        const mainColumn = top.createDiv({ cls: "vrpg-home-main" });
        const sideColumn = top.createDiv({ cls: "vrpg-home-side" });
        if (widgetById.has("command")) renderCommandWidget(widgetById.get("command"), mainColumn);
        if (activePanelWidget) renderHomeModuleScreen2(mainColumn, { ...ctx, homePanel: activePanelWidget.id, prepareWidgetRoot }, activePanelWidget);
        if (widgetById.has("clock")) renderClockWidget(widgetById.get("clock"), sideColumn);
        if (widgetById.has("calendar")) renderCalendarWidget(widgetById.get("calendar"), sideColumn);
        return;
      }
      for (const widget of layoutWidgets) {
        if (widget.id === "command") renderCommandWidget(widget);
        if (widget.id === "clock") renderClockWidget(widget);
        if (widget.id === "calendar") renderCalendarWidget(widget);
        if (activePanelWidget && widget.id === activePanelWidget.id) {
          renderHomeModuleScreen2(top, { ...ctx, homePanel: activePanelWidget.id, prepareWidgetRoot }, activePanelWidget);
        }
      }
    }
    function renderHomeModuleScreen2(parent, ctx = {}, widget = null) {
      const module3 = parent.createDiv({
        cls: widget ? getWidgetClass("vrpg-home-module", widget) : "vrpg-home-module",
        attr: widget ? getWidgetAttr(widget) : {}
      });
      if (widget && ctx.prepareWidgetRoot) ctx.prepareWidgetRoot(module3, widget);
      const body = module3.createDiv({ cls: "vrpg-module-body" });
      if (ctx.homePanel === "today") ctx.renderHomeToday(body);
      if (ctx.homePanel === "hero") ctx.renderHomeHero(body);
      if (ctx.homePanel === "quests") ctx.renderHomeQuests(body);
      if (ctx.homePanel === "rewards") ctx.renderHomeRewards(body);
      if (ctx.homePanel === "inventory") ctx.renderHomeInventory(body);
      if (ctx.homePanel === "log") ctx.renderHomeLog(body);
    }
    module2.exports = {
      renderHomeScreen: renderHomeScreen2,
      renderHomeModuleScreen: renderHomeModuleScreen2
    };
  }
});

// src/ui/screens/homeTodayScreen.js
var require_homeTodayScreen = __commonJS({
  "src/ui/screens/homeTodayScreen.js"(exports2, module2) {
    function renderHomeTodayScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const selectedDateKey = ctx.selectedDateKey;
      const dateKey2 = ctx.dateKey;
      const displayDateFromKey2 = ctx.displayDateFromKey;
      const getDay2 = ctx.getDay;
      const readDayStats2 = ctx.readDayStats;
      const activeHabits2 = ctx.activeHabits;
      const moods = ctx.moods || {};
      const setMood = ctx.setMood || (() => {
      });
      const toggleHabit = ctx.toggleHabit || (() => {
      });
      const key = selectedDateKey || dateKey2();
      const today = getDay2(data, key);
      const stats = readDayStats2(data, key, today);
      const dateFromKey2 = ctx.dateFromKey;
      const selectedDate = dateFromKey2 ? dateFromKey2(key) : /* @__PURE__ */ new Date();
      const habits = activeHabits2(data, selectedDate);
      const header = parent.createDiv({ cls: "vrpg-panel vrpg-day-focus vrpg-day-focus-compact" });
      const summary = header.createDiv({ cls: "vrpg-day-focus-summary" });
      const displayKey = displayDateFromKey2 ? displayDateFromKey2(key) : key;
      summary.createDiv({ cls: "vrpg-card-title", text: displayKey });
      summary.createDiv({ cls: "vrpg-subtitle", text: `${stats.done}/${stats.total} dailies \xB7 ${stats.xp} XP` });
      const bountyDone = stats.done >= 3;
      const bountyRow = header.createDiv({ cls: bountyDone ? "vrpg-bounty is-done" : "vrpg-bounty" });
      bountyRow.createSpan({ text: bountyDone ? "\u{1F3AF} Daily Bounty Complete!" : `\u{1F3AF} Daily Bounty: ${Math.min(stats.done, 3)}/3` });
      const mood = header.createDiv({ cls: "vrpg-mood-row" });
      mood.createDiv({ cls: "vrpg-section", text: "Mood / Energy" });
      const moodButtons = mood.createDiv({ cls: "vrpg-segmented" });
      Object.entries(moods).forEach(([id, label]) => {
        const button = moodButtons.createEl("button", { cls: today.mood === id ? "is-active" : "", text: label });
        button.onclick = () => setMood(id, key);
      });
      const list = parent.createDiv({ cls: "vrpg-card-grid vrpg-today-check-grid" });
      for (const habit of habits) {
        const done = !!today.completed[habit.id];
        const button = list.createEl("button", {
          cls: done ? "vrpg-check is-done" : "vrpg-check",
          text: `${habit.icon || "\u2022"} ${habit.title}`
        });
        button.onclick = () => toggleHabit(habit.id, key);
      }
      if (habits.length === 0) {
        list.createDiv({ cls: "vrpg-subtitle", text: "No dailies scheduled for today." });
      }
    }
    module2.exports = {
      renderHomeTodayScreen: renderHomeTodayScreen2
    };
  }
});

// src/ui/screens/homeHeroScreen.js
var require_homeHeroScreen = __commonJS({
  "src/ui/screens/homeHeroScreen.js"(exports2, module2) {
    function renderHomeHeroScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const totals2 = ctx.totals;
      const coreAttributes2 = ctx.coreAttributes;
      const streak2 = ctx.streak;
      const getHeroClassTitle2 = ctx.getHeroClassTitle;
      const heroTitle2 = ctx.heroTitle;
      const createProgressBar2 = ctx.createProgressBar;
      const renderRadar = ctx.renderRadar;
      const achievements2 = ctx.achievements;
      const t = totals2(data);
      const metrics = coreAttributes2(data);
      const wrap = parent.createDiv({ cls: "vrpg-hero-preview" });
      const info = wrap.createDiv({ cls: "vrpg-hero-summary" });
      info.createDiv({ cls: "vrpg-kicker", text: getHeroClassTitle2(data.player) });
      info.createDiv({ cls: "vrpg-level", text: `LEVEL ${t.level}` });
      info.createDiv({ cls: "vrpg-hero-title", text: heroTitle2(t.level) });
      info.createDiv({ cls: "vrpg-subtitle", text: `${t.gold} Gold \xB7 ${t.levelXP}/100 XP to next level` });
      createProgressBar2(info, t.levelXP, "vrpg-hero-xp");
      const battle = wrap.createDiv({ cls: "vrpg-hero-battle" });
      const radarPanel = battle.createDiv({ cls: "vrpg-hero-radar-panel" });
      renderRadar(radarPanel, metrics);
      const tracks = battle.createDiv({ cls: "vrpg-hero-tracks" });
      for (const [label, value] of metrics) {
        const track = tracks.createDiv({ cls: "vrpg-hero-track" });
        const row = track.createDiv({ cls: "vrpg-hero-track-top" });
        row.createSpan({ text: label });
        row.createEl("strong", { text: `${value}%` });
        track.createDiv({ cls: "vrpg-hero-track-bar" }).createDiv({
          cls: "vrpg-hero-track-fill",
          attr: { style: `width:${Math.max(0, Math.min(100, value))}%` }
        });
      }
      const currentStreak = streak2(data);
      const streakPanel = parent.createDiv({ cls: "vrpg-panel vrpg-streak" });
      streakPanel.createDiv({ cls: "vrpg-section", text: "\u{1F525} Streak" });
      streakPanel.createDiv({ cls: "vrpg-level", text: `${currentStreak} days` });
      if (currentStreak >= 7) {
        streakPanel.createDiv({ cls: "vrpg-subtitle", text: "Power streak! Keep it going!" });
      } else if (currentStreak >= 3) {
        streakPanel.createDiv({ cls: "vrpg-subtitle", text: "Building momentum!" });
      } else {
        streakPanel.createDiv({ cls: "vrpg-subtitle", text: "Complete 50%+ dailies to build your streak." });
      }
      const achPanel = parent.createDiv({ cls: "vrpg-panel vrpg-achievements" });
      achPanel.createDiv({ cls: "vrpg-section", text: "Achievements" });
      const achList = achievements2(data);
      const earned = achList.filter((a) => a.done);
      achPanel.createDiv({ cls: "vrpg-subtitle", text: `${earned.length}/${achList.length} unlocked` });
      for (const item of achList) {
        const row = achPanel.createDiv({ cls: item.done ? "vrpg-achievement is-done" : "vrpg-achievement" });
        row.createSpan({ text: item.icon || (item.done ? "\u2713" : "\u2022") });
        row.createEl("strong", { text: item.title });
      }
    }
    module2.exports = {
      renderHomeHeroScreen: renderHomeHeroScreen2
    };
  }
});

// src/systems/questSystem.js
var require_questSystem = __commonJS({
  "src/systems/questSystem.js"(exports2, module2) {
    var { uid } = require_utils();
    var { QUEST_XP_STANDARD, QUEST_XP_MAJOR } = require_constants();
    function activeQuests(data) {
      const quests = Array.isArray(data.quests) ? data.quests : [];
      return quests.filter((q) => !q.completed && !q.abandoned);
    }
    function completedQuests(data) {
      const quests = Array.isArray(data.quests) ? data.quests : [];
      return quests.filter((q) => q.completed);
    }
    function questXP(quest) {
      return quest.priority === "major" ? QUEST_XP_MAJOR : QUEST_XP_STANDARD;
    }
    function applyQuestAdd2(data, questInput) {
      if (!Array.isArray(data.quests)) data.quests = [];
      const quest = {
        id: uid("quest"),
        title: questInput.title,
        description: questInput.description || "",
        area: questInput.area || "craft",
        priority: questInput.priority || "standard",
        deadline: questInput.deadline || null,
        // ISO date string or null
        completed: false,
        completedDate: null,
        abandoned: false,
        createdDate: (/* @__PURE__ */ new Date()).toISOString()
      };
      data.quests.push(quest);
      if (!Array.isArray(data.log)) data.log = [];
      data.log.push({
        type: "quest-added",
        questId: quest.id,
        title: quest.title,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      return { data, quest };
    }
    function applyQuestComplete2(data, questId) {
      const quest = (data.quests || []).find((q) => q.id === questId);
      if (!quest || quest.completed) return { data, quest };
      quest.completed = true;
      quest.completedDate = (/* @__PURE__ */ new Date()).toISOString();
      if (!Array.isArray(data.log)) data.log = [];
      data.log.push({
        type: "quest-completed",
        questId: quest.id,
        title: quest.title,
        xp: questXP(quest),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      return { data, quest };
    }
    function applyQuestAbandon2(data, questId) {
      const quest = (data.quests || []).find((q) => q.id === questId);
      if (!quest || quest.completed || quest.abandoned) return { data, quest };
      quest.abandoned = true;
      if (!Array.isArray(data.log)) data.log = [];
      data.log.push({
        type: "quest-abandoned",
        questId: quest.id,
        title: quest.title,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      return { data, quest };
    }
    function applyQuestUpdate2(data, questId, patch) {
      const quest = (data.quests || []).find((q) => q.id === questId);
      if (!quest) return { data, quest };
      const allowed = ["title", "description", "area", "priority", "deadline"];
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(patch, key)) quest[key] = patch[key];
      }
      return { data, quest };
    }
    function applyQuestDelete2(data, questId) {
      if (!Array.isArray(data.quests)) return { data, questId };
      data.quests = data.quests.filter((q) => q.id !== questId);
      return { data, questId };
    }
    function sortedByDeadline(quests) {
      return [...quests].sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    }
    function isOverdue(quest) {
      if (!quest.deadline || quest.completed || quest.abandoned) return false;
      return new Date(quest.deadline) < /* @__PURE__ */ new Date();
    }
    module2.exports = {
      activeQuests,
      completedQuests,
      questXP,
      applyQuestAdd: applyQuestAdd2,
      applyQuestComplete: applyQuestComplete2,
      applyQuestAbandon: applyQuestAbandon2,
      applyQuestUpdate: applyQuestUpdate2,
      applyQuestDelete: applyQuestDelete2,
      sortedByDeadline,
      isOverdue
    };
  }
});

// src/ui/screens/homeQuestsScreen.js
var require_homeQuestsScreen = __commonJS({
  "src/ui/screens/homeQuestsScreen.js"(exports2, module2) {
    var { AREA_LABELS: AREA_LABELS2, QUEST_PRIORITIES } = require_constants();
    var { activeQuests, completedQuests, questXP, sortedByDeadline, isOverdue } = require_questSystem();
    function renderHomeQuestsScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const completeQuest = ctx.completeQuest || (() => {
      });
      const abandonQuest = ctx.abandonQuest || (() => {
      });
      const displayDate2 = ctx.displayDate;
      const active = sortedByDeadline(activeQuests(data));
      const done = completedQuests(data);
      const activePanel = parent.createDiv({ cls: "vrpg-panel" });
      activePanel.createDiv({ cls: "vrpg-section", text: "\u2694\uFE0F Active Quests" });
      if (active.length === 0) {
        activePanel.createDiv({ cls: "vrpg-subtitle", text: "No active quests. Add one in Settings \u2192 Quests." });
      }
      for (const quest of active) {
        const overdue = isOverdue(quest);
        const card = activePanel.createDiv({ cls: overdue ? "vrpg-quest-card is-overdue" : "vrpg-quest-card" });
        const header = card.createDiv({ cls: "vrpg-quest-header" });
        const priorityTag = quest.priority === "major" ? "\u2B50 MAJOR" : "STANDARD";
        header.createDiv({ cls: `vrpg-quest-priority vrpg-priority-${quest.priority}`, text: priorityTag });
        card.createDiv({ cls: "vrpg-card-title", text: quest.title });
        if (quest.description) {
          card.createDiv({ cls: "vrpg-subtitle", text: quest.description });
        }
        const meta = card.createDiv({ cls: "vrpg-quest-meta" });
        meta.createSpan({ text: `${AREA_LABELS2[quest.area] || quest.area}` });
        meta.createSpan({ text: ` \xB7 ${questXP(quest)} XP + Gold` });
        if (quest.deadline) {
          const deadlineDate = new Date(quest.deadline);
          const deadlineStr = displayDate2 ? displayDate2(deadlineDate) : quest.deadline;
          meta.createSpan({ cls: overdue ? "vrpg-overdue" : "", text: ` \xB7 Due: ${deadlineStr}` });
        }
        const actions = card.createDiv({ cls: "vrpg-quest-actions" });
        const doneBtn = actions.createEl("button", { cls: "vrpg-primary", text: "\u2713 Complete" });
        doneBtn.onclick = () => completeQuest(quest.id);
        const abandonBtn = actions.createEl("button", { cls: "vrpg-danger", text: "\u2717 Abandon" });
        abandonBtn.onclick = () => abandonQuest(quest.id);
      }
      if (done.length > 0) {
        const donePanel = parent.createDiv({ cls: "vrpg-panel" });
        donePanel.createDiv({ cls: "vrpg-section", text: "\u2705 Completed Quests" });
        const recentDone = done.slice(-5).reverse();
        for (const quest of recentDone) {
          const row = donePanel.createDiv({ cls: "vrpg-quest-done" });
          row.createSpan({ text: `${quest.title}` });
          row.createSpan({ cls: "vrpg-subtitle", text: ` \xB7 ${questXP(quest)} XP + Gold earned` });
        }
        if (done.length > 5) {
          donePanel.createDiv({ cls: "vrpg-subtitle", text: `...and ${done.length - 5} more` });
        }
      }
    }
    module2.exports = {
      renderHomeQuestsScreen: renderHomeQuestsScreen2
    };
  }
});

// src/ui/screens/rewardsScreen.js
var require_rewardsScreen = __commonJS({
  "src/ui/screens/rewardsScreen.js"(exports2, module2) {
    function renderHomeRewardsScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const t = ctx.totals || {};
      const rarities = ctx.rarities || {};
      const buyReward = ctx.buyReward || (() => {
      });
      const grid = parent.createDiv({ cls: "vrpg-card-grid" });
      for (const reward of data.rewards || []) {
        const card = grid.createDiv({ cls: "vrpg-panel" });
        card.createDiv({ cls: "vrpg-card-title", text: `${reward.icon || "\u{1F381}"} ${reward.title}` });
        card.createDiv({ cls: `vrpg-rarity vrpg-rarity-${reward.rarity || "common"}`, text: rarities[reward.rarity || "common"] || rarities.common });
        card.createDiv({ cls: "vrpg-subtitle", text: `${reward.cost} Gold` });
        const button = card.createEl("button", { cls: "vrpg-primary", text: t.gold >= reward.cost ? "Buy" : "Not enough Gold" });
        button.disabled = t.gold < reward.cost;
        button.onclick = () => buyReward(reward.id);
      }
    }
    module2.exports = {
      renderHomeRewardsScreen: renderHomeRewardsScreen2
    };
  }
});

// src/ui/screens/inventoryScreen.js
var require_inventoryScreen = __commonJS({
  "src/ui/screens/inventoryScreen.js"(exports2, module2) {
    function renderHomeInventoryScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const toggleInventoryItemUsed = ctx.toggleInventoryItemUsed || (() => {
      });
      const items = (data.inventory || []).slice().reverse();
      if (!items.length) {
        parent.createDiv({ cls: "vrpg-subtitle", text: "Inventory empty. Buy your first reward in the shop." });
        return;
      }
      const grid = parent.createDiv({ cls: "vrpg-card-grid" });
      for (const item of items) {
        const card = grid.createDiv({ cls: item.used ? "vrpg-panel is-muted" : "vrpg-panel" });
        card.createDiv({ cls: "vrpg-card-title", text: `${item.icon || "\u{1F381}"} ${item.title}` });
        card.createDiv({ cls: "vrpg-subtitle", text: `${item.cost} Gold \u2022 ${item.date}` });
        const button = card.createEl("button", { cls: "vrpg-primary", text: item.used ? "Return" : "Use" });
        button.onclick = () => toggleInventoryItemUsed(item.id);
      }
    }
    module2.exports = {
      renderHomeInventoryScreen: renderHomeInventoryScreen2
    };
  }
});

// src/ui/screens/homeLogScreen.js
var require_homeLogScreen = __commonJS({
  "src/ui/screens/homeLogScreen.js"(exports2, module2) {
    function renderHomeLogScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const displayDateFromKey2 = ctx.displayDateFromKey;
      const panel = parent.createDiv({ cls: "vrpg-panel" });
      panel.createDiv({ cls: "vrpg-section", text: "\u{1F4DC} Adventure Log" });
      const log = Array.isArray(data.log) ? data.log : [];
      if (log.length === 0) {
        panel.createDiv({ cls: "vrpg-subtitle", text: "No entries yet. Complete dailies and quests to fill your log." });
        return;
      }
      const entries = [...log].reverse().slice(0, 50);
      for (const entry of entries) {
        const row = panel.createDiv({ cls: "vrpg-log-entry" });
        const icon = logIcon(entry.type);
        const text = logText(entry);
        const time = entry.timestamp ? formatLogTime(entry.timestamp) : "";
        row.createSpan({ cls: "vrpg-log-icon", text: icon });
        row.createSpan({ cls: "vrpg-log-text", text });
        if (time) {
          row.createSpan({ cls: "vrpg-log-time", text: time });
        }
      }
    }
    function logIcon(type) {
      switch (type) {
        case "quest-completed":
          return "\u2694\uFE0F";
        case "quest-added":
          return "\u{1F4DC}";
        case "quest-abandoned":
          return "\u274C";
        case "reward-purchased":
          return "\u{1F6D2}";
        case "achievement-unlocked":
          return "\u{1F3C6}";
        case "level-up":
          return "\u2B06\uFE0F";
        default:
          return "\u2022";
      }
    }
    function logText(entry) {
      switch (entry.type) {
        case "quest-completed":
          return `Completed quest: ${entry.title} (+${entry.xp || 0} XP)`;
        case "quest-added":
          return `New quest accepted: ${entry.title}`;
        case "quest-abandoned":
          return `Abandoned quest: ${entry.title}`;
        case "reward-purchased":
          return `Purchased: ${entry.title} (-${entry.cost || 0} Gold)`;
        case "achievement-unlocked":
          return `Achievement unlocked: ${entry.title}`;
        case "level-up":
          return `Leveled up to ${entry.level}!`;
        default:
          return entry.title || entry.type || "Unknown event";
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
    module2.exports = {
      renderHomeLogScreen: renderHomeLogScreen2
    };
  }
});

// src/config/featureFlags.js
var require_featureFlags = __commonJS({
  "src/config/featureFlags.js"(exports2, module2) {
    var FEATURE_FLAGS = {
      showAchievements: false,
      showInterfaceSettings: true
    };
    module2.exports = {
      FEATURE_FLAGS
    };
  }
});

// src/ui/screens/settingsScreen.js
var require_settingsScreen = __commonJS({
  "src/ui/screens/settingsScreen.js"(exports2, module2) {
    var { FEATURE_FLAGS } = require_featureFlags();
    function renderSettingsScreen2(parent, ctx = {}) {
      const settingsPanel = !FEATURE_FLAGS.showInterfaceSettings && ctx.settingsPanel === "interface" ? "profile" : ctx.settingsPanel;
      const navigate = ctx.navigate;
      const shell = parent.createDiv({ cls: "vrpg-hero-card vrpg-settings-shell" });
      shell.createDiv({ cls: "vrpg-kicker", text: "Settings" });
      shell.createDiv({ cls: "vrpg-title", text: "System" });
      shell.createDiv({ cls: "vrpg-subtitle", text: "Customize hero, dailies, quests, and shop." });
      const nav = shell.createDiv({ cls: "vrpg-command-grid vrpg-settings-nav" });
      const panels = [
        ["profile", "Hero", "name, class, photo"],
        ["interface", "Interface", "home widgets"],
        ["habits", "Dailies", "daily actions"],
        ["quests", "Quests", "quest management"],
        ["rewards", "Rewards", "Gold shop"]
      ].filter(([id]) => FEATURE_FLAGS.showInterfaceSettings || id !== "interface");
      panels.forEach(([id, title, desc]) => {
        const button = nav.createEl("button", { cls: settingsPanel === id ? "vrpg-command-action is-active" : "vrpg-command-action" });
        button.createEl("strong", { text: title });
        button.createSpan({ text: desc });
        button.onclick = () => {
          navigate({ tab: "settings", settingsPanel: id });
        };
      });
      const body = shell.createDiv({ cls: "vrpg-home-module" });
      if (settingsPanel === "profile") ctx.renderSettingsProfile(body);
      if (settingsPanel === "interface") ctx.renderSettingsInterface(body);
      if (settingsPanel === "habits") ctx.renderSettingsHabits(body);
      if (settingsPanel === "quests") ctx.renderSettingsQuests(body);
      if (settingsPanel === "rewards") ctx.renderSettingsRewards(body);
    }
    module2.exports = {
      renderSettingsScreen: renderSettingsScreen2
    };
  }
});

// src/ui/screens/settingsProfileScreen.js
var require_settingsProfileScreen = __commonJS({
  "src/ui/screens/settingsProfileScreen.js"(exports2, module2) {
    var {
      HERO_CLASSES,
      getHeroClassDescription,
      getHeroClassTitle: getHeroClassTitle2,
      resolveHeroClassId: resolveHeroClassId2
    } = require_heroClassesConfig();
    function renderSettingsProfileScreen2(parent, ctx = {}) {
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
      profileCopy.createDiv({ cls: "vrpg-subtitle", text: getHeroClassTitle2(player) });
      const heroName = profilePanel.createEl("input", {
        type: "text",
        placeholder: "Hero Name",
        value: player.name || ""
      });
      const heroClassId = resolveHeroClassId2(player);
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
    module2.exports = {
      renderSettingsProfileScreen: renderSettingsProfileScreen2
    };
  }
});

// src/ui/screens/settingsInterfaceScreen.js
var require_settingsInterfaceScreen = __commonJS({
  "src/ui/screens/settingsInterfaceScreen.js"(exports2, module2) {
    var { normalizeInterfaceLayout: normalizeInterfaceLayout2 } = require_layoutConfig();
    var { getInterfaceLayout } = require_layoutSystem();
    var APP_SIZE_LABELS = {
      compact: "Compact",
      comfortable: "Comfortable",
      expanded: "Expanded"
    };
    function renderSettingsInterfaceScreen2(parent, ctx = {}) {
      const settings = ctx.settings || {};
      const updateInterfaceLayout = ctx.updateInterfaceLayout || (() => {
      });
      const interfaceLayout = getInterfaceLayout(settings);
      const panel = parent.createDiv({ cls: "vrpg-panel vrpg-interface-panel" });
      panel.createDiv({ cls: "vrpg-section", text: "Interface" });
      const presetPanel = panel.createDiv({ cls: "vrpg-interface-presets" });
      const presetMeta = presetPanel.createDiv({ cls: "vrpg-interface-row-meta" });
      presetMeta.createDiv({ cls: "vrpg-card-title", text: "Panel Size" });
      presetMeta.createDiv({ cls: "vrpg-subtitle", text: "Width of Life RPG workspace" });
      const presetControl = presetPanel.createDiv({ cls: "vrpg-size-control vrpg-app-size-control" });
      Object.entries(APP_SIZE_LABELS).forEach(([value, label]) => {
        const button = presetControl.createEl("button", {
          cls: interfaceLayout.appSize === value ? "vrpg-size-option is-active" : "vrpg-size-option",
          text: label
        });
        button.onclick = () => updateInterfaceLayout(normalizeInterfaceLayout2({
          ...interfaceLayout,
          appSize: value
        }));
      });
    }
    module2.exports = {
      renderSettingsInterfaceScreen: renderSettingsInterfaceScreen2
    };
  }
});

// src/ui/screens/settingsResourcesScreen.js
var require_settingsResourcesScreen = __commonJS({
  "src/ui/screens/settingsResourcesScreen.js"(exports2, module2) {
    function renderSettingsResourcesScreen2(parent, ctx = {}) {
    }
    module2.exports = {
      renderSettingsResourcesScreen: renderSettingsResourcesScreen2
    };
  }
});

// src/ui/screens/settingsRewardsScreen.js
var require_settingsRewardsScreen = __commonJS({
  "src/ui/screens/settingsRewardsScreen.js"(exports2, module2) {
    function renderSettingsRewardsScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const rarities = ctx.rarities || {};
      const addReward = ctx.addReward;
      const deleteReward = ctx.deleteReward;
      const confirm2 = ctx.confirm;
      const rewardPanel = parent.createDiv({ cls: "vrpg-panel" });
      rewardPanel.createDiv({ cls: "vrpg-section", text: "Add Reward" });
      const rewardTitle = rewardPanel.createEl("input", { type: "text", placeholder: "e.g. movie, massage, dinner out" });
      const rewardCost = rewardPanel.createEl("input", { type: "number", placeholder: "Cost in Gold, e.g. 150" });
      const rewardRarity = rewardPanel.createEl("select");
      Object.entries(rarities).forEach(([value, label]) => {
        rewardRarity.createEl("option", { text: label, value });
      });
      const rewardButton = rewardPanel.createEl("button", { cls: "vrpg-primary", text: "Add Reward" });
      rewardButton.onclick = () => {
        addReward(rewardTitle.value, rewardCost.value, rewardRarity.value);
        rewardTitle.value = "";
        rewardCost.value = "";
      };
      const rewardList = parent.createDiv({ cls: "vrpg-panel" });
      rewardList.createDiv({ cls: "vrpg-section", text: "My Rewards" });
      for (const reward of data.rewards) {
        const row = rewardList.createDiv({ cls: "vrpg-setting-row" });
        row.createDiv({ cls: "vrpg-card-title", text: `${reward.icon || "\u{1F381}"} ${reward.title}` });
        row.createDiv({ cls: "vrpg-subtitle", text: `${reward.cost} Gold \xB7 ${rarities[reward.rarity || "common"] || rarities.common}` });
        const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
        remove.onclick = () => {
          if (confirm2(`Delete reward "${reward.title}" from the shop? Already purchased items in inventory will remain.`)) {
            deleteReward(reward.id);
          }
        };
      }
    }
    module2.exports = {
      renderSettingsRewardsScreen: renderSettingsRewardsScreen2
    };
  }
});

// src/ui/screens/settingsHabitsScreen.js
var require_settingsHabitsScreen = __commonJS({
  "src/ui/screens/settingsHabitsScreen.js"(exports2, module2) {
    var { DAYS_OF_WEEK, ALL_DAYS } = require_constants();
    function renderSettingsHabitsScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const habitIcons = ctx.habitIcons || [];
      const areaLabels = ctx.areaLabels || {};
      const addHabit = ctx.addHabit;
      const setHabitEnabled = ctx.setHabitEnabled;
      const updateHabit = ctx.updateHabit;
      const deleteHabit = ctx.deleteHabit;
      const confirm2 = ctx.confirm;
      const areas = [["body", "Body"], ["mind", "Mind"], ["spirit", "Spirit"], ["craft", "Craft"], ["hearth", "Hearth"]];
      const panel = parent.createDiv({ cls: "vrpg-panel" });
      panel.createDiv({ cls: "vrpg-section", text: "Add Daily" });
      const input = panel.createEl("input", { type: "text", placeholder: "e.g. swimming, English, journaling" });
      const icon = panel.createEl("input", { type: "text", placeholder: "Icon, e.g. \u{1F3C3}" });
      const iconPicker = panel.createDiv({ cls: "vrpg-icon-picker" });
      habitIcons.forEach((value) => {
        const pick = iconPicker.createEl("button", { text: value });
        pick.onclick = () => {
          icon.value = value;
        };
      });
      const select = panel.createEl("select");
      areas.forEach(([value, label]) => {
        select.createEl("option", { text: label, value });
      });
      panel.createDiv({ cls: "vrpg-subtitle", text: "Schedule (leave unchecked for every day)" });
      const daysRow = panel.createDiv({ cls: "vrpg-days-picker" });
      const dayCheckboxes = {};
      ALL_DAYS.forEach((dayKey) => {
        const label = daysRow.createEl("label", { cls: "vrpg-day-check" });
        const cb = label.createEl("input", { type: "checkbox" });
        cb.value = dayKey;
        label.createSpan({ text: DAYS_OF_WEEK[dayKey] });
        dayCheckboxes[dayKey] = cb;
      });
      const button = panel.createEl("button", { cls: "vrpg-primary", text: "Add" });
      button.onclick = () => {
        const selectedDays = ALL_DAYS.filter((d) => dayCheckboxes[d].checked);
        addHabit(input.value, select.value, icon.value || "\u2728", selectedDays.length > 0 ? selectedDays : null);
        input.value = "";
        icon.value = "";
        ALL_DAYS.forEach((d) => {
          dayCheckboxes[d].checked = false;
        });
      };
      const list = parent.createDiv({ cls: "vrpg-panel" });
      list.createDiv({ cls: "vrpg-section", text: "My Dailies" });
      for (const habit of data.habits) {
        const row = list.createDiv({ cls: "vrpg-setting-row" });
        row.createDiv({ cls: "vrpg-card-title", text: `${habit.icon || "\u2022"} ${habit.title}` });
        const daysText = habit.days && Array.isArray(habit.days) && habit.days.length > 0 ? habit.days.map((d) => DAYS_OF_WEEK[d] || d).join(", ") : "Every day";
        row.createDiv({ cls: "vrpg-subtitle", text: `${areaLabels[habit.area] || habit.area} \xB7 10 XP \xB7 ${daysText}` });
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
          iconInput.value = habit.icon || "\u2728";
          const areaSelect = editForm.createEl("select");
          areas.forEach(([value, label]) => {
            areaSelect.createEl("option", { text: label, value });
          });
          areaSelect.value = habit.area || "body";
          editForm.createDiv({ cls: "vrpg-subtitle", text: "Schedule (leave unchecked for every day)" });
          const editDaysRow = editForm.createDiv({ cls: "vrpg-days-picker" });
          const editDayCbs = {};
          ALL_DAYS.forEach((dayKey) => {
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
            const editSelectedDays = ALL_DAYS.filter((d) => editDayCbs[d].checked);
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
          if (confirm2(`Delete daily "${habit.title}"? Its history will also be removed from calculations.`)) {
            deleteHabit(habit.id);
          }
        };
      }
    }
    module2.exports = {
      renderSettingsHabitsScreen: renderSettingsHabitsScreen2
    };
  }
});

// src/ui/screens/settingsQuestsScreen.js
var require_settingsQuestsScreen = __commonJS({
  "src/ui/screens/settingsQuestsScreen.js"(exports2, module2) {
    var { AREA_LABELS: AREA_LABELS2, QUEST_PRIORITIES } = require_constants();
    function renderSettingsQuestsScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const addQuest = ctx.addQuest || (() => {
      });
      const updateQuest = ctx.updateQuest || (() => {
      });
      const deleteQuest = ctx.deleteQuest || (() => {
      });
      const confirm2 = ctx.confirm;
      const areas = Object.entries(AREA_LABELS2);
      const priorities = Object.entries(QUEST_PRIORITIES);
      const addPanel = parent.createDiv({ cls: "vrpg-panel" });
      addPanel.createDiv({ cls: "vrpg-section", text: "Add Quest" });
      const titleInput = addPanel.createEl("input", { type: "text", placeholder: "Quest title, e.g. Complete WGU course" });
      addPanel.createDiv({ cls: "vrpg-subtitle", text: "Description (optional)" });
      const descInput = addPanel.createEl("input", { type: "text", placeholder: "Details about the quest" });
      const selectRow = addPanel.createDiv({ cls: "vrpg-quest-selects" });
      const areaSelect = selectRow.createEl("select");
      areas.forEach(([value, label]) => {
        areaSelect.createEl("option", { text: label, value });
      });
      const prioritySelect = selectRow.createEl("select");
      priorities.forEach(([value, label]) => {
        const xp = value === "major" ? "100" : "50";
        prioritySelect.createEl("option", { text: `${label} (${xp} XP)`, value });
      });
      addPanel.createDiv({ cls: "vrpg-subtitle", text: "Deadline (optional)" });
      const deadlineInput = addPanel.createEl("input", { type: "date" });
      const addBtn = addPanel.createEl("button", { cls: "vrpg-primary", text: "Add Quest" });
      addBtn.onclick = () => {
        if (!titleInput.value.trim()) return;
        addQuest({
          title: titleInput.value.trim(),
          description: descInput.value.trim(),
          area: areaSelect.value,
          priority: prioritySelect.value,
          deadline: deadlineInput.value || null
        });
        titleInput.value = "";
        descInput.value = "";
        deadlineInput.value = "";
      };
      const quests = Array.isArray(data.quests) ? data.quests : [];
      const active = quests.filter((q) => !q.completed && !q.abandoned);
      const completed = quests.filter((q) => q.completed);
      const abandoned = quests.filter((q) => q.abandoned);
      if (active.length > 0) {
        const listPanel = parent.createDiv({ cls: "vrpg-panel" });
        listPanel.createDiv({ cls: "vrpg-section", text: "Active Quests" });
        for (const quest of active) {
          renderQuestRow(listPanel, quest, { areas, priorities, updateQuest, deleteQuest, confirm: confirm2 });
        }
      }
      if (completed.length > 0) {
        const donePanel = parent.createDiv({ cls: "vrpg-panel" });
        donePanel.createDiv({ cls: "vrpg-section", text: "Completed Quests" });
        for (const quest of completed.slice(-10).reverse()) {
          const row = donePanel.createDiv({ cls: "vrpg-setting-row" });
          row.createDiv({ cls: "vrpg-card-title", text: `\u2705 ${quest.title}` });
          row.createDiv({ cls: "vrpg-subtitle", text: `${AREA_LABELS2[quest.area] || quest.area} \xB7 ${quest.priority === "major" ? "Major" : "Standard"}` });
          const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
          remove.onclick = () => {
            if (confirm2(`Remove completed quest "${quest.title}" from history?`)) {
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
          row.createDiv({ cls: "vrpg-card-title", text: `\u274C ${quest.title}` });
          const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
          remove.onclick = () => deleteQuest(quest.id);
        }
      }
    }
    function renderQuestRow(parent, quest, opts) {
      const { areas, priorities, updateQuest, deleteQuest, confirm: confirm2 } = opts;
      const row = parent.createDiv({ cls: "vrpg-setting-row" });
      row.createDiv({ cls: "vrpg-card-title", text: quest.title });
      const priorityLabel = quest.priority === "major" ? "\u2B50 Major" : "Standard";
      const deadlineText = quest.deadline ? ` \xB7 Due: ${quest.deadline}` : "";
      row.createDiv({ cls: "vrpg-subtitle", text: `${AREA_LABELS2[quest.area] || quest.area} \xB7 ${priorityLabel}${deadlineText}` });
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
        titleInput.value = quest.title || "";
        const descInput = editForm.createEl("input", { type: "text", placeholder: "Description" });
        descInput.value = quest.description || "";
        const areaSelect = editForm.createEl("select");
        areas.forEach(([value, label]) => {
          areaSelect.createEl("option", { text: label, value });
        });
        areaSelect.value = quest.area || "craft";
        const prioritySelect = editForm.createEl("select");
        priorities.forEach(([value, label]) => {
          prioritySelect.createEl("option", { text: label, value });
        });
        prioritySelect.value = quest.priority || "standard";
        editForm.createDiv({ cls: "vrpg-subtitle", text: "Deadline" });
        const deadlineInput = editForm.createEl("input", { type: "date" });
        deadlineInput.value = quest.deadline || "";
        const save = editForm.createEl("button", { cls: "vrpg-primary", text: "Save" });
        save.onclick = () => updateQuest(quest.id, {
          title: titleInput.value,
          description: descInput.value,
          area: areaSelect.value,
          priority: prioritySelect.value,
          deadline: deadlineInput.value || null
        });
        const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "Cancel" });
        cancel.onclick = () => {
          editForm.remove();
          editForm = null;
        };
      };
      const remove = row.createEl("button", { cls: "vrpg-danger", text: "Delete" });
      remove.onclick = () => {
        if (confirm2(`Delete quest "${quest.title}"?`)) {
          deleteQuest(quest.id);
        }
      };
    }
    module2.exports = {
      renderSettingsQuestsScreen: renderSettingsQuestsScreen2
    };
  }
});

// src/systems/habitSystem.js
var require_habitSystem = __commonJS({
  "src/systems/habitSystem.js"(exports2, module2) {
    var { dateKey: dateKey2, uid } = require_utils();
    var { getDay: getDay2 } = require_storage();
    var { DAILY_XP, ALL_DAYS } = require_constants();
    function activeHabits2(data, forDate) {
      const habits = data.habits.filter((habit) => habit.enabled !== false);
      if (!forDate) return habits;
      const dayIndex = forDate.getDay();
      const dayKey = ALL_DAYS[dayIndex];
      return habits.filter((habit) => {
        if (!habit.days || !Array.isArray(habit.days) || habit.days.length === 0) return true;
        return habit.days.includes(dayKey);
      });
    }
    function dayStats2(data, key = dateKey2()) {
      const day = getDay2(data, key);
      return readDayStats2(data, key, day);
    }
    function readDayStats2(data, key = dateKey2(), day = data.days[key]) {
      const habits = activeHabits2(data);
      let done = 0;
      let xp = 0;
      const areaDone = { body: 0, mind: 0, spirit: 0, craft: 0, hearth: 0 };
      const areaTotal = { body: 0, mind: 0, spirit: 0, craft: 0, hearth: 0 };
      for (const habit of habits) {
        if (areaTotal[habit.area] !== void 0) areaTotal[habit.area]++;
        if (!day || !day.completed || !day.completed[habit.id]) continue;
        done++;
        xp += DAILY_XP;
        if (areaDone[habit.area] !== void 0) areaDone[habit.area]++;
      }
      const total = habits.length;
      return {
        key,
        done,
        total,
        xp,
        percent: total ? Math.round(done / total * 100) : 0,
        areaDone,
        areaTotal
      };
    }
    function sortedDayKeys2(data) {
      return Object.keys(data.days || {}).sort((a, b) => {
        const pa = a.split(".").reverse().join("-");
        const pb = b.split(".").reverse().join("-");
        return pa.localeCompare(pb);
      });
    }
    function streak2(data) {
      let value = 0;
      const keys = sortedDayKeys2(data);
      for (let i = keys.length - 1; i >= 0; i--) {
        const stats = dayStats2(data, keys[i]);
        if (stats.percent < 50) break;
        value++;
      }
      return value;
    }
    function skillStats2(data) {
      const keys = sortedDayKeys2(data);
      const result = {
        body: { done: 0, total: 0 },
        mind: { done: 0, total: 0 },
        spirit: { done: 0, total: 0 },
        craft: { done: 0, total: 0 },
        hearth: { done: 0, total: 0 }
      };
      for (const key of keys) {
        const stats = dayStats2(data, key);
        for (const area of Object.keys(result)) {
          if (stats.areaTotal[area] > 0) result[area].total++;
          if (stats.areaDone[area] > 0) result[area].done++;
        }
      }
      return result;
    }
    function applyHabitToggle2(data, key, habitId) {
      const day = getDay2(data, key);
      day.completed[habitId] = !day.completed[habitId];
      return { data, key, day, habitId, completed: day.completed[habitId] };
    }
    function applyHabitAdd2(data, habitInput) {
      const habit = {
        id: uid("habit"),
        title: habitInput.title,
        area: habitInput.area,
        icon: String(habitInput.icon || "\u2728").trim() || "\u2728",
        xp: DAILY_XP,
        enabled: true,
        days: habitInput.days || null
      };
      data.habits.push(habit);
      return { data, habit };
    }
    function applyHabitUpdate2(data, habitId, patch) {
      const habit = data.habits.find((item) => item.id === habitId);
      if (!habit) return { data, habit };
      const allowed = ["title", "area", "icon", "enabled", "days"];
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(patch, key)) habit[key] = patch[key];
      }
      habit.xp = DAILY_XP;
      return { data, habit };
    }
    function applyHabitDelete2(data, habitId) {
      data.habits = data.habits.filter((habit) => habit.id !== habitId);
      for (const day of Object.values(data.days)) {
        if (day && day.completed) delete day.completed[habitId];
      }
      return { data, habitId };
    }
    module2.exports = {
      activeHabits: activeHabits2,
      dayStats: dayStats2,
      readDayStats: readDayStats2,
      sortedDayKeys: sortedDayKeys2,
      streak: streak2,
      skillStats: skillStats2,
      applyHabitToggle: applyHabitToggle2,
      applyHabitAdd: applyHabitAdd2,
      applyHabitUpdate: applyHabitUpdate2,
      applyHabitDelete: applyHabitDelete2
    };
  }
});

// src/systems/xpSystem.js
var require_xpSystem = __commonJS({
  "src/systems/xpSystem.js"(exports2, module2) {
    var { DAILY_XP, QUEST_XP_STANDARD, QUEST_XP_MAJOR } = require_constants();
    function heroTitle2(level) {
      if (level >= 50) return "Legend";
      if (level >= 30) return "Champion";
      if (level >= 20) return "Rhythm Master";
      if (level >= 10) return "Strategist";
      if (level >= 5) return "Seeker";
      return "Novice";
    }
    function totals2(data) {
      let earned = 0;
      for (const [key, day] of Object.entries(data.days)) {
        if (!day || !day.completed) continue;
        for (const habit of data.habits) {
          if (habit.enabled !== false && day.completed[habit.id]) {
            earned += DAILY_XP;
          }
        }
      }
      const quests = Array.isArray(data.quests) ? data.quests : [];
      for (const quest of quests) {
        if (quest.completed) {
          earned += quest.priority === "major" ? QUEST_XP_MAJOR : QUEST_XP_STANDARD;
        }
      }
      let spent = 0;
      for (const item of data.inventory) spent += Number(item.cost || 0);
      const goldEarned = earned;
      const goldBalance = Math.max(0, goldEarned - spent);
      return {
        earned,
        // Lifetime XP — never decreases
        spent,
        // Total gold spent
        balance: goldBalance,
        // Current gold available
        level: Math.floor(earned / 100) + 1,
        levelXP: earned % 100,
        gold: goldBalance,
        goldEarned
      };
    }
    module2.exports = {
      heroTitle: heroTitle2,
      totals: totals2
    };
  }
});

// src/systems/achievementSystem.js
var require_achievementSystem = __commonJS({
  "src/systems/achievementSystem.js"(exports2, module2) {
    var {
      dayStats: dayStats2,
      skillStats: skillStats2,
      sortedDayKeys: sortedDayKeys2,
      streak: streak2
    } = require_habitSystem();
    var { totals: totals2 } = require_xpSystem();
    function coreAttributes2(data) {
      const stats = skillStats2(data);
      return [
        ["Body", stats.body.total ? Math.round(stats.body.done / stats.body.total * 100) : 0],
        ["Mind", stats.mind.total ? Math.round(stats.mind.done / stats.mind.total * 100) : 0],
        ["Spirit", stats.spirit.total ? Math.round(stats.spirit.done / stats.spirit.total * 100) : 0],
        ["Craft", stats.craft.total ? Math.round(stats.craft.done / stats.craft.total * 100) : 0],
        ["Hearth", stats.hearth.total ? Math.round(stats.hearth.done / stats.hearth.total * 100) : 0]
      ];
    }
    function achievements2(data) {
      const t = totals2(data);
      const keys = sortedDayKeys2(data);
      const currentStreak = streak2(data);
      const hasCompleteDay = keys.some((key) => {
        const stats = dayStats2(data, key);
        return stats.total > 0 && stats.done === stats.total;
      });
      const bought = (data.inventory || []).length > 0;
      const questsDone = (data.quests || []).filter((q) => q.completed).length;
      const dailyBountyDays = keys.filter((key) => {
        const stats = dayStats2(data, key);
        return stats.done >= 3;
      }).length;
      return [
        { id: "first-day", title: "First Day Complete", done: hasCompleteDay, icon: "\u2694\uFE0F" },
        { id: "three-streak", title: "3-Day Streak", done: currentStreak >= 3, icon: "\u{1F525}" },
        { id: "week", title: "Week Without Fail", done: currentStreak >= 7, icon: "\u{1F3C6}" },
        { id: "two-weeks", title: "Fortnight Fighter", done: currentStreak >= 14, icon: "\u26A1" },
        { id: "month", title: "Monthly Master", done: currentStreak >= 30, icon: "\u{1F451}" },
        { id: "xp100", title: "100 XP Earned", done: t.earned >= 100, icon: "\u2728" },
        { id: "xp500", title: "500 XP Earned", done: t.earned >= 500, icon: "\u{1F48E}" },
        { id: "xp1000", title: "1000 XP Earned", done: t.earned >= 1e3, icon: "\u{1F31F}" },
        { id: "first-buy", title: "First Purchase", done: bought, icon: "\u{1F6D2}" },
        { id: "first-quest", title: "First Quest Complete", done: questsDone >= 1, icon: "\u{1F4DC}" },
        { id: "five-quests", title: "Questmaster", done: questsDone >= 5, icon: "\u{1F5E1}\uFE0F" },
        { id: "bounty-hunter", title: "Daily Bounty x10", done: dailyBountyDays >= 10, icon: "\u{1F3AF}" },
        { id: "level5", title: "Level 5 Reached", done: t.level >= 5, icon: "\u{1F6E1}\uFE0F" },
        { id: "level10", title: "Level 10 Reached", done: t.level >= 10, icon: "\u2B50" },
        { id: "level20", title: "Level 20 Reached", done: t.level >= 20, icon: "\u{1F531}" }
      ];
    }
    module2.exports = {
      coreAttributes: coreAttributes2,
      achievements: achievements2
    };
  }
});

// src/systems/daySystem.js
var require_daySystem = __commonJS({
  "src/systems/daySystem.js"(exports2, module2) {
    var { dateKey: dateKey2 } = require_utils();
    var { getDay: getDay2 } = require_storage();
    function applyWaterChange(data, selectedDate, delta) {
      const key = selectedDate || dateKey2();
      const day = getDay2(data, key);
      const goal = Math.max(1, Number(data.settings.waterGoal) || 8);
      day.water = Math.max(0, Math.min(goal + 4, Number(day.water || 0) + delta));
      return { data, key, day };
    }
    function applyMoodChange2(data, selectedDate, mood) {
      const key = selectedDate || dateKey2();
      const day = getDay2(data, key);
      day.mood = mood;
      return { data, key, day };
    }
    module2.exports = {
      applyWaterChange,
      applyMoodChange: applyMoodChange2
    };
  }
});

// src/systems/inventorySystem.js
var require_inventorySystem = __commonJS({
  "src/systems/inventorySystem.js"(exports2, module2) {
    function applyInventoryToggleUsed2(data, itemId) {
      const item = data.inventory.find((entry) => entry.id === itemId);
      if (!item) return { ok: false, data, item, reason: "not-found" };
      item.used = !item.used;
      return { ok: true, data, item, reason: void 0 };
    }
    module2.exports = {
      applyInventoryToggleUsed: applyInventoryToggleUsed2
    };
  }
});

// src/systems/rewardSystem.js
var require_rewardSystem = __commonJS({
  "src/systems/rewardSystem.js"(exports2, module2) {
    var { RARITIES: RARITIES2 } = require_constants();
    var { dateKey: dateKey2, uid } = require_utils();
    var { totals: totals2 } = require_xpSystem();
    function applyRewardPurchase2(data, rewardId) {
      const reward = data.rewards.find((item2) => item2.id === rewardId);
      if (!reward) return { ok: false, data, reward, item: void 0, reason: "not-found" };
      const t = totals2(data);
      if (t.balance < reward.cost) {
        return { ok: false, data, reward, item: void 0, reason: "not-enough-xp" };
      }
      const item = {
        id: uid("item"),
        rewardId,
        title: reward.title,
        cost: reward.cost,
        icon: reward.icon,
        date: dateKey2(),
        used: false
      };
      data.inventory.push(item);
      return { ok: true, data, reward, item, reason: void 0 };
    }
    function applyRewardAdd2(data, rewardInput) {
      const reward = {
        id: uid("reward"),
        title: rewardInput.title,
        cost: rewardInput.cost,
        icon: "\u{1F381}",
        rarity: RARITIES2[rewardInput.rarity] ? rewardInput.rarity : "common"
      };
      data.rewards.push(reward);
      return { data, reward };
    }
    function applyRewardDelete2(data, rewardId) {
      data.rewards = data.rewards.filter((reward) => reward.id !== rewardId);
      return { data, rewardId };
    }
    module2.exports = {
      applyRewardPurchase: applyRewardPurchase2,
      applyRewardAdd: applyRewardAdd2,
      applyRewardDelete: applyRewardDelete2
    };
  }
});

// src/systems/playerSystem.js
var require_playerSystem = __commonJS({
  "src/systems/playerSystem.js"(exports2, module2) {
    var { getHeroClass, resolveHeroClassId: resolveHeroClassId2 } = require_heroClassesConfig();
    function applyPlayerUpdate2(data, patch) {
      const allowed = ["name", "goal", "avatarUrl"];
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(patch, key)) data.player[key] = patch[key];
      }
      if (Object.prototype.hasOwnProperty.call(patch, "classId") || Object.prototype.hasOwnProperty.call(patch, "className")) {
        const classId = resolveHeroClassId2({
          classId: patch.classId,
          className: patch.className || data.player.className
        });
        data.player.classId = classId;
        data.player.className = getHeroClass(classId).title;
      }
      return { data, player: data.player };
    }
    function applySettingsUpdate2(data, patch) {
      const allowed = ["waterGoal", "waterGlassMl", "questStatsCards"];
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(patch, key)) data.settings[key] = patch[key];
      }
      return { data, settings: data.settings };
    }
    module2.exports = {
      applyPlayerUpdate: applyPlayerUpdate2,
      applySettingsUpdate: applySettingsUpdate2
    };
  }
});

// src/config/textConfig.js
var require_textConfig = __commonJS({
  "src/config/textConfig.js"(exports2, module2) {
    var TEXT2 = {
      dayPanel: "Day Panel"
    };
    module2.exports = {
      TEXT: TEXT2
    };
  }
});

// src/main-entry.js
var { ItemView, Notice, Plugin } = require("obsidian");
var {
  APP_VIEW,
  SIDEBAR_VIEW,
  AREA_LABELS,
  MOODS,
  RARITIES,
  HABIT_ICONS
} = require_constants();
var {
  dateKey,
  displayDate,
  displayDateFromKey,
  timeParts,
  dayPhase,
  monthLabel,
  dateFromKey,
  calendarDays
} = require_utils();
var { mergeData, getDay } = require_storage();
var { createProgressBar } = require_progressBar();
var { createStatCard } = require_statCard();
var { renderRadarChart } = require_radarChart();
var { renderHomeScreen, renderHomeModuleScreen } = require_homeScreen();
var { renderHomeTodayScreen } = require_homeTodayScreen();
var { renderHomeHeroScreen } = require_homeHeroScreen();
var { renderHomeQuestsScreen } = require_homeQuestsScreen();
var { renderHomeRewardsScreen } = require_rewardsScreen();
var { renderHomeInventoryScreen } = require_inventoryScreen();
var { renderHomeLogScreen } = require_homeLogScreen();
var { renderSettingsScreen } = require_settingsScreen();
var { renderSettingsProfileScreen } = require_settingsProfileScreen();
var { renderSettingsInterfaceScreen } = require_settingsInterfaceScreen();
var { renderSettingsResourcesScreen } = require_settingsResourcesScreen();
var { renderSettingsRewardsScreen } = require_settingsRewardsScreen();
var { renderSettingsHabitsScreen } = require_settingsHabitsScreen();
var { renderSettingsQuestsScreen } = require_settingsQuestsScreen();
var {
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
} = require_habitSystem();
var { coreAttributes, achievements } = require_achievementSystem();
var { applyMoodChange } = require_daySystem();
var { applyInventoryToggleUsed } = require_inventorySystem();
var {
  applyRewardAdd,
  applyRewardDelete,
  applyRewardPurchase
} = require_rewardSystem();
var { applyPlayerUpdate, applySettingsUpdate } = require_playerSystem();
var {
  applyQuestAdd,
  applyQuestComplete,
  applyQuestAbandon,
  applyQuestUpdate,
  applyQuestDelete
} = require_questSystem();
var { heroTitle, totals } = require_xpSystem();
var { TEXT } = require_textConfig();
var {
  normalizeHomeLayout,
  normalizeInterfaceLayout
} = require_layoutConfig();
var {
  getThemeClasses,
  getThemeClassList
} = require_themeConfig();
var { getAppSizePreset } = require_layoutSystem();
var {
  getHeroClassTitle,
  resolveHeroClassId
} = require_heroClassesConfig();
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
var VibeRpgPlugin = class extends Plugin {
  async onload() {
    this.data = mergeData(await this.loadData());
    await this.save();
    this.registerView(APP_VIEW, (leaf) => new VibeRpgAppView(leaf, this));
    this.registerView(SIDEBAR_VIEW, (leaf) => new VibeRpgSidebarView(leaf, this));
    this.addRibbonIcon("sparkles", "Open Grindstone", () => this.openApp());
    this.addCommand({ id: "open-vibe-rpg", name: "Open Grindstone", callback: () => this.openApp() });
    this.addCommand({ id: "open-vibe-rpg-sidebar", name: "Open Grindstone Widget", callback: () => this.openSidebar() });
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
  async setMood(value, key = dateKey()) {
    if (!MOODS[value]) return;
    applyMoodChange(this.data, key, value);
    await this.save();
  }
  async buyReward(rewardId) {
    const result = applyRewardPurchase(this.data, rewardId);
    if (!result.ok && result.reason === "not-enough-xp") {
      new Notice("Not enough Gold");
      return;
    }
    if (!result.ok) return;
    if (!Array.isArray(this.data.log)) this.data.log = [];
    this.data.log.push({
      type: "reward-purchased",
      title: result.reward.title,
      cost: result.reward.cost,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    await this.save();
    new Notice(`Purchased: ${result.reward.title}`);
  }
  async addHabit(title, area, icon = "\u2728", days = null) {
    const clean = String(title || "").trim();
    if (!clean) return;
    applyHabitAdd(this.data, { title: clean, area, icon, days });
    await this.save();
  }
  async deleteHabit(id) {
    const habit = this.data.habits.find((h) => h.id === id);
    if (!habit) return;
    applyHabitDelete(this.data, id);
    await this.save();
    new Notice(`Deleted: ${habit.title}`);
  }
  async setHabitEnabled(id, enabled) {
    const habit = this.data.habits.find((h) => h.id === id);
    if (!habit) return;
    applyHabitUpdate(this.data, id, { enabled });
    await this.save();
  }
  async updateHabit(id, patch) {
    const habit = this.data.habits.find((h) => h.id === id);
    if (!habit) return;
    const next = {};
    if (Object.prototype.hasOwnProperty.call(patch, "title")) {
      const title = String(patch.title || "").trim();
      if (title) next.title = title;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "icon")) {
      next.icon = String(patch.icon || "").trim() || "\u2728";
    }
    if (Object.prototype.hasOwnProperty.call(patch, "area") && AREA_LABELS[patch.area]) {
      next.area = patch.area;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "enabled")) {
      next.enabled = !!patch.enabled;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "days")) {
      next.days = patch.days;
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
    const reward = this.data.rewards.find((r) => r.id === id);
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
  async addQuest(questInput) {
    applyQuestAdd(this.data, questInput);
    await this.save();
    new Notice(`Quest added: ${questInput.title}`);
  }
  async completeQuest(questId) {
    applyQuestComplete(this.data, questId);
    await this.save();
    new Notice("Quest completed! \u{1F389}");
  }
  async abandonQuest(questId) {
    applyQuestAbandon(this.data, questId);
    await this.save();
    new Notice("Quest abandoned");
  }
  async updateQuest(questId, patch) {
    applyQuestUpdate(this.data, questId, patch);
    await this.save();
  }
  async deleteQuest(questId) {
    applyQuestDelete(this.data, questId);
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
  async updatePlayer(profile) {
    const name = String(profile.name || "").trim();
    const classId = resolveHeroClassId({ classId: profile.classId, className: profile.className });
    const goal = String(profile.goal || "").trim();
    const avatarUrl = String(profile.avatarUrl || "").trim();
    applyPlayerUpdate(this.data, {
      ...name ? { name } : {},
      classId,
      ...goal ? { goal } : {},
      avatarUrl
    });
    await this.save();
    new Notice("Hero profile updated");
  }
  onunload() {
    this.app.workspace.detachLeavesOfType(APP_VIEW);
    this.app.workspace.detachLeavesOfType(SIDEBAR_VIEW);
  }
};
var VibeRpgAppView = class extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.tab = "home";
    this.selectedDateKey = dateKey();
    this.homePanel = "hero";
    this.settingsPanel = "profile";
    this.isHomeEditMode = false;
  }
  getViewType() {
    return APP_VIEW;
  }
  getDisplayText() {
    return "Grindstone";
  }
  getIcon() {
    return "sparkles";
  }
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
    if (state.homePanel === "wallet") this.homePanel = "log";
    if (["today", "hero", "quests", "rewards", "inventory", "log"].includes(state.homePanel)) this.homePanel = state.homePanel;
    if (["profile", "interface", "habits", "quests", "rewards"].includes(state.settingsPanel)) this.settingsPanel = state.settingsPanel;
  }
  navigate(state) {
    const previousHomePanel = this.homePanel;
    this.applyState(state);
    const shouldResetHomeScroll = this.tab === "home" && state && Object.prototype.hasOwnProperty.call(state, "homePanel") && previousHomePanel !== this.homePanel;
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
    }, 6e4);
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
    zone.ondragover = (event) => {
      event.preventDefault();
      zone.addClass("is-dragging");
    };
    zone.ondragleave = () => zone.removeClass("is-dragging");
    zone.ondrop = (event) => {
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
      displayDate,
      displayDateFromKey,
      readDayStats,
      streak,
      getHeroClassTitle,
      createProgressBar,
      text: TEXT,
      timeParts,
      dayPhase,
      monthLabel,
      dateFromKey,
      calendarDays,
      renderAvatar: (avatarParent, data, cls) => this.renderAvatar(avatarParent, data, cls),
      navigate: (state) => this.navigate(state),
      toggleHomeEditMode: () => this.toggleHomeEditMode(),
      updateHomeLayout: (layout) => this.plugin.updateHomeLayout(layout),
      getDay,
      activeHabits,
      skillStats,
      heroTitle,
      toggleHabit: (habitId, key) => this.plugin.toggleHabit(habitId, key),
      renderHomeToday: (body) => this.renderHomeToday(body),
      renderHomeHero: (body) => this.renderHomeHero(body),
      renderHomeQuests: (body) => this.renderHomeQuests(body),
      renderHomeRewards: (body) => this.renderHomeRewards(body),
      renderHomeInventory: (body) => this.renderHomeInventory(body),
      renderHomeLog: (body) => this.renderHomeLog(body)
    };
  }
  renderHomeToday(parent) {
    return renderHomeTodayScreen(parent, {
      data: this.plugin.data,
      selectedDateKey: this.selectedDateKey,
      dateKey,
      displayDateFromKey,
      dateFromKey,
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
      coreAttributes,
      streak,
      getHeroClassTitle,
      heroTitle,
      createProgressBar,
      renderRadar: (radarParent, metrics) => this.renderRadar(radarParent, metrics),
      achievements
    });
  }
  renderHomeQuests(parent) {
    return renderHomeQuestsScreen(parent, {
      data: this.plugin.data,
      completeQuest: (questId) => this.plugin.completeQuest(questId),
      abandonQuest: (questId) => this.plugin.abandonQuest(questId),
      displayDate
    });
  }
  renderHomeRewards(parent) {
    const data = this.plugin.data;
    return renderHomeRewardsScreen(parent, {
      data,
      totals: totals(data),
      rarities: RARITIES,
      buyReward: (rewardId) => this.plugin.buyReward(rewardId)
    });
  }
  renderHomeInventory(parent) {
    return renderHomeInventoryScreen(parent, {
      data: this.plugin.data,
      toggleInventoryItemUsed: (itemId) => this.plugin.toggleInventoryItemUsed(itemId)
    });
  }
  renderHomeLog(parent) {
    return renderHomeLogScreen(parent, {
      data: this.plugin.data,
      displayDateFromKey
    });
  }
  renderRadar(parent, metrics) {
    return renderRadarChart(parent, metrics);
  }
  renderSettings(parent) {
    return renderSettingsScreen(parent, {
      settingsPanel: this.settingsPanel,
      navigate: (state) => this.navigate(state),
      renderSettingsProfile: (body) => this.renderSettingsProfile(body),
      renderSettingsInterface: (body) => this.renderSettingsInterface(body),
      renderSettingsHabits: (body) => this.renderSettingsHabits(body),
      renderSettingsQuests: (body) => this.renderSettingsQuests(body),
      renderSettingsRewards: (body) => this.renderSettingsRewards(body)
    });
  }
  renderSettingsProfile(parent) {
    return renderSettingsProfileScreen(parent, {
      data: this.plugin.data,
      renderAvatar: (avatarParent, data, cls) => this.renderAvatar(avatarParent, data, cls),
      attachAvatarDropZone: (zone, input, getProfile) => this.attachAvatarDropZone(zone, input, getProfile),
      updatePlayer: (profile) => this.plugin.updatePlayer(profile)
    });
  }
  renderSettingsInterface(parent) {
    return renderSettingsInterfaceScreen(parent, {
      settings: this.plugin.data.settings,
      updateHomeLayout: (layout) => this.plugin.updateHomeLayout(layout),
      updateInterfaceLayout: (layout) => this.plugin.updateInterfaceLayout(layout)
    });
  }
  renderSettingsHabits(parent) {
    return renderSettingsHabitsScreen(parent, {
      data: this.plugin.data,
      habitIcons: HABIT_ICONS,
      areaLabels: AREA_LABELS,
      addHabit: (title, area, icon, days) => this.plugin.addHabit(title, area, icon, days),
      setHabitEnabled: (habitId, enabled) => this.plugin.setHabitEnabled(habitId, enabled),
      updateHabit: (habitId, patch) => this.plugin.updateHabit(habitId, patch),
      deleteHabit: (habitId) => this.plugin.deleteHabit(habitId),
      confirm
    });
  }
  renderSettingsQuests(parent) {
    return renderSettingsQuestsScreen(parent, {
      data: this.plugin.data,
      addQuest: (questInput) => this.plugin.addQuest(questInput),
      updateQuest: (questId, patch) => this.plugin.updateQuest(questId, patch),
      deleteQuest: (questId) => this.plugin.deleteQuest(questId),
      confirm
    });
  }
  renderSettingsRewards(parent) {
    return renderSettingsRewardsScreen(parent, {
      data: this.plugin.data,
      rarities: RARITIES,
      addReward: (title, cost, rarity) => this.plugin.addReward(title, cost, rarity),
      deleteReward: (rewardId) => this.plugin.deleteReward(rewardId),
      confirm
    });
  }
};
var VibeRpgSidebarView = class extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return SIDEBAR_VIEW;
  }
  getDisplayText() {
    return "Grindstone";
  }
  getIcon() {
    return "sparkles";
  }
  async onOpen() {
    this.render();
  }
  render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("vibe-rpg-plugin");
    const data = this.plugin.data;
    const today = getDay(data);
    const active = data.habits.filter((h) => h.enabled !== false);
    const done = active.filter((h) => today.completed[h.id]).length;
    const t = totals(data);
    const box = root.createDiv({ cls: "vrpg-sidebar" });
    box.createDiv({ cls: "vrpg-section", text: "Today" });
    box.createDiv({ cls: "vrpg-side-number", text: `${done}/${active.length}` });
    createProgressBar(box, active.length ? Math.round(done / active.length * 100) : 0);
    box.createDiv({ cls: "vrpg-side-note", text: `${t.gold} Gold \xB7 Level ${t.level}` });
    const open = box.createEl("button", { cls: "vrpg-primary", text: "Open Grindstone" });
    open.onclick = () => this.plugin.openApp();
  }
};
module.exports = VibeRpgPlugin;
