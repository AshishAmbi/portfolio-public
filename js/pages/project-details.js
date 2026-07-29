// project-details.js — controller for project.html
import { renderLayout } from "../components/layout.js";
import { initLightbox } from "../components/ui.js";
import { getProjectById } from "../../supabase/database.js";

init();

async function init() {
  await renderLayout("projects");

  const id = new URLSearchParams(window.location.search).get("id");
  const main = document.getElementById("project-details-content");

  if (!id) {
    main.innerHTML = notFoundHtml();
    return;
  }

  try {
    const project = await getProjectById(id);
    if (!project) {
      main.innerHTML = notFoundHtml();
    } else {
      render(project);
      initLightbox(main);
    }
  } catch (err) {
    main.innerHTML = '<div class="container section"><div class="empty-state">Couldn\'t load this project right now.</div></div>';
  }

  if (window.AOS) window.AOS.init({ duration: 700, once: true, offset: 60 });
}

function render(project) {
  document.title = `${project.name} · Project`;
  const main = document.getElementById("project-details-content");

  main.innerHTML = `
    <div class="container" style="padding-top: calc(var(--nav-height) + var(--space-6));">
      <div class="project-banner" data-aos="fade-up">
        <img src="${project.banner ?? project.thumbnail ?? "assets/images/placeholder-project.jpg"}" alt="${escapeAttr(project.name)} banner" />
      </div>

      <div class="project-details-head" data-aos="fade-up">
        <div>
          <span class="tag tag-signal">${escapeHtml(project.category ?? "Project")}</span>
          <h1 style="font-size: var(--fs-2xl); margin-top: var(--space-2);">${escapeHtml(project.name)}</h1>
        </div>
        <div class="project-details-actions">
          ${project.githubUrl ? `<a class="btn btn-ghost" href="${project.githubUrl}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub Repository</a>` : ""}
          ${project.liveDemoUrl ? `<a class="btn btn-primary" href="${project.liveDemoUrl}" target="_blank" rel="noopener"><i class="fa-solid fa-play"></i> Live Demo</a>` : ""}
        </div>
      </div>

      <div class="details-block" data-aos="fade-up">
        <h3>Overview</h3>
        <p>${escapeHtml(project.fullDescription ?? project.shortDescription ?? "")}</p>
      </div>

      ${
        (project.gallery ?? []).length
          ? `
      <div class="details-block" data-aos="fade-up">
        <h3>Gallery</h3>
        <div class="gallery-grid">
          ${project.gallery.map((src) => `<img class="gallery-thumb" src="${src}" alt="${escapeAttr(project.name)} gallery image" loading="lazy" />`).join("")}
        </div>
      </div>`
          : ""
      }

      ${
        (project.videos ?? []).length
          ? `
      <div class="details-block" data-aos="fade-up">
        <h3>Videos</h3>
        ${project.videos.map((v) => `<div class="video-wrapper"><video src="${v}" controls></video></div>`).join("")}
      </div>`
          : ""
      }

      ${
        project.documentationUrl
          ? `
      <div class="details-block" data-aos="fade-up">
        <h3>Documentation</h3>
        <a class="btn btn-ghost" href="${project.documentationUrl}" target="_blank" rel="noopener">
          <i class="fa-solid fa-file-pdf"></i> View / Download PDF
        </a>
      </div>`
          : ""
      }

      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: var(--space-7);">
        ${
          (project.hardware ?? []).length
            ? `
        <div class="details-block" data-aos="fade-up">
          <h3>Hardware Used</h3>
          <div class="tag-cluster">${project.hardware.map((h) => `<span class="tag">${escapeHtml(h)}</span>`).join("")}</div>
        </div>`
            : ""
        }
        ${
          (project.software ?? []).length
            ? `
        <div class="details-block" data-aos="fade-up">
          <h3>Software Used</h3>
          <div class="tag-cluster">${project.software.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("")}</div>
        </div>`
            : ""
        }
      </div>

      ${
        (project.technologies ?? []).length
          ? `
      <div class="details-block" data-aos="fade-up">
        <h3>Technologies</h3>
        <div class="tag-cluster">${project.technologies.map((t) => `<span class="tag tag-signal mono">${escapeHtml(t)}</span>`).join("")}</div>
      </div>`
          : ""
      }

      <div style="text-align:center; margin-block: var(--space-7);">
        <a href="projects.html" class="btn btn-ghost"><i class="fa-solid fa-arrow-left"></i> Back to all projects</a>
      </div>
    </div>
  `;
}

function notFoundHtml() {
  return `
    <div class="container section" style="padding-top: calc(var(--nav-height) + var(--space-6)); text-align:center;">
      <div class="empty-state">
        <h3>Project not found</h3>
        <p>It may have been unpublished or removed.</p>
        <a href="projects.html" class="btn btn-ghost" style="margin-top: var(--space-4);">Back to all projects</a>
      </div>
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
