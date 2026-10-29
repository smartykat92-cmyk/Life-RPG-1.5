// Layout configuration for Grindstone.
// Stores widget definitions, default layout, and normalization helpers.

const WIDGET_SIZES = ["small", "medium", "large", "full"];
const APP_SIZE_PRESETS = ["compact", "comfortable", "expanded"];
const HOME_LAYOUT_MODES = ["grid", "freeform"];
const DEFAULT_INTERFACE_LAYOUT = {
  version: 1,
  appSize: "comfortable",
  homeLayoutMode: "grid",
  columns: 12,
  rowHeight: 96
};

const HOME_WIDGET_DEFINITIONS = [
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

const DEFAULT_HOME_LAYOUT = {
  version: 1,
  widgets: HOME_WIDGET_DEFINITIONS.map(widget => ({
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
    return HOME_WIDGET_DEFINITIONS.find(definition => definition.id === idOrDefinition.id) || idOrDefinition;
  }
  return HOME_WIDGET_DEFINITIONS.find(definition => definition.id === idOrDefinition) || null;
}

function normalizeInterfaceLayout(interfaceLayout) {
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
  const hasGeometry = ["x", "y", "w", "h"].some(key => Object.prototype.hasOwnProperty.call(widget, key));
  if (!hasGeometry) return {};
  const x = normalizePositiveNumber(widget.x, null, 0);
  const y = normalizePositiveNumber(widget.y, null, 0);
  const w = normalizePositiveNumber(widget.w, null, 1);
  const h = normalizePositiveNumber(widget.h, null, 1);
  if (x === null || y === null || w === null || h === null) return getWidgetDefaultGeometry(definition, { columns });
  return clampWidgetGeometry(definition, { x, y, w, h }, { columns });
}

function normalizeHomeLayout(layout, options = {}) {
  const input = layout && typeof layout === "object" ? layout : {};
  const inputWidgets = Array.isArray(input.widgets) ? input.widgets : [];
  const columns = normalizePositiveNumber(options.columns, DEFAULT_INTERFACE_LAYOUT.columns, 1);
  const definitionsById = new Map(HOME_WIDGET_DEFINITIONS.map(definition => [definition.id, definition]));
  const usedIds = new Set();
  const widgets = [];

  const appendWidget = (definition, widget = {}) => {
    const enabled = typeof widget.enabled === "boolean"
      ? widget.enabled
      : definition.defaultEnabled;
    const size = definition.allowedSizes.includes(widget.size)
      ? widget.size
      : definition.defaultSize;

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

module.exports = {
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
  normalizeInterfaceLayout,
  normalizeHomeLayout
};
