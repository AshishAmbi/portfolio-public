// database.js
// -----------------------------------------------------------------------
// All Supabase reads/writes go through this module. Generic helpers
// (getAll, getOne, add, update, remove) work against any table; the
// named exports at the bottom add the query shape each page needs
// (e.g. "only published projects", "featured only", "unread messages").
//
// Each table has a fixed shape: id (text), data (jsonb — holds all the
// page-specific fields), created_at, updated_at. Reads flatten `data`
// back onto the returned object as camelCase fields (createdAt/updatedAt),
// exactly like the documents this replaced.
// -----------------------------------------------------------------------

import { supabase, isConfigured } from "./supabase-config.js";
import {
  sampleProjects,
  sampleExperience,
  sampleSkills,
  sampleAbout,
  sampleResume,
  sampleSettings,
} from "./sample-data.js";

/** Rejects after `ms` so a misconfigured/unreachable Supabase project
 *  can never hang a page indefinitely — pages fail fast and show their
 *  empty state instead. */
function withTimeout(promise, ms = 6000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), ms)),
  ]);
}

/** Table names, kept in one place so a typo breaks loudly, not silently. */
export const COLLECTIONS = {
  PROJECTS: "projects",
  EXPERIENCE: "experience", // rows have a `type` field: internship | certification | achievement
  SKILLS: "skills",
  ABOUT: "about", // single row, id: "main"
  RESUME: "resume", // single row, id: "main"
  MESSAGES: "messages",
  SETTINGS: "settings", // single row, id: "main"
};

function rowToDoc(row) {
  if (!row) return null;
  return { id: row.id, ...(row.data ?? {}), createdAt: row.created_at, updatedAt: row.updated_at };
}

async function run(promise) {
  const { data, error } = await withTimeout(promise);
  if (error) throw new Error(error.message ?? "Request failed");
  return data;
}

// ---------- Generic CRUD ----------

export async function getAll(tableName) {
  const rows = await run(
    supabase.from(tableName).select("*").order("created_at", { ascending: false })
  );
  return (rows ?? []).map(rowToDoc);
}

export async function getOne(tableName, id) {
  const row = await run(supabase.from(tableName).select("*").eq("id", id).maybeSingle());
  return rowToDoc(row);
}

export async function add(tableName, data) {
  const row = await run(supabase.from(tableName).insert({ data }).select("id").single());
  return row.id;
}

export async function update(tableName, id, data) {
  // Merge with the existing row so a partial payload doesn't wipe out
  // fields the caller didn't touch (mirrors Firestore's updateDoc).
  const existing = await run(supabase.from(tableName).select("data").eq("id", id).maybeSingle());
  const merged = { ...(existing?.data ?? {}), ...data };
  await run(supabase.from(tableName).update({ data: merged }).eq("id", id));
}

export async function remove(tableName, id) {
  await run(supabase.from(tableName).delete().eq("id", id));
}

/** Creates or overwrites a fixed-id row (about/main, resume/main, settings/main). */
export async function saveSingleton(tableName, id, data) {
  const existing = await run(supabase.from(tableName).select("data").eq("id", id).maybeSingle());
  const merged = { ...(existing?.data ?? {}), ...data };
  await run(supabase.from(tableName).upsert({ id, data: merged }));
}

// ---------- Public-site query helpers ----------

/** All published projects, newest first. */
export function getPublishedProjects() {
  if (!isConfigured) return Promise.resolve(sampleProjects.filter((p) => p.published));
  return run(
    supabase
      .from(COLLECTIONS.PROJECTS)
      .select("*")
      .eq("data->>published", "true")
      .order("created_at", { ascending: false })
  ).then((rows) => (rows ?? []).map(rowToDoc));
}

/** The 3 featured projects for the Home page. */
export function getFeaturedProjects() {
  if (!isConfigured)
    return Promise.resolve(sampleProjects.filter((p) => p.published && p.featured).slice(0, 3));
  return run(
    supabase
      .from(COLLECTIONS.PROJECTS)
      .select("*")
      .eq("data->>published", "true")
      .eq("data->>featured", "true")
      .order("created_at", { ascending: false })
      .limit(3)
  ).then((rows) => (rows ?? []).map(rowToDoc));
}

/** Single project by id, for the Project Details page. */
export function getProjectById(id) {
  if (!isConfigured) return Promise.resolve(sampleProjects.find((p) => p.id === id) ?? null);
  return getOne(COLLECTIONS.PROJECTS, id);
}

/** All experience rows of a given type, e.g. "internship" | "certification" | "achievement". */
export function getExperienceByType(type) {
  if (!isConfigured) return Promise.resolve(sampleExperience[type] ?? []);
  return run(
    supabase
      .from(COLLECTIONS.EXPERIENCE)
      .select("*")
      .eq("data->>type", type)
      .order("created_at", { ascending: false })
  ).then((rows) => (rows ?? []).map(rowToDoc));
}

/** Most recent certification, for the Home page preview. */
export async function getLatestCertificate() {
  const list = await getExperienceByType("certification");
  return list[0] ?? null;
}

/** Most recent internship, for the Home page preview. */
export async function getLatestInternship() {
  const list = await getExperienceByType("internship");
  return list[0] ?? null;
}

/** All skills, grouped by category client-side. */
export async function getSkillsGrouped() {
  if (!isConfigured) return sampleSkills;
  const rows = await run(supabase.from(COLLECTIONS.SKILLS).select("*"));
  const skills = (rows ?? []).map(rowToDoc);
  return skills.reduce((groups, skill) => {
    (groups[skill.category] ??= []).push(skill);
    return groups;
  }, {});
}

export const getAboutContent = () =>
  !isConfigured ? Promise.resolve(sampleAbout) : getOne(COLLECTIONS.ABOUT, "main");
export const getResumeInfo = () =>
  !isConfigured ? Promise.resolve(sampleResume) : getOne(COLLECTIONS.RESUME, "main");
export const getSiteSettings = () =>
  !isConfigured ? Promise.resolve(sampleSettings) : getOne(COLLECTIONS.SETTINGS, "main");

/** Saves a contact form submission. */
export function submitMessage({ name, email, subject, message }) {
  if (!isConfigured) {
    return Promise.reject(
      new Error("Demo mode: connect Supabase in supabase-config.js to actually receive messages.")
    );
  }
  return add(COLLECTIONS.MESSAGES, {
    name,
    email,
    subject: subject ?? "",
    message,
    read: false,
  });
}

// ---------- Admin-only helpers ----------

/** All contact messages, newest first. Admin dashboard only. */
export function getMessages() {
  return getAll(COLLECTIONS.MESSAGES);
}

export function setMessageRead(id, read = true) {
  return update(COLLECTIONS.MESSAGES, id, { read });
}

export function deleteMessage(id) {
  return remove(COLLECTIONS.MESSAGES, id);
}

/** Counts for the admin dashboard home cards. */
export async function getDashboardCounts() {
  const [projects, internships, certifications, achievements, skills, messages] = await Promise.all([
    getAll(COLLECTIONS.PROJECTS),
    getExperienceByType("internship"),
    getExperienceByType("certification"),
    getExperienceByType("achievement"),
    getAll(COLLECTIONS.SKILLS),
    getAll(COLLECTIONS.MESSAGES),
  ]);
  return {
    totalProjects: projects.length,
    totalCertificates: certifications.length,
    totalInternships: internships.length,
    totalAchievements: achievements.length,
    totalSkills: skills.length,
    totalMessages: messages.length,
    unreadMessages: messages.filter((m) => !m.read).length,
  };
}
