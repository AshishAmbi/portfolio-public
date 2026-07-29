// projects.js — controller for projects.html
import { renderLayout } from "../components/layout.js";
import { projectCardHtml } from "../components/ui.js";
import { getPublishedProjects } from "../../supabase/database.js";

const CATEGORIES = [
  "All",
  "Embedded Systems",
  "IoT",
  "Web Development",
  "Automation",
  "Electronics",
  "College Project",
  "Hackathon",
];

let allProjects = [];
let activeCategory = "All";
let searchTerm = "";

init();

async function init() {
  await renderLayout("projects");
  renderFilterChips();
  wireSearch();

  const grid = document.getElementById("projects-grid");
  try {
    allProjects = await getPublishedProjects();
    renderGrid();
  } catch (err) {
    grid.innerHTML = '<div class="empty-state">Couldn\'t load projects right now.</div>';
  }

  if (window.AOS) window.AOS.init({ duration: 700, once: true, offset: 60 });
}

function renderFilterChips() {
  const bar = document.getElementById("filter-chips");
  if (!bar) return;
  bar.innerHTML = CATEGORIES.map(
    (cat) => `<button class="filter-chip ${cat === "All" ? "active" : ""}" data-category="${cat}">${cat}</button>`
  ).join("");

  bar.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      bar.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.dataset.category;
      renderGrid();
    });
  });
}

function wireSearch() {
  const input = document.getElementById("project-search");
  if (!input) return;
  input.addEventListener("input", () => {
    searchTerm = input.value.trim().toLowerCase();
    renderGrid();
  });
}

function renderGrid() {
  const grid = document.getElementById("projects-grid");
  const filtered = allProjects.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      p.name?.toLowerCase().includes(searchTerm) ||
      p.shortDescription?.toLowerCase().includes(searchTerm) ||
      (p.technologies ?? []).some((t) => t.toLowerCase().includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = filtered.length
    ? filtered.map(projectCardHtml).join("")
    : '<div class="empty-state">No projects match your search yet — try a different term or category.</div>';
}
