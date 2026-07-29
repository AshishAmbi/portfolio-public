// skills.js — controller for skills.html
import { renderLayout } from "../components/layout.js";
import { getSkillsGrouped } from "../../supabase/database.js";

init();

async function init() {
  await renderLayout("skills");

  const container = document.getElementById("skills-container");
  try {
    const grouped = await getSkillsGrouped();
    const categories = Object.keys(grouped);
    container.innerHTML = categories.length
      ? categories.map((cat) => categoryHtml(cat, grouped[cat])).join("")
      : '<div class="empty-state">Skills coming soon.</div>';

    requestAnimationFrame(() => {
      container.querySelectorAll(".skill-bar-fill").forEach((bar) => {
        bar.style.width = bar.dataset.pct + "%";
      });
    });
  } catch (err) {
    container.innerHTML = '<div class="empty-state">Couldn\'t load skills right now.</div>';
  }

  if (window.AOS) window.AOS.init({ duration: 700, once: true, offset: 60 });
}

function categoryHtml(category, skills) {
  return `
    <div class="details-block" data-aos="fade-up">
      <h3>${escapeHtml(category)}</h3>
      <div class="glass-card" style="padding: var(--space-6);">
        ${skills.map(skillRowHtml).join("")}
      </div>
    </div>
  `;
}

function skillRowHtml(skill) {
  return `
    <div class="skill-row">
      <div class="skill-row-head">
        <span class="skill-name"><i class="${skill.icon ?? "fa-solid fa-microchip"}"></i> ${escapeHtml(skill.name)}</span>
        <span class="skill-pct">${skill.percentage ?? 0}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-pct="${skill.percentage ?? 0}"></div>
      </div>
    </div>
  `;
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
