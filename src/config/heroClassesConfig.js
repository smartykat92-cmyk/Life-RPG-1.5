// Hero class configuration.
// Classes are visual only: no XP, attribute, quest, or achievement bonuses.

const DEFAULT_HERO_CLASS_ID = "habit_warrior";

const HERO_CLASSES = [
  {
    id: "habit_warrior",
    icon: "⚔️",
    title: "Воин привычек",
    description: "Регулярность, ежедневные действия и стабильный прогресс."
  },
  {
    id: "discipline_mage",
    icon: "🧙",
    title: "Маг дисциплины",
    description: "Самоконтроль, концентрация и выполнение целей несмотря на обстоятельства."
  },
  {
    id: "balance_keeper",
    icon: "🌿",
    title: "Хранитель баланса",
    description: "Гармоничное развитие всех сфер жизни."
  },
  {
    id: "change_architect",
    icon: "🔥",
    title: "Архитектор перемен",
    description: "Создание новых привычек и изменение своей жизни шаг за шагом."
  }
];

function getHeroClass(id) {
  return HERO_CLASSES.find(item => item.id === id) || HERO_CLASSES.find(item => item.id === DEFAULT_HERO_CLASS_ID);
}

function getHeroClassLabel(id) {
  const heroClass = getHeroClass(id);
  return `${heroClass.icon} ${heroClass.title}`;
}

function getHeroClassTitle(player = {}) {
  return getHeroClassLabel(resolveHeroClassId(player));
}

function getHeroClassDescription(id) {
  return getHeroClass(id).description;
}

function resolveHeroClassId(player = {}) {
  if (HERO_CLASSES.some(item => item.id === player.classId)) return player.classId;
  const raw = String(player.className || "").trim().toLowerCase();
  if (!raw) return DEFAULT_HERO_CLASS_ID;
  const matched = HERO_CLASSES.find(item => {
    const title = item.title.toLowerCase();
    const label = `${item.icon} ${item.title}`.toLowerCase();
    return raw === title || raw === label || raw.includes(title);
  });
  return matched ? matched.id : DEFAULT_HERO_CLASS_ID;
}

module.exports = {
  HERO_CLASSES,
  DEFAULT_HERO_CLASS_ID,
  getHeroClass,
  getHeroClassLabel,
  getHeroClassTitle,
  getHeroClassDescription,
  resolveHeroClassId
};
