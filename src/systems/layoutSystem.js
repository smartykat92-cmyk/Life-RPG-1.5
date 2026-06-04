// Home layout system helpers for Vibe RPG.
// Provides normalized Home layout data for storage merge and widget runtime.

const {
  getDefaultHomeLayout,
  getDefaultInterfaceLayout,
  getHomeWidgetDefinitions,
  normalizeInterfaceLayout,
  normalizeHomeLayout
} = require("../config/layoutConfig");

const HOME_WIDGET_SIZE_CLASSES = {
  small: "vrpg-widget-small",
  medium: "vrpg-widget-medium",
  large: "vrpg-widget-large",
  full: "vrpg-widget-full"
};

function getHomeLayout(settings = {}) {
  const interfaceLayout = getInterfaceLayout(settings);
  const source = settings && typeof settings === "object" ? settings.homeLayout : null;
  return source ? normalizeHomeLayout(source, interfaceLayout) : normalizeHomeLayout(getDefaultHomeLayout(), interfaceLayout);
}

function mergeHomeLayout(layout) {
  return normalizeHomeLayout(layout);
}

function clearHomeLayoutGeometry(layout) {
  const normalized = normalizeHomeLayout(layout);
  return {
    version: normalized.version || 1,
    widgets: normalized.widgets.map(({ x, y, w, h, ...widget }) => widget)
  };
}

function resetHomeLayoutToDefault() {
  return normalizeHomeLayout(getDefaultHomeLayout());
}

function getInterfaceLayout(settings = {}) {
  const source = settings && typeof settings === "object" ? settings.interfaceLayout : null;
  return source ? normalizeInterfaceLayout(source) : normalizeInterfaceLayout(getDefaultInterfaceLayout());
}

function getHomeLayoutMode(settings = {}) {
  return getInterfaceLayout(settings).homeLayoutMode;
}

function getAppSizePreset(settings = {}) {
  return getInterfaceLayout(settings).appSize;
}

function getHomeLayoutColumns(settings = {}) {
  return getInterfaceLayout(settings).columns;
}

function getHomeLayoutRowHeight(settings = {}) {
  return getInterfaceLayout(settings).rowHeight;
}

function getEnabledHomeWidgets(layout) {
  const normalized = normalizeHomeLayout(layout);
  return normalized.widgets.filter(widget => widget.enabled !== false);
}

function getHomeWidgetById(id) {
  return getHomeWidgetDefinitions().find(widget => widget.id === id) || null;
}

function getHomeWidgetSizeClass(size) {
  return HOME_WIDGET_SIZE_CLASSES[size] || HOME_WIDGET_SIZE_CLASSES.medium;
}

module.exports = {
  getHomeLayout,
  mergeHomeLayout,
  clearHomeLayoutGeometry,
  resetHomeLayoutToDefault,
  getInterfaceLayout,
  getHomeLayoutMode,
  getAppSizePreset,
  getHomeLayoutColumns,
  getHomeLayoutRowHeight,
  getEnabledHomeWidgets,
  getHomeWidgetById,
  getHomeWidgetSizeClass
};
