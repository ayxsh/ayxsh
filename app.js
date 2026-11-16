// ---- CONFIG: set these to your GitHub details ----
const CONFIG = {
  owner: "ayxsh",
  repo: "ayxsh.github.io",
  branch: "main"
};------------------------------------------------

const FILES = { culture: "culture.json", benefits: "benefits.json" };

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text; // textContent: safe against injected HTML
  return node;
}

function renderItems(parent, items) {
  items.forEach(it => {
    const row = el("div", "item");
    row.append(el("h3", "", it.title), el("p", "", it.description));
    parent.append(row);
  });
}

function renderCulture(root, data) {
  root.replaceChildren();
  if (data.intro) root.append(el("p", "lead", data.intro));
  (data.sections || []).forEach(sec => {
    const g = el("div", "group");
    if (sec.heading) g.append(el("h3", "", sec.heading));
    renderItems(g, sec.items || []);
    root.append(g);
  });
}

function renderBenefits(root, data) {
  root.replaceChildren();
  if (data.intro) root.append(el("p", "lead", data.intro));
  (data.categories || []).forEach(cat => {
    const g = el("div", "group");
    g.append(el("h3", "", cat.name));
    renderItems(g, cat.items || []);
    root.append(g);
  });
}

async function load(key, renderer) {
  const root = document.getElementById(key + "-content");
  try {
    const res = await fetch(FILES[key], { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status + " " + res.statusText);
    renderer(root, await res.json());
  } catch (err) {
    root.replaceChildren(el("p", "error",
      "Could not load " + FILES[key] + ". If you opened this file directly, serve it over http (see README). " + err.message));
  }
}

// Show when the data file last changed in Git (uses the public GitHub API; fails quietly).
async function showLastCommit(key) {
  const target = document.querySelector('[data-source="' + key + '"]');
  if (!target || CONFIG.owner.startsWith("YOUR-")) return;
  const fileUrl = "https://github.com/" + CONFIG.owner + "/" + CONFIG.repo + "/blob/" + CONFIG.branch + "/" + FILES[key];
  try {
    const api = "https://api.github.com/repos/" + CONFIG.owner + "/" + CONFIG.repo +
      "/commits?per_page=1&path=" + encodeURIComponent(FILES[key]);
    const res = await fetch(api);
    if (!res.ok) throw new Error("api");
    const [c] = await res.json();
    const date = new Date(c.commit.committer.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    target.append("Last updated " + date + " · ");
  } catch (_) { /* ignore */ }
  const a = el("a", "", "View source in Git");
  a.href = fileUrl;
  target.append(a);
}

load("culture", renderCulture);
load("benefits", renderBenefits);
Object.keys(FILES).forEach(showLastCommit);
if (!CONFIG.owner.startsWith("YOUR-")) {
  document.getElementById("repo-link").href = "https://github.com/" + CONFIG.owner + "/" + CONFIG.repo;
}
