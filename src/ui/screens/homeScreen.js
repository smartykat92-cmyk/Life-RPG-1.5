// Active Home shell and module dispatcher for Vibe RPG.
// Receives data, helpers, and callbacks from main-entry; does not access plugin state directly.

const {
  clampWidgetGeometry,
  getEnabledWidgets,
  getWidgetCssClass,
  getWidgetDefinition,
  getWidgetGeometry,
  getWidgetMaxGeometry,
  getWidgetMinGeometry
} = require("../../systems/widgetSystem");
const {
  getHomeLayout,
  getHomeLayoutColumns,
  getHomeLayoutMode,
  getHomeLayoutRowHeight
} = require("../../systems/layoutSystem");
const {
  normalizeHomeLayout
} = require("../../config/layoutConfig");

const HOME_PANEL_WIDGET_IDS = ["today", "hero", "quests", "rewards", "inventory", "wallet"];
const ENABLE_HOME_FREEFORM = false;
const ENABLE_HOME_FREEFORM_RESIZE = false;

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
  const defaultPanel = panelWidgets.find(widget => widget.id === "hero") || panelWidgets[0];
  if (!requestedPanel || requestedPanel === "dashboard") return defaultPanel;
  return panelWidgets.find(widget => widget.id === requestedPanel) || defaultPanel;
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

