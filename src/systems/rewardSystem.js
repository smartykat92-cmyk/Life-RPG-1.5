// Reward and shop data mutations for Vibe RPG.
// These helpers only mutate data and return context; saving/rendering/Notice stays in main.js.

const { RARITIES } = require("../constants");
const { dateKey, uid } = require("../utils");
const { totals } = require("./xpSystem");

function applyRewardPurchase(data, rewardId) {
  const reward = data.rewards.find(item => item.id === rewardId);
  if (!reward) return { ok: false, data, reward, item: undefined, reason: "not-found" };

  const t = totals(data);
  if (t.balance < reward.cost) {
    return { ok: false, data, reward, item: undefined, reason: "not-enough-xp" };
  }

  const item = {
    id: uid("item"),
    rewardId,
    title: reward.title,
    cost: reward.cost,
    icon: reward.icon,
    date: dateKey(),
    used: false
  };
  data.inventory.push(item);
  return { ok: true, data, reward, item, reason: undefined };
}

function applyRewardAdd(data, rewardInput) {
  const reward = {
    id: uid("reward"),
    title: rewardInput.title,
    cost: rewardInput.cost,
    icon: "🎁",
    rarity: RARITIES[rewardInput.rarity] ? rewardInput.rarity : "common"
  };
  data.rewards.push(reward);
  return { data, reward };
}

function applyRewardDelete(data, rewardId) {
  data.rewards = data.rewards.filter(reward => reward.id !== rewardId);
  return { data, rewardId };
}

module.exports = {
  applyRewardPurchase,
  applyRewardAdd,
  applyRewardDelete
};
