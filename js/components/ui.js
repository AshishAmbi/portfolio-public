// ui.js
// -----------------------------------------------------------------------
// Small, dependency-free UI utilities shared across public pages:
// toasts, a project card template, an image lightbox, and contact-form
// validation + submission.
// -----------------------------------------------------------------------

import { submitMessage } from "../../supabase/database.js";

/** Shows a brief toast at the bottom of the screen. type: "success" | "error" */
export function toast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText =
      "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:999;display:flex;flex-direction:column;gap:8px;";
    document.body.appendChild(container);
  }

  const node = document.createElement("div");
  const color = type === "error" ? "#f87171" : "#4ade80";
  node.textContent = message;
  node.style.cssText = `
    background: #10141f; border: 1px solid ${color}55; color: #e9ecf5;
    padding: 12px 20px; border-radius: 12px; font-size: 14px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4); opacity: 0; transition: opacity .25s ease;
  `;
  container.appendChild(node);
  requestAnimationFrame(() => (node.style.opacity = "1"));
  setTimeout(() => {
    node.style.opacity = "0";
    setTimeout(() => node.remove(), 300);
  }, 3200);
}

/** Renders a project card. `project` is a database row {id, name, shortDescription, thumbnail, technologies, category}. */
export function projectCardHtml(project) {
  const techs = (project.technologies ?? []).slice(0, 4);
  return `
    <article class="glass-card project-card" data-category="${escapeAttr(project.category ?? "")}" data-aos="fade-up">
      <div class="project-card-thumb">
        <img src="${project.thumbnail ?? "assets/images/placeholder-project.jpg"}" alt="${escapeAttr(project.name)} thumbnail" loading="lazy" />
      </div>
      <div class="project-card-body">
        <span class="tag tag-signal">${escapeAttr(project.category ?? "Project")}</span>
        <h3>${escapeHtml(project.name)}</h3>
        <p>${escapeHtml(project.shortDescription ?? "")}</p>
        <div class="project-card-tags">
          ${techs.map((t) => `<span class="tag mono">${escapeHtml(t)}</span>`).join("")}
        </div>
        <a class="btn btn-ghost btn-sm" href="project.html?id=${project.id}">
          View details <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </article>
  `;
}

/** Wires up click-to-open on any `.gallery-thumb` inside `root`, building a simple lightbox. */
export function initLightbox(root = document) {
  let overlay = document.getElementById("lightbox-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "lightbox-overlay";
    overlay.className = "lightbox-overlay";
    overlay.innerHTML = `<img id="lightbox-img" alt="" /><button id="lightbox-close" aria-label="Close">&times;</button>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.id === "lightbox-close") {
        overlay.classList.remove("open");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") overlay.classList.remove("open");
    });
  }

  root.querySelectorAll(".gallery-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document.getElementById("lightbox-img").src = thumb.src || thumb.dataset.full;
      overlay.classList.add("open");
    });
  });
}

/** Wires validation + Supabase submission on a contact `<form>` element. */
export function wireContactForm(formEl) {
  if (!formEl) return;

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formEl).entries());
    const errors = validateContactForm(data);

    clearFieldErrors(formEl);
    if (Object.keys(errors).length) {
      showFieldErrors(formEl, errors);
      return;
    }

    const submitBtn = formEl.querySelector('[type="submit"]');
    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      await submitMessage(data);
      toast("Message sent — I'll get back to you soon.");
      formEl.reset();
    } catch (err) {
      toast("Couldn't send that. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
    }
  });
}

function validateContactForm({ name, email, message }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = "Please enter your name.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email.";
  if (!message || message.trim().length < 10) errors.message = "Message should be at least 10 characters.";
  return errors;
}

function showFieldErrors(formEl, errors) {
  for (const [field, msg] of Object.entries(errors)) {
    const wrapper = formEl.querySelector(`[data-field="${field}"]`);
    if (!wrapper) continue;
    wrapper.classList.add("invalid");
    const errorEl = wrapper.querySelector(".field-error");
    if (errorEl) errorEl.textContent = msg;
  }
}

function clearFieldErrors(formEl) {
  formEl.querySelectorAll(".field.invalid").forEach((f) => f.classList.remove("invalid"));
}

export function formatDate(value) {
  if (!value) return "";
  const date = value?.toDate ? value.toDate() : new Date(value);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str = "") {
  return escapeHtml(str).replace(/"/g, "&quot;");
}
