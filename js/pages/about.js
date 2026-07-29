// about.js — controller for about.html
import { renderLayout } from "../components/layout.js";
import { getAboutContent, getResumeInfo } from "../../supabase/database.js";

init();

async function init() {
  await renderLayout("about");

  try {
    const [about, resume] = await Promise.all([getAboutContent(), getResumeInfo()]);
    if (about) render(about);
    const resumeBtn = document.getElementById("resume-download-btn");
    if (resumeBtn && resume?.url) {
      resumeBtn.href = resume.url;
      resumeBtn.removeAttribute("aria-disabled");
    }
  } catch (err) {
    document.getElementById("about-content").innerHTML =
      '<div class="empty-state">Couldn\'t load this page right now.</div>';
  }

  if (window.AOS) window.AOS.init({ duration: 700, once: true, offset: 60 });
}

function render(about) {
  const photo = document.getElementById("about-photo");
  if (photo && about.photoUrl) photo.src = about.photoUrl;

  setText("about-intro", about.introduction);
  setText("about-objective", about.careerObjective);
  setText("about-internship-summary", about.internshipSummary);

  const eduList = document.getElementById("education-list");
  if (eduList) {
    eduList.innerHTML = (about.education ?? [])
      .map(
        (e) => `
        <div class="timeline-item">
          <h4>${escapeHtml(e.degree)}</h4>
          <p>${escapeHtml(e.school)}</p>
          <p class="mono" style="font-size: var(--fs-xs); color: var(--text-faint);">${escapeHtml(e.year)}</p>
        </div>`
      )
      .join("") || '<div class="empty-state">Education details coming soon.</div>';
  }

  const achList = document.getElementById("achievements-list");
  if (achList) {
    achList.innerHTML = (about.achievements ?? [])
      .map((a) => `<li><i class="fa-solid fa-trophy"></i> ${escapeHtml(a)}</li>`)
      .join("") || '<li class="empty-state">Achievements coming soon.</li>';
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
