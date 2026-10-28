// Active Home wallet panel renderer for Vibe RPG.
// Receives data, helpers, and callbacks from main-entry; does not access plugin state directly.

function renderHomeWalletScreen(parent, ctx = {}) {
  const wallet = ctx.wallet || [];
  const selectedKey = ctx.selectedDateKey || ctx.dateKey();
  const walletStats = ctx.walletStats;
  const formatMoney = ctx.formatMoney;
  const bindMoneyInput = ctx.bindMoneyInput;
  const walletMonthLabel = ctx.walletMonthLabel;
  const addWallet = ctx.addWallet;
  const renderWalletRow = ctx.renderWalletRow;
  const renderWalletMonth = ctx.renderWalletMonth;
  const all = walletStats(wallet);
  const day = walletStats(wallet, selectedKey);
  const top = parent.createDiv({ cls: "vrpg-bank-top" });
  [
    ["Total Balance", `${formatMoney(all.balance)} $`],
    ["Income", `+${formatMoney(all.income)} $`],
    ["Expenses", `-${formatMoney(all.expense)} $`]
  ].forEach(([label, value]) => {
    const card = top.createDiv({ cls: "vrpg-bank-metric" });
    card.createDiv({ cls: "vrpg-section", text: label });
    card.createDiv({ cls: "vrpg-stat-value", text: value });
  });

  const form = parent.createDiv({ cls: "vrpg-panel vrpg-inline-form vrpg-wallet-form" });
  form.createDiv({ cls: "vrpg-section", text: `Record for ${selectedKey}` });
  const type = form.createEl("select", { cls: "vrpg-wallet-type" });
  type.createEl("option", { text: "Earned", value: "income" });
  type.createEl("option", { text: "Spent", value: "expense" });
  const amount = form.createEl("input", { type: "text", placeholder: "Amount", cls: "vrpg-wallet-amount" });
  bindMoneyInput(amount);
  const note = form.createEl("input", { type: "text", placeholder: "What for / source", cls: "vrpg-wallet-note" });
  const add = form.createEl("button", { cls: "vrpg-primary vrpg-wallet-add", text: "Add" });
  add.onclick = async () => {
    await addWallet(type.value, amount.value, note.value, selectedKey);
    amount.value = "";
    note.value = "";
  };

  const dayPanel = parent.createDiv({ cls: "vrpg-panel vrpg-bank-day" });
  dayPanel.createDiv({ cls: "vrpg-section", text: "Selected Day" });
  dayPanel.createDiv({ cls: "vrpg-card-title", text: `${selectedKey} · ${day.balance >= 0 ? "+" : ""}${formatMoney(day.balance)} $` });
  dayPanel.createDiv({ cls: "vrpg-subtitle", text: `Income +${formatMoney(day.income)} $ · expenses -${formatMoney(day.expense)} $ · ${day.items.length} transactions` });
  if (!day.items.length) {
    dayPanel.createDiv({ cls: "vrpg-subtitle", text: "No records for this day yet." });
  }
  for (const item of day.items.slice().sort((a, b) => String(b.time || "").localeCompare(String(a.time || "")))) {
    renderWalletRow(dayPanel, item);
  }

  const month = parent.createEl("details", { cls: "vrpg-bank-month" });
  month.createEl("summary").createSpan({ text: `Month History · ${walletMonthLabel(selectedKey)}` });
  renderWalletMonth(month, wallet, selectedKey);
}

module.exports = {
  renderHomeWalletScreen
};
