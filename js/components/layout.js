// layout.js
// -----------------------------------------------------------------------
// Every public page calls renderLayout("home" | "about" | ... ) once on
// load. It injects the navbar into #navbar-root and the footer into
// #footer-root, pulls social links + site title from the Supabase
// `settings` row with id "main" (falling back to sensible defaults if
// that row doesn't exist yet), and wires up the mobile menu +
// scroll-to-top button.
// -----------------------------------------------------------------------

import { getSiteSettings } from "../../supabase/database.js";
import { isConfigured } from "../../supabase/supabase-config.js";

const NAV_LINKS = [
  { href: "index.html", label: "Home", key: "home" },
  { href: "about.html", label: "About", key: "about" },
  { href: "projects.html", label: "Projects", key: "projects" },
  { href: "experience.html", label: "Experience", key: "experience" },
  { href: "skills.html", label: "Skills", key: "skills" },
  { href: "contact.html", label: "Contact", key: "contact" },
];

const DEFAULT_SETTINGS = {
  siteTitle: "Portfolio",
  logoInitials: "EE",
  social: { github: "#", linkedin: "#", email: "#" },
};

export async function renderLayout(activeKey) {
  let settings = DEFAULT_SETTINGS;
  try {
    const remote = await getSiteSettings();
    if (remote) settings = { ...DEFAULT_SETTINGS, ...remote };
  } catch (err) {
    console.warn("Using default settings (Supabase not reachable yet):", err.message);
  }

  renderNavbar(activeKey, settings);
  renderFooter(settings);
  renderDemoBanner();
  wireMobileMenu();
  wireScrollTop();
  hidePageLoader();
}

function renderDemoBanner() {
  if (isConfigured || document.getElementById("demo-banner")) return;
  const bar = document.createElement("div");
  bar.id = "demo-banner";
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; z-index: 101;
    background: linear-gradient(90deg, #3D8BFF, #8B5CF6);
    color: #fff; font-size: 13px; text-align: center; padding: 6px 12px;
    font-family: 'JetBrains Mono', monospace;
  `;
  bar.textContent =
    "Demo mode — showing sample content. Add your Supabase keys in supabase/supabase-config.js to go live.";
  document.body.prepend(bar);

  const navbar = document.querySelector(".navbar");
  if (navbar) navbar.style.top = "28px";
  const navLinks = document.getElementById("nav-links");
  if (navLinks) navLinks.style.top = "calc(var(--nav-height) + 28px)";
  document.body.style.paddingTop = "28px";
}

function renderNavbar(activeKey, settings) {
  const root = document.getElementById("navbar-root");
  if (!root) return;

  root.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <a href="index.html" class="brand">
          <span class="brand-mark">${escapeHtml(settings.logoInitials ?? "EE")}</span>
          <span>${escapeHtml(settings.siteTitle ?? "Portfolio")}</span>
        </a>
        <ul class="nav-links" id="nav-links">
          ${NAV_LINKS.map(
            (link) => `
            <li>
              <a href="${link.href}" class="${link.key === activeKey ? "active" : ""}">
                ${link.label}
              </a>
            </li>`
          ).join("")}
        </ul>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `;
}

function renderFooter(settings) {
  const root = document.getElementById("footer-root");
  if (!root) return;

  const social = settings.social ?? DEFAULT_SETTINGS.social;

  root.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <p class="mono" style="font-size: var(--fs-xs); color: var(--text-faint);">
          &copy; ${new Date().getFullYear()} ${escapeHtml(settings.siteTitle ?? "Portfolio")}. Built with intent.
        </p>
        <div class="social-links">
          ${social.github ? `<a href="${social.github}" target="_blank" rel="noopener" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>` : ""}
          ${social.linkedin ? `<a href="${social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>` : ""}
          ${social.email ? `<a href="mailto:${social.email}" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>` : ""}
        </div>
      </div>
    </footer>
  `;
}

function wireMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

function wireScrollTop() {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function hidePageLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;
  requestAnimationFrame(() => {
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 400);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
