// Widget runtime scaffold helpers for Vibe RPG.
// UI-3 uses these helpers for Home layout runtime. Settings, drag-and-drop, and resize are not connected yet.

const {
  clampWidgetGeometry,
  getDefaultHomeLayout,
  getHomeWidgetDefinitions,
  getWidgetDefaultGeometry,
  getWidgetMaxGeometry,
  getWidgetMinGeometry
} = require("../config/layoutConfig");
const {
  getEnabledHomeWidgets,
  getHomeLayout,
  getHomeWidgetById,
  getHomeWidgetSizeClass,
  mergeHomeLayout
} = require("./layoutSystem");

const WIDGET_SIZE_FALLBACK = "medium";

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
  return ["x", "y", "w", "h"].every(key => Number.isFinite(Number(widget[key])));
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
  return mergeHomeLayout(layout).widgets.map(widget => widget.id);
}

module.exports = {
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
