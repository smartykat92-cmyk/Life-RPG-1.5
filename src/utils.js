// Pure utility helpers for Vibe RPG / Grindstone.
// Updated: 12hr clock, MM/DD/YYYY display format, removed wallet/money helpers.
// IMPORTANT: dateKey() storage format stays DD.MM.YYYY to preserve existing data.

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// Storage key — DD.MM.YYYY — DO NOT CHANGE without migration
function dateKey(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getFullYear()}`;
}

// Display date — MM/DD/YYYY for user-facing UI
function displayDate(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${mm}/${dd}/${date.getFullYear()}`;
}

// Display date from a storage key
function displayDateFromKey(key) {
  const date = dateFromKey(key);
  return displayDate(date);
}

// 12hr time display — e.g. "2:30 PM"
function timeKey(date = new Date()) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

// 12hr time parts for UI components
function timeParts(date = new Date()) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return {
    hours: String(hours),
    minutes,
    ampm
  };
}

function dayPhase(date = new Date()) {
  const hour = date.getHours();
  if (hour < 6) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function monthLabel(date = new Date()) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Parse storage key DD.MM.YYYY back to Date
function dateFromKey(key) {
  const [day, month, year] = String(key || "").split(".").map(Number);
  return new Date(year || 1970, (month || 1) - 1, day || 1);
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
  displayDate,
  displayDateFromKey,
  timeKey,
  timeParts,
  dayPhase,
  monthLabel,
  dateFromKey,
  calendarDays,
  uid
};
