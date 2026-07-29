// experience.js — controller for experience.html
import { renderLayout } from "../components/layout.js";
import { formatDate, initLightbox } from "../components/ui.js";
import { getExperienceByType } from "../../supabase/database.js";

init();

async function init() {
  await renderLayout("experience");
  wireTabs();

  await Promise.all([
    loadInto("internship", "internships-panel", renderInternship),
    loadInto("certification", "certifications-panel", renderCertificate),
    loadInto("achievement", "achievements-panel", renderAchievement),
  ]);

  initLightbox(document.getElementById("achievements-panel"));
  if (window.AOS) window.AOS.init({ duration: 700, once: true, offset: 60 });
}

function wireTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.target).classList.add("active");
    });
  });
}

async function loadInto(type, panelId, renderFn) {
  const panel = document.getElementById(panelId);
  try {
    const items = await getExperienceByType(type);
    panel.innerHTML = items.length
      ? items.map(renderFn).join("")
      : `<div class="empty-state">Nothing here yet.</div>`;
  } catch (err) {
    panel.innerHTML = `<div class="empty-state">Couldn't load this right now.</div>`;
  }
}

function renderInternship(item) {
  return `
    <div class="glass-card exp-item" data-aos="fade-up">
      <div class="exp-item-head">
        <h3>${escapeHtml(item.role)} — ${escapeHtml(item.company)}</h3>
        <span class="exp-duration">${escapeHtml(item.duration ?? "")}</span>
      </div>
      <p>${escapeHtml(item.description ?? "")}</p>
      ${item.certificateUrl ? `<a class="btn btn-ghost btn-sm" style="margin-top: var(--space-3);" href="${item.certificateUrl}" target="_blank" rel="noopener"><i class="fa-solid fa-file-pdf"></i> View Certificate</a>` : ""}
    </div>
  `;
}

function renderCertificate(item) {
  return `
    <div class="glass-card exp-item" style="display:flex; gap: var(--space-5); align-items:center; flex-wrap:wrap;" data-aos="fade-up">
      <img src="${item.image ?? "assets/images/placeholder-cert.jpg"}" alt="${escapeAttr(item.title)}" style="width:120px; height:90px; object-fit:cover; border-radius: var(--radius-sm); flex-shrink:0;" />
      <div style="flex:1;">
        <h3>${escapeHtml(item.title)}</h3>
        <p class="mono" style="font-size: var(--fs-xs); color: var(--text-faint);">${escapeHtml(item.organization ?? "")} · ${escapeHtml(formatDate(item.date))}</p>
        ${item.verifyUrl ? `<a class="btn btn-ghost btn-sm" style="margin-top: var(--space-3);" href="${item.verifyUrl}" target="_blank" rel="noopener">Verify <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ""}
      </div>
    </div>
  `;
}

function renderAchievement(item) {
  return `
    <div class="glass-card exp-item" data-aos="fade-up">
      <div class="exp-item-head">
        <h3>${escapeHtml(item.competition)}</h3>
        <span class="tag tag-signal">${escapeHtml(item.rank ?? "")}</span>
      </div>
      <p>${escapeHtml(item.description ?? "")}</p>
      ${
        (item.photos ?? []).length
          ? `<div class="gallery-grid" style="margin-top: var(--space-4);">${item.photos.map((p) => `<img class="gallery-thumb" src="${p}" alt="${escapeAttr(item.competition)} photo" loading="lazy" />`).join("")}</div>`
          : ""
      }
    </div>
  `;
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function escapeAttr(str = "") {
  return escapeHtml(str).replace(/"/g, "&quot;");
}
