// Small button DOM helper for Vibe RPG.
// Kept generic for later UI extraction; callbacks stay in render/orchestration code.

function createButton(parent, options = {}) {
  const button = parent.createEl("button", {
    cls: options.className || "",
    text: options.text || ""
  });
  if (options.disabled !== undefined) button.disabled = Boolean(options.disabled);
  if (typeof options.onClick === "function") button.onclick = options.onClick;
  return button;
}

module.exports = {
  createButton
};
