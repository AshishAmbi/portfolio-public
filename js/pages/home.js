// home.js — controller for index.html
import { renderLayout } from "../components/layout.js";
import { projectCardHtml, wireContactForm, formatDate } from "../components/ui.js";
import {
  getFeaturedProjects,
  getSkillsGrouped,
  getLatestCertificate,
  getLatestInternship,
  getAboutContent,
  getResumeInfo,
} from "../../supabase/database.js";

init();

async function init() {
  await renderLayout("home");
  wireContactForm(document.getElementById("contact-form"));

  await Promise.all([
    loadHeroContent(),
    loadFeaturedProjects(),
    loadSkillsPreview(),
    loadLatestCertificate(),
    loadLatestInternship(),
  ]);

  if (window.AOS) window.AOS.init({ duration: 700, once: true, offset: 60 });
}

async function loadHeroContent() {
  try {
    const [about, resume] = await Promise.all([getAboutContent(), getResumeInfo()]);

    if (about) {
      const nameEl = document.getElementById("hero-name");
      const titleEl = document.getElementById("hero-title");
      const introEl = document.getElementById("hero-intro");
      const photoEl = document.getElementById("hero-photo");
      if (nameEl && about.name) nameEl.textContent = about.name;
      if (titleEl && about.title) titleEl.textContent = about.title;
      if (introEl && about.introduction) introEl.textContent = about.introduction;
      if (photoEl && about.photoUrl) photoEl.src = about.photoUrl;
    }

    const resumeBtn = document.getElementById("resume-download-btn");
    if (resumeBtn && resume?.url) {
      resumeBtn.href = resume.url;
      resumeBtn.removeAttribute("aria-disabled");
    }
  } catch (err) {
    console.warn("Hero content not loaded (Supabase not set up yet):", err.message);
  }
}

async function loadFeaturedProjects() {
  const grid = document.getElementById("featured-projects-grid");
  if (!grid) return;
  try {
    const projects = await getFeaturedProjects();
    grid.innerHTML = projects.length
      ? projects.map(projectCardHtml).join("")
      : emptyState("No featured projects yet — check back soon.");
  } catch (err) {
    grid.innerHTML = emptyState("Couldn't load projects right now.");
  }
}

async function loadSkillsPreview() {
  const container = document.getElementById("skills-preview-list");
  if (!container) return;
  try {
    const grouped = await getSkillsGrouped();
    const flat = Object.values(grouped).flat().slice(0, 6);
    container.innerHTML = flat.length
      ? flat.map(skillRowHtml).join("")
      : emptyState("Skills coming soon.");
    requestAnimationFrame(() => {
      container.querySelectorAll(".skill-bar-fill").forEach((bar) => {
        bar.style.width = bar.dataset.pct + "%";
      });
    });
  } catch (err) {
    container.innerHTML = emptyState("Couldn't load skills right now.");
  }
}

async function loadLatestCertificate() {
  const container = document.getElementById("latest-certificate-card");
  if (!container) return;
  try {
    const cert = await getLatestCertificate();
    container.innerHTML = cert
      ? `
        <img src="${cert.image ?? "assets/images/placeholder-cert.jpg"}" alt="${escapeAttr(cert.title ?? "Certificate")}" />
        <div class="project-card-body">
          <span class="tag tag-signal">${escapeHtml(cert.organization ?? "")}</span>
          <h3>${escapeHtml(cert.title ?? "")}</h3>
          <p>${escapeHtml(formatDate(cert.date))}</p>
        </div>
      `
      : emptyState("No certificates added yet.");
  } catch (err) {
    container.innerHTML = emptyState("Couldn't load certificate right now.");
  }
}

async function loadLatestInternship() {
  const container = document.getElementById("latest-internship-card");
  if (!container) return;
  try {
    const internship = await getLatestInternship();
    container.innerHTML = internship
      ? `
        <div class="project-card-body">
          <span class="tag tag-signal">${escapeHtml(internship.company ?? "")}</span>
          <h3>${escapeHtml(internship.role ?? "")}</h3>
          <p class="mono" style="color: var(--text-faint); font-size: var(--fs-xs);">${escapeHtml(internship.duration ?? "")}</p>
          <p>${escapeHtml(internship.description ?? "")}</p>
        </div>
      `
      : emptyState("No internships added yet.");
  } catch (err) {
    container.innerHTML = emptyState("Couldn't load internship right now.");
  }
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

function emptyState(message) {
  return `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function escapeAttr(str = "") {
  return escapeHtml(str).replace(/"/g, "&quot;");
}
