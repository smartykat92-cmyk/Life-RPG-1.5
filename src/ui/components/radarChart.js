// Radar chart DOM component for Vibe RPG hero metrics.
// Keeps the existing SVG structure and classes intact.

function renderRadarChart(parent, metrics) {
  const size = 280;
  const center = size / 2;
  const radius = 92;
  const angle = index => -Math.PI / 2 + index * Math.PI * 2 / metrics.length;
  const point = (index, value = 100) => {
    const r = radius * value / 100;
    const a = angle(index);
    return [center + Math.cos(a) * r, center + Math.sin(a) * r];
  };
  const polygon = metrics.map((metric, index) => point(index, metric[1]).join(",")).join(" ");
  const ns = "http://www.w3.org/2000/svg";
  const wrap = parent.createDiv({ cls: "vrpg-radar-wrap" });
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("class", "vrpg-radar");
  for (const scale of [25, 50, 75, 100]) {
    const ring = document.createElementNS(ns, "polygon");
    ring.setAttribute("points", metrics.map((_, index) => point(index, scale).join(",")).join(" "));
    ring.setAttribute("class", "vrpg-radar-ring");
    svg.appendChild(ring);
  }
  metrics.forEach((metric, index) => {
    const [x, y] = point(index, 112);
    const linePoint = point(index, 100);
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", String(center));
    line.setAttribute("y1", String(center));
    line.setAttribute("x2", String(linePoint[0]));
    line.setAttribute("y2", String(linePoint[1]));
    line.setAttribute("class", "vrpg-radar-axis");
    svg.appendChild(line);
    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", String(x));
    label.setAttribute("y", String(y));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "middle");
    label.setAttribute("class", "vrpg-radar-label");
    label.textContent = metric[0];
    svg.appendChild(label);
  });
  const shape = document.createElementNS(ns, "polygon");
  shape.setAttribute("points", polygon);
  shape.setAttribute("class", "vrpg-radar-shape");
  svg.appendChild(shape);
  wrap.appendChild(svg);
}

module.exports = {
  renderRadarChart
};
