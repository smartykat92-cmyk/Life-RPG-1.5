// Active Home hero panel renderer for Grindstone.
// 5 categories (Body/Mind/Spirit/Craft/Hearth), no water, streak as own section.

function renderHomeHeroScreen(parent, ctx = {}) {
  const data = ctx.data || {};
  const totals = ctx.totals;
  const coreAttributes = ctx.coreAttributes;
  const streak = ctx.streak;
  const getHeroClassTitle = ctx.getHeroClassTitle;
  const heroTitle = ctx.heroTitle;
  const createProgressBar = ctx.createProgressBar;
  const renderRadar = ctx.renderRadar;
  const achievements = ctx.achievements;

  const t = totals(data);
  const metrics = coreAttributes(data);

  // Hero summary card
  const wrap = parent.createDiv({ cls: "vrpg-hero-preview" });
  const info = wrap.createDiv({ cls: "vrpg-hero-summary" });
  info.createDiv({ cls: "vrpg-kicker", text: getHeroClassTitle(data.player) });
  info.createDiv({ cls: "vrpg-level", text: `LEVEL ${t.level}` });
  info.createDiv({ cls: "vrpg-hero-title", text: heroTitle(t.level) });
  info.createDiv({ cls: "vrpg-subtitle", text: `${t.gold} Gold · ${t.levelXP}/100 XP to next level` });
  createProgressBar(info, t.levelXP, "vrpg-hero-xp");

  // Radar + stat tracks
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

  // Streak section
  const currentStreak = streak(data);
  const streakPanel = parent.createDiv({ cls: "vrpg-panel vrpg-streak" });
  streakPanel.createDiv({ cls: "vrpg-section", text: "🔥 Streak" });
  streakPanel.createDiv({ cls: "vrpg-level", text: `${currentStreak} days` });
  if (currentStreak >= 7) {
    streakPanel.createDiv({ cls: "vrpg-subtitle", text: "Power streak! Keep it going!" });
  } else if (currentStreak >= 3) {
    streakPanel.createDiv({ cls: "vrpg-subtitle", text: "Building momentum!" });
  } else {
    streakPanel.createDiv({ cls: "vrpg-subtitle", text: "Complete 50%+ dailies to build your streak." });
  }

  // Achievement showcase
  const achPanel = parent.createDiv({ cls: "vrpg-panel vrpg-achievements" });
  achPanel.createDiv({ cls: "vrpg-section", text: "Achievements" });
  const achList = achievements(data);
  const earned = achList.filter(a => a.done);
  achPanel.createDiv({ cls: "vrpg-subtitle", text: `${earned.length}/${achList.length} unlocked` });
  for (const item of achList) {
    const row = achPanel.createDiv({ cls: item.done ? "vrpg-achievement is-done" : "vrpg-achievement" });
    row.createSpan({ text: item.icon || (item.done ? "✓" : "•") });
    row.createEl("strong", { text: item.title });
  }
}

module.exports = {
  renderHomeHeroScreen
};