function renderHomeScreen(parent, ctx = {}) {
  const data = ctx.data;
  const totals = ctx.totals;
  const dateKey = ctx.dateKey;
  const readDayStats = ctx.readDayStats;
  const waterStats = ctx.waterStats;
  const streak = ctx.streak;
  const getHeroClassTitle = ctx.getHeroClassTitle;
  const getDay = ctx.getDay || (() => ({ completed: {}, mood: "normal" }));
  const activeHabits = ctx.activeHabits || (() => []);
  const skillStats = ctx.skillStats || (() => ({
    body: { done: 0, total: 0 },
    mind: { done: 0, total: 0 },
    craft: { done: 0, total: 0 },
    control: { done: 0, total: 0 }
  }));
  const heroTitle = ctx.heroTitle || (level => `Level ${level}`);
  const walletStats = ctx.walletStats || (() => ({ income: 0, expense: 0, balance: 0, items: [] }));
  const formatMoney = ctx.formatMoney || (value => String(value || 0));
  const createProgressBar = ctx.createProgressBar;
  const text = ctx.text;
  const timeParts = ctx.timeParts;
  const dayPhase = ctx.dayPhase;
  const monthLabel = ctx.monthLabel;
  const dateFromKey = ctx.dateFromKey || (() => new Date());
  const calendarDays = ctx.calendarDays;
  const renderWaterWidget = ctx.renderWaterWidget;
  const renderAvatar = ctx.renderAvatar;
  const navigate = ctx.navigate;
  const toggleHomeEditMode = ctx.toggleHomeEditMode || (() => {});
  const updateHomeLayout = ctx.updateHomeLayout || (() => {});
  const changeWater = ctx.changeWater;
  const toggleHabit = ctx.toggleHabit || (() => {});
  const t = totals(data);
  const now = new Date();
  const selectedKey = ctx.selectedDateKey || dateKey(now);
  const selectedDate = dateFromKey(selectedKey);
  const selectedStats = readDayStats(data, selectedKey);
  const selectedWater = waterStats(data, selectedKey);
  const weekKeys = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    weekKeys.push(dateKey(date));
  }
  const weekStats = weekKeys.map(key => readDayStats(data, key));
  const strongDays = weekStats.filter(day => day.percent >= 50).length;
  const bestDay = weekStats.reduce((best, day) => day.xp > best.xp ? day : best, { xp: 0, key: "" });
  const today = selectedStats;
  const selectedDay = getDay(data, selectedKey);
  const habits = activeHabits(data);
  const water = selectedWater;
  const isTodaySelected = selectedKey === dateKey(now);
  const nextReward = data.rewards
    .slice()
    .sort((a, b) => Number(a.cost || 0) - Number(b.cost || 0))
    .find(reward => Number(reward.cost || 0) > t.balance);
  const nextRewardText = nextReward
    ? `${Number(nextReward.cost || 0) - t.balance} XP until "${nextReward.title}"`
    : "Basic shop already unlocked";
  const todayPercent = today.total ? Math.round(today.done / today.total * 100) : 0;
  const layoutWidgets = getEnabledLayoutWidgets(data);
  const widgetById = new Map(layoutWidgets.map(widget => [widget.id, widget]));
  const panelWidgets = layoutWidgets.filter(widget => isHomePanelWidget(widget.id));
  const activePanelWidget = getActivePanelWidget(panelWidgets, ctx.homePanel);
  const activePanelId = activePanelWidget ? activePanelWidget.id : "";
  const visibleWidgetIds = new Set(["command", "clock", "calendar", "water"]);
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
  const widgetGeometryById = new Map();
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
    return rect.width < 720 || (window.matchMedia && window.matchMedia("(max-width: 820px)").matches);
  };

  const applyFreeformGeometry = (root, geometry) => {
    root.style.setProperty("--vrpg-widget-x", String(geometry.x));
    root.style.setProperty("--vrpg-widget-y", String(geometry.y));
    root.style.setProperty("--vrpg-widget-w", String(geometry.w));
    root.style.setProperty("--vrpg-widget-h", String(geometry.h));
    root.style.gridColumn = `${geometry.x + 1} / span ${geometry.w}`;
    root.style.gridRow = `${geometry.y + 1} / span ${geometry.h}`;
  };

  const geometriesOverlap = (a, b) => (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );

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

  const clearGeometryValidation = root => {
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

  const clearPixelPreview = root => {
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
    top.querySelectorAll(".is-dragging, .is-drag-over, .is-drag-over-before, .is-drag-over-after").forEach(element => {
      element.classList.remove("is-dragging", "is-drag-over", "is-drag-over-before", "is-drag-over-after");
    });
  };

  const moveHomeWidgetTo = (id, targetId, placeAfter) => {
    const current = getHomeLayout(data.settings || {});
    const widgets = current.widgets.map(widget => ({ ...widget }));
    const fromIndex = widgets.findIndex(widget => widget.id === id);
    const targetIndex = widgets.findIndex(widget => widget.id === targetId);
    if (fromIndex < 0 || targetIndex < 0 || id === targetId) return;
    const [widget] = widgets.splice(fromIndex, 1);
    const adjustedTargetIndex = widgets.findIndex(item => item.id === targetId);
    widgets.splice(adjustedTargetIndex + (placeAfter ? 1 : 0), 0, widget);
    updateHomeLayout(normalizeHomeLayout({
      version: current.version || 1,
      widgets
    }, { columns }));
  };

  const saveWidgetGeometry = (id, geometry) => {
    const current = getHomeLayout(data.settings || {});
    const widgets = current.widgets.map(widget => ({ ...widget }));
    const widget = widgets.find(item => item.id === id);
    if (!widget) return;
    Object.assign(widget, {
      x: geometry.x,
      y: geometry.y,
      w: geometry.w,
      h: geometry.h
    });
    updateHomeLayout(normalizeHomeLayout({
      version: current.version || 1,
      widgets
    }, { columns }));
  };

  const attachGridEditHandle = (root, widget) => {
    root.classList.add("vrpg-widget-editing");
    const handle = root.createEl("button", {
      cls: "vrpg-home-drag-handle",
      text: "↕",
      attr: {
        draggable: "true",
        title: "Drag widget"
      }
    });
    handle.ondragstart = event => {
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
    root.ondragover = event => {
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
    root.ondrop = event => {
      const sourceId = draggedWidgetId || (event.dataTransfer && event.dataTransfer.getData("text/plain"));
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
      text: "↕",
      attr: {
        title: "Drag widget"
      }
    });
    handle.onpointerdown = event => {
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

      const onPointerMove = moveEvent => {
        moveEvent.preventDefault();
        const deltaX = moveEvent.clientX - start.pointerX;
        const deltaY = moveEvent.clientY - start.pointerY;
        const finalLeft = start.left + deltaX;
        const finalTop = start.top + deltaY;
        nextGeometry = pixelPositionToGeometry(finalLeft, finalTop, geometry, metrics);
        root.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.012)`;
        isValidGeometry = setGeometryValidation(root, widget.id, nextGeometry);
      };

      const onPointerUp = upEvent => {
        upEvent.preventDefault();
        handle.removeEventListener("pointermove", onPointerMove);
        handle.removeEventListener("pointerup", onPointerUp);
        handle.removeEventListener("pointercancel", onPointerUp);
        if (handle.releasePointerCapture) {
          try {
            handle.releasePointerCapture(upEvent.pointerId);
          } catch (error) {
            // Pointer capture can already be released by the browser.
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
      text: "↘",
      attr: {
        title: "Resize widget"
      }
    });
    resize.onpointerdown = event => {
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

      const onPointerMove = moveEvent => {
        moveEvent.preventDefault();
        const previewWidth = clamp(start.width + moveEvent.clientX - start.pointerX, minWidth, maxWidth);
        const previewHeight = clamp(start.height + moveEvent.clientY - start.pointerY, minHeight, maxHeight);
        nextGeometry = pixelSizeToGeometry(widget.id, previewWidth, previewHeight, geometry, metrics);
        root.style.width = `${previewWidth}px`;
        root.style.height = `${previewHeight}px`;
        root.style.minHeight = `${previewHeight}px`;
        isValidGeometry = setGeometryValidation(root, widget.id, nextGeometry);
      };

      const onPointerUp = upEvent => {
        upEvent.preventDefault();
        resize.removeEventListener("pointermove", onPointerMove);
        resize.removeEventListener("pointerup", onPointerUp);
        resize.removeEventListener("pointercancel", onPointerUp);
        if (resize.releasePointerCapture) {
          try {
            resize.releasePointerCapture(upEvent.pointerId);
          } catch (error) {
            // Pointer capture can already be released by the browser.
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
    profileText.createDiv({ cls: "vrpg-subtitle", text: `${getHeroClassTitle(data.player)} · Level ${t.level}` });
    const commandVitals = commandHeader.createDiv({ cls: "vrpg-command-vitals" });
    const xpVital = commandVitals.createDiv({ cls: "vrpg-command-vital" });
    xpVital.createDiv({ cls: "vrpg-section", text: "XP" });
    xpVital.createDiv({ cls: "vrpg-card-title", text: `${t.balance}` });
    xpVital.createDiv({ cls: "vrpg-subtitle", text: `${t.levelXP}/100 to level` });
    const streakVital = commandVitals.createDiv({ cls: "vrpg-command-vital" });
    streakVital.createDiv({ cls: "vrpg-section", text: "Streak" });
    streakVital.createDiv({ cls: "vrpg-card-title", text: `${streak(data)}` });
    streakVital.createDiv({ cls: "vrpg-subtitle", text: "days" });
    createProgressBar(card, todayPercent, "vrpg-command-progress");
    const commandGrid = card.createDiv({ cls: "vrpg-command-grid" });
    const commandItems = {
      today: [isTodaySelected ? "Today" : "Day", "Check off habits"],
      hero: ["Hero", `${t.levelXP}/100 XP to level`],
      quests: ["Quests", `${today.done >= 3 ? "daily minimum met" : `${Math.min(today.done, 3)}/3 to minimum`}`],
      rewards: ["Shop", nextRewardText],
      inventory: ["Inventory", `${data.inventory.filter(item => !item.used).length} active`],
      wallet: ["Bank", `${(data.wallet || []).length} records`]
    };
    const panelWidgetById = new Map(panelWidgets.map(panelWidget => [panelWidget.id, panelWidget]));
    HOME_PANEL_WIDGET_IDS.forEach(id => {
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
    const parts = timeParts(now);
    const clockFace = clock.createDiv({ cls: "vrpg-clock" });
    clockFace.createSpan({ text: parts.hours });
    clockFace.createSpan({ cls: "vrpg-clock-colon", text: ":" });
    clockFace.createSpan({ text: parts.minutes });
    clock.createDiv({ cls: "vrpg-phase", text: dayPhase(now) });
    clock.createDiv({ cls: "vrpg-subtitle", text: now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" }) });
  };

  const renderCalendarWidget = (widget, parentEl = top) => {
    const calendarDate = Number.isFinite(selectedDate.getTime()) ? selectedDate : now;
    const monthDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
    const moveMonth = delta => {
      const targetYear = monthDate.getFullYear();
      const targetMonth = monthDate.getMonth() + delta;
      const maxDay = new Date(targetYear, targetMonth + 1, 0).getDate();
      const targetDay = Math.min(calendarDate.getDate(), maxDay);
      navigate({ selectedDateKey: dateKey(new Date(targetYear, targetMonth, targetDay)) });
    };
    const calendar = parentEl.createDiv({
      cls: getWidgetClass("vrpg-glass-widget", widget),
      attr: getWidgetAttr(widget)
    });
    prepareWidgetRoot(calendar, widget);
    const calendarHeader = calendar.createDiv({ cls: "vrpg-preview-header" });
    calendarHeader.createEl("button", { cls: "vrpg-icon-action", text: "‹" }).onclick = () => moveMonth(-1);
    calendarHeader.createDiv({ cls: "vrpg-kicker", text: monthLabel(monthDate) });
    calendarHeader.createEl("button", { cls: "vrpg-icon-action", text: "›" }).onclick = () => moveMonth(1);
    const week = calendar.createDiv({ cls: "vrpg-calendar" });
    ["M", "T", "W", "T", "F", "S", "S"].forEach(day => week.createSpan({ cls: "vrpg-calendar-head", text: day }));
    for (const day of calendarDays(monthDate)) {
      const key = day ? dateKey(new Date(monthDate.getFullYear(), monthDate.getMonth(), day)) : "";
      const dayButton = week.createEl("button", {
        cls: [
          "vrpg-calendar-day",
          key === dateKey(now) ? "is-today" : "",
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
    dayDetails.createDiv({ cls: "vrpg-subtitle", text: `Habits: ${selectedStats.done}/${selectedStats.total} · Water: ${selectedWater.value}/${selectedWater.goal}` });
    dayDetails.createDiv({ cls: "vrpg-subtitle", text: isGridMode ? `Week: ${strongDays}/7 · streak ${streak(data)}` : `Week: ${strongDays}/7 strong days · best day ${bestDay.xp} XP · streak ${streak(data)}` });
  };

  const renderWaterLayoutWidget = (widget, parentEl = top) => {
    const waterRoot = renderWaterWidget(parentEl, {
      stats: water,
      title: "Water",
      mode: "ring",
      className: getWidgetClass("vrpg-glass-widget vrpg-water-widget", widget),
      onDecrement: () => changeWater(-1, selectedKey),
      onIncrement: () => changeWater(1, selectedKey)
    });
    waterRoot.setAttribute("data-widget-id", widget.id);
    prepareWidgetRoot(waterRoot, widget);
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

  const renderTodayPreview = widget => {
    renderPreviewWidget(widget, "vrpg-preview-today", "Today", `${today.done}/${today.total} completed · ${today.xp} XP`, body => {
      const topLine = body.createDiv({ cls: "vrpg-preview-progress-line" });
      topLine.createDiv({ cls: "vrpg-card-title", text: `${today.done}/${today.total}` });
      topLine.createDiv({ cls: "vrpg-subtitle", text: today.done >= 3 ? "daily minimum met" : `${Math.min(today.done, 3)}/3 to minimum` });
      createProgressBar(body, todayPercent, "vrpg-preview-progress");
      const list = body.createDiv({ cls: "vrpg-preview-task-list" });
      if (!habits.length) {
        list.createDiv({ cls: "vrpg-preview-empty", text: "No habits added for today" });
      } else {
        habits.slice(0, 3).forEach(habit => {
          const done = !!(selectedDay.completed && selectedDay.completed[habit.id]);
          const button = list.createEl("button", {
            cls: done ? "vrpg-preview-task is-done" : "vrpg-preview-task"
          });
          button.createSpan({ text: `${habit.icon || "•"} ${habit.title}` });
          button.createEl("strong", { text: done ? "✓" : `+${Number(habit.xp || 10)} XP` });
          button.onclick = () => toggleHabit(habit.id, selectedKey);
        });
      }
      if (habits.length > 3) {
        body.createDiv({ cls: "vrpg-subtitle", text: `${habits.length - 3} more habits in the Today section` });
      }
    }, { openPanel: "today", openLabel: "Open Today" });
  };

  const renderHeroProgressPreview = widget => {
    renderPreviewWidget(widget, "vrpg-preview-hero", "Hero Progress", `${heroTitle(t.level)} · ${t.levelXP}/100 XP to level`, body => {
      body.createDiv({ cls: "vrpg-preview-level", text: `LEVEL ${t.level}` });
      createProgressBar(body, t.levelXP, "vrpg-preview-progress");
      const statsGrid = body.createDiv({ cls: "vrpg-preview-stat-grid" });
      [
        ["XP", `${t.balance}`],
        ["Streak", `${streak(data)} days`],
        ["Week", `${strongDays}/7`]
      ].forEach(([label, value]) => {
        const item = statsGrid.createDiv({ cls: "vrpg-preview-stat" });
        item.createSpan({ text: label });
        item.createEl("strong", { text: value });
      });
    }, { openPanel: "hero", openLabel: "Open Hero" });
  };

  const renderQuestsPreview = widget => {
    renderPreviewWidget(widget, "vrpg-preview-quests", "Quests", `${Math.min(today.done, 3)}/3 to minimum`, body => {
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

  const renderRewardsPreview = widget => {
    const rewards = (data.rewards || [])
      .slice()
      .sort((a, b) => Number(a.cost || 0) - Number(b.cost || 0));
    const available = rewards.filter(reward => t.balance >= Number(reward.cost || 0));
    const previewRewards = available.length ? available.slice(0, 2) : rewards.slice(0, 2);
    renderPreviewWidget(widget, "vrpg-preview-rewards", "Rewards", available.length ? `Available: ${available.length}` : nextRewardText, body => {
      if (!previewRewards.length) {
        body.createDiv({ cls: "vrpg-preview-empty", text: "No rewards added" });
        return;
      }
      previewRewards.forEach(reward => {
        const row = body.createDiv({ cls: "vrpg-preview-row" });
        row.createDiv({ cls: "vrpg-card-title", text: `${reward.icon || "🎁"} ${reward.title}` });
        row.createDiv({ cls: "vrpg-subtitle", text: `${reward.cost} XP` });
      });
    }, { openPanel: "rewards", openLabel: "Open Shop" });
  };

  const renderInventoryPreview = widget => {
    const items = (data.inventory || []).slice().reverse();
    const activeItems = items.filter(item => !item.used);
    renderPreviewWidget(widget, "vrpg-preview-inventory", "Inventory", `${activeItems.length} active · ${items.length} total`, body => {
      if (!items.length) {
        body.createDiv({ cls: "vrpg-preview-empty", text: "Inventory empty" });
      } else {
        const loot = body.createDiv({ cls: "vrpg-preview-loot-row" });
        items.slice(0, 3).forEach(item => {
          const chip = loot.createDiv({ cls: item.used ? "vrpg-preview-loot is-muted" : "vrpg-preview-loot" });
          chip.createDiv({ cls: "vrpg-card-title", text: item.icon || "🎁" });
          chip.createDiv({ cls: "vrpg-subtitle", text: item.title });
        });
      }
    }, { openPanel: "inventory", openLabel: "Open Inventory" });
  };

  const renderWalletPreview = widget => {
    const all = walletStats(data.wallet || []);
    renderPreviewWidget(widget, "vrpg-preview-wallet", "Bank", `${(data.wallet || []).length} records`, body => {
      const grid = body.createDiv({ cls: "vrpg-preview-stat-grid" });
      [
        ["Balance", `${formatMoney(all.balance)} $`],
        ["Income", `+${formatMoney(all.income)} $`],
        ["Expenses", `-${formatMoney(all.expense)} $`]
      ].forEach(([label, value]) => {
        const item = grid.createDiv({ cls: "vrpg-preview-stat" });
        item.createSpan({ text: label });
        item.createEl("strong", { text: value });
      });
      if (!(data.wallet || []).length) body.createDiv({ cls: "vrpg-preview-empty", text: "No records yet" });
    }, { openPanel: "wallet", openLabel: "Open Bank" });
  };

  const renderModuleWidget = widget => {
    if (!widget || !isHomePanelWidget(widget.id)) return;
    renderHomeModuleScreen(top, { ...ctx, homePanel: widget.id, prepareWidgetRoot }, widget);
  };

  if (isGridMode) {
    const mainColumn = top.createDiv({ cls: "vrpg-home-main" });
    const sideColumn = top.createDiv({ cls: "vrpg-home-side" });
    if (widgetById.has("command")) renderCommandWidget(widgetById.get("command"), mainColumn);
    if (activePanelWidget) renderHomeModuleScreen(mainColumn, { ...ctx, homePanel: activePanelWidget.id, prepareWidgetRoot }, activePanelWidget);
    if (widgetById.has("clock")) renderClockWidget(widgetById.get("clock"), sideColumn);
    if (widgetById.has("water")) renderWaterLayoutWidget(widgetById.get("water"), sideColumn);
    if (widgetById.has("calendar")) renderCalendarWidget(widgetById.get("calendar"), sideColumn);
    return;
  }

  for (const widget of layoutWidgets) {
    if (widget.id === "command") renderCommandWidget(widget);
    if (widget.id === "clock") renderClockWidget(widget);
    if (widget.id === "calendar") renderCalendarWidget(widget);
    if (widget.id === "water") renderWaterLayoutWidget(widget);
    if (activePanelWidget && widget.id === activePanelWidget.id) {
      renderHomeModuleScreen(top, { ...ctx, homePanel: activePanelWidget.id, prepareWidgetRoot }, activePanelWidget);
    }
  }
}

function renderHomeModuleScreen(parent, ctx = {}, widget = null) {
  const module = parent.createDiv({
    cls: widget ? getWidgetClass("vrpg-home-module", widget) : "vrpg-home-module",
    attr: widget ? getWidgetAttr(widget) : {}
  });
  if (widget && ctx.prepareWidgetRoot) ctx.prepareWidgetRoot(module, widget);
  const body = module.createDiv({ cls: "vrpg-module-body" });
  if (ctx.homePanel === "today") ctx.renderHomeToday(body);
  if (ctx.homePanel === "hero") ctx.renderHomeHero(body);
  if (ctx.homePanel === "quests") ctx.renderHomeQuests(body);
  if (ctx.homePanel === "rewards") ctx.renderHomeRewards(body);
  if (ctx.homePanel === "inventory") ctx.renderHomeInventory(body);
  if (ctx.homePanel === "wallet") ctx.renderHomeWallet(body);
}

module.exports = {
  renderHomeScreen,
  renderHomeModuleScreen
};
