// Active Home hero panel renderer for Vibe RPG.
// Receives data, helpers, and callbacks from main-entry; does not access plugin state directly.

function renderHomeHeroScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const totals = ctx.totals;
  const skillStats = ctx.skillStats;
  const waterStats = ctx.waterStats;
  const streak = ctx.streak;
  const getHeroClassTitle = ctx.getHeroClassTitle;
  const heroTitle = ctx.heroTitle;
  const createProgressBar = ctx.createProgressBar;
  const renderRadar = ctx.renderRadar;
  const featureFlags = ctx.featureFlags || {};
  const achievements = ctx.achievements;
  const t = totals(data);
  const stats = skillStats(data);
  const water = waterStats(data);
  const metrics = [
    ["Тело", stats.body.total ? Math.round(stats.body.done / stats.body.total * 100) : 0],
    ["Разум", stats.mind.total ? Math.round(stats.mind.done / stats.mind.total * 100) : 0],
    ["Дело", stats.craft.total ? Math.round(stats.craft.done / stats.craft.total * 100) : 0],
    ["Контроль", stats.control.total ? Math.round(stats.control.done / stats.control.total * 100) : 0],
    ["Вода", water.percent],
    ["Серия", Math.min(100, Math.round(streak(data) / 7 * 100))]
  ];
  const wrap = parent.createDiv({ cls: "vrpg-hero-preview" });
  const info = wrap.createDiv({ cls: "vrpg-hero-summary" });
  info.createDiv({ cls: "vrpg-kicker", text: getHeroClassTitle(data.player) });
  info.createDiv({ cls: "vrpg-level", text: `LEVEL ${t.level}` });
  info.createDiv({ cls: "vrpg-hero-title", text: heroTitle(t.level) });
  info.createDiv({ cls: "vrpg-subtitle", text: `${t.balance} XP · ${t.levelXP}/100 до нового уровня` });
  createProgressBar(info, t.levelXP, "vrpg-hero-xp");
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

  if (featureFlags.showAchievements) {
    const achPanel = parent.createDiv({ cls: "vrpg-panel vrpg-achievements" });
    achPanel.createDiv({ cls: "vrpg-section", text: "Достижения" });
    for (const item of achievements(data)) {
      const row = achPanel.createDiv({ cls: item.done ? "vrpg-achievement is-done" : "vrpg-achievement" });
      row.createSpan({ text: item.done ? "✓" : "•" });
      row.createEl("strong", { text: item.title });
    }
  }
}

module.exports = {
  renderHomeHeroScreen
};
