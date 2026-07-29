// contact.js — controller for contact.html
import { renderLayout } from "../components/layout.js";
import { wireContactForm } from "../components/ui.js";
import { getSiteSettings } from "../../supabase/database.js";

init();

async function init() {
  await renderLayout("contact");
  wireContactForm(document.getElementById("contact-form"));

  try {
    const settings = await getSiteSettings();
    if (settings) {
      setText("contact-email", settings.contactEmail ?? settings.social?.email);
      setText("contact-phone", settings.contactPhone);
      setText("contact-location", settings.contactLocation);
      const linkedin = document.getElementById("contact-linkedin");
      if (linkedin && settings.social?.linkedin) linkedin.href = settings.social.linkedin;
    }
  } catch (err) {
    console.warn("Contact info not loaded:", err.message);
  }

  if (window.AOS) window.AOS.init({ duration: 700, once: true, offset: 60 });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}
