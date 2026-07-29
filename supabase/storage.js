// storage.js
// -----------------------------------------------------------------------
// Supabase Storage helpers. Used almost exclusively by the admin
// dashboard (uploading thumbnails, galleries, resume PDFs, etc). The
// public site only ever reads the resulting public URLs that get saved
// onto database rows.
//
// Everything lives in one public bucket ("portfolio"), organized into
// folders that mirror STORAGE_PATHS below. Create the bucket + policies
// by running supabase/schema.sql once in the Supabase SQL Editor.
// -----------------------------------------------------------------------

import { supabase } from "./supabase-config.js";

const BUCKET = "portfolio";

/** Storage folders, mirrored from the spec so paths never get typo'd ad hoc. */
export const STORAGE_PATHS = {
  PROJECT_IMAGES: "project-images",
  PROJECT_VIDEOS: "project-videos",
  DOCUMENTS: "documents",
  RESUME: "resume",
  CERTIFICATES: "certificates",
  PROFILE: "profile",
};

/**
 * Uploads a single file and reports progress.
 * @param {File} file
 * @param {string} folder - one of STORAGE_PATHS
 * @param {(percent: number) => void} [onProgress]
 * @returns {Promise<{ url: string, path: string }>}
 */
export async function uploadFile(file, folder, onProgress) {
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  const path = `${folder}/${safeName}`;

  // Note: the Supabase JS client doesn't expose granular upload progress
  // the way Firebase's resumable uploads did, so we report start/finish.
  onProgress?.(0);

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message ?? "Upload failed");

  onProgress?.(100);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/** Uploads multiple files in parallel (e.g. a project's image gallery). */
export async function uploadMultiple(files, folder, onProgress) {
  const uploads = Array.from(files).map((file) => uploadFile(file, folder));
  return Promise.all(uploads);
}

/** Deletes a file from Storage given the path returned by uploadFile(). */
export async function deleteFile(path) {
  try {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw error;
  } catch (err) {
    // Non-fatal: file may already be gone. Log and move on.
    console.warn("Storage delete skipped:", err.message);
  }
}
