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
    ["Общий баланс", `${formatMoney(all.balance)} ₽`],
    ["Доходы", `+${formatMoney(all.income)} ₽`],
    ["Расходы", `-${formatMoney(all.expense)} ₽`]
  ].forEach(([label, value]) => {
    const card = top.createDiv({ cls: "vrpg-bank-metric" });
    card.createDiv({ cls: "vrpg-section", text: label });
    card.createDiv({ cls: "vrpg-stat-value", text: value });
  });

  const form = parent.createDiv({ cls: "vrpg-panel vrpg-inline-form vrpg-wallet-form" });
  form.createDiv({ cls: "vrpg-section", text: `Запись за ${selectedKey}` });
  const type = form.createEl("select", { cls: "vrpg-wallet-type" });
  type.createEl("option", { text: "Заработал", value: "income" });
  type.createEl("option", { text: "Потратил", value: "expense" });
  const amount = form.createEl("input", { type: "text", placeholder: "Сумма", cls: "vrpg-wallet-amount" });
  bindMoneyInput(amount);
  const note = form.createEl("input", { type: "text", placeholder: "На что / откуда", cls: "vrpg-wallet-note" });
  const add = form.createEl("button", { cls: "vrpg-primary vrpg-wallet-add", text: "Добавить" });
  add.onclick = async () => {
    await addWallet(type.value, amount.value, note.value, selectedKey);
    amount.value = "";
    note.value = "";
  };

  const dayPanel = parent.createDiv({ cls: "vrpg-panel vrpg-bank-day" });
  dayPanel.createDiv({ cls: "vrpg-section", text: "Выбранный день" });
  dayPanel.createDiv({ cls: "vrpg-card-title", text: `${selectedKey} · ${day.balance >= 0 ? "+" : ""}${formatMoney(day.balance)} ₽` });
  dayPanel.createDiv({ cls: "vrpg-subtitle", text: `Доходы +${formatMoney(day.income)} ₽ · расходы -${formatMoney(day.expense)} ₽ · ${day.items.length} операций` });
  if (!day.items.length) {
    dayPanel.createDiv({ cls: "vrpg-subtitle", text: "В этот день записей пока нет." });
  }
  for (const item of day.items.slice().sort((a, b) => String(b.time || "").localeCompare(String(a.time || "")))) {
    renderWalletRow(dayPanel, item);
  }

  const month = parent.createEl("details", { cls: "vrpg-bank-month" });
  month.createEl("summary").createSpan({ text: `История месяца · ${walletMonthLabel(selectedKey)}` });
  renderWalletMonth(month, wallet, selectedKey);
}

module.exports = {
  renderHomeWalletScreen
};
