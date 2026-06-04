// Pure utility helpers for Vibe RPG.
// Extracted from main.js without behavior changes; UI and data mutation stay elsewhere.

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function dateKey(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getFullYear()}`;
}

function timeKey(date = new Date()) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function timeParts(date = new Date()) {
  return {
    hours: String(date.getHours()).padStart(2, "0"),
    minutes: String(date.getMinutes()).padStart(2, "0")
  };
}

function dayPhase(date = new Date()) {
  const hour = date.getHours();
  if (hour < 6) return "ночь";
  if (hour < 12) return "утро";
  if (hour < 18) return "день";
  return "вечер";
}

function parseMoney(value) {
  const normalized = String(value || "").replace(/[\s.']/g, "").replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : NaN;
}

function formatMoney(value) {
  const amount = Math.round(Number(value || 0));
  return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function monthLabel(date = new Date()) {
  return date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
}

function dateFromKey(key) {
  const [day, month, year] = String(key || "").split(".").map(Number);
  return new Date(year || 1970, (month || 1) - 1, day || 1);
}

function walletMonthLabel(key) {
  const date = dateFromKey(key);
  return date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
}

function calendarDays(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const offset = (first.getDay() + 6) % 7;
  const days = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let day = 1; day <= last.getDate(); day++) days.push(day);
  return days;
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

module.exports = {
  clone,
  dateKey,
  timeKey,
  timeParts,
  dayPhase,
  parseMoney,
  formatMoney,
  monthLabel,
  dateFromKey,
  walletMonthLabel,
  calendarDays,
  uid
};
