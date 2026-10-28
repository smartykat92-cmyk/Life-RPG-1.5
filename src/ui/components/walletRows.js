// Wallet row and month-history DOM helpers for Vibe RPG.
// They receive formatting/date helpers and callbacks from main-entry.

function renderWalletRow(parent, item, ctx = {}) {
  const formatMoney = ctx.formatMoney;
  const deleteWallet = ctx.deleteWallet || (() => {});
  const row = parent.createDiv({ cls: "vrpg-wallet-row" });
  row.createDiv({ cls: item.type === "income" ? "vrpg-money-positive" : "vrpg-money-negative", text: `${item.type === "income" ? "+" : "-"}${formatMoney(item.amount)} $` });
  row.createDiv({ cls: "vrpg-subtitle", text: `${item.time || "--:--"} · ${item.note || "no comment"}` });
  const remove = row.createEl("button", { cls: "vrpg-danger vrpg-icon-action", text: "Delete" });
  remove.onclick = () => deleteWallet(item.id);
}

function renderWalletMonth(parent, wallet, selectedKey, ctx = {}) {
  const dateKey = ctx.dateKey;
  const dateFromKey = ctx.dateFromKey;
  const formatMoney = ctx.formatMoney;
  const selectedDate = dateFromKey(selectedKey || dateKey());
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();
  const days = new Map();
  for (const item of wallet) {
    const itemDate = dateFromKey(item.date);
    if (itemDate.getMonth() !== month || itemDate.getFullYear() !== year) continue;
    if (!days.has(item.date)) days.set(item.date, []);
    days.get(item.date).push(item);
  }
  if (!days.size) {
    parent.createDiv({ cls: "vrpg-subtitle", text: "No records this month yet." });
    return;
  }
  const sortedDays = Array.from(days.entries()).sort((a, b) => dateFromKey(b[0]).getTime() - dateFromKey(a[0]).getTime());
  for (const [dayKey, items] of sortedDays) {
    const dayDetails = parent.createEl("details", { cls: "vrpg-bank-dayline" });
    dayDetails.open = dayKey === selectedKey;
    const income = items.filter(item => item.type === "income").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expense = items.filter(item => item.type === "expense").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const summary = dayDetails.createEl("summary");
    summary.createSpan({ text: dayKey });
    summary.createSpan({ text: `${income - expense >= 0 ? "+" : ""}${formatMoney(income - expense)} $ · ${items.length}` });
    for (const item of items.slice().sort((a, b) => String(b.time || "").localeCompare(String(a.time || "")))) {
      renderWalletRow(dayDetails, item, ctx);
    }
  }
}

module.exports = {
  renderWalletRow,
  renderWalletMonth
};
