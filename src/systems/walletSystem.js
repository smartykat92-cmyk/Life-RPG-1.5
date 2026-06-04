// Wallet and bank system for Vibe RPG.
// Owns income, expense, balance, and optional daily wallet filtering.
// Keep behavior compatible with the previous main.js implementation.

const { timeKey, uid } = require("../utils");

function walletStats(wallet, key = null) {
  let income = 0;
  let expense = 0;
  const items = key ? wallet.filter(item => item.date === key) : wallet;
  for (const item of items) {
    if (item.type === "income") income += Number(item.amount || 0);
    if (item.type === "expense") expense += Number(item.amount || 0);
  }
  return {
    items,
    income,
    expense,
    balance: income - expense
  };
}

function applyWalletAdd(data, walletInput) {
  const item = {
    id: uid("money"),
    type: walletInput.type,
    amount: walletInput.amount,
    note: walletInput.note || "",
    date: walletInput.date,
    time: timeKey()
  };
  data.wallet.push(item);
  return { data, item };
}

function applyWalletDelete(data, walletId) {
  data.wallet = data.wallet.filter(item => item.id !== walletId);
  return { data, walletId };
}

function applyWalletUpdate(data, walletId, patch) {
  const item = data.wallet.find(entry => entry.id === walletId);
  if (!item) return { data, item };
  const allowed = ["type", "amount", "note", "date", "time"];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) item[key] = patch[key];
  }
  return { data, item };
}

module.exports = {
  walletStats,
  applyWalletAdd,
  applyWalletDelete,
  applyWalletUpdate
};
