// supabase-config.js
// -----------------------------------------------------------------------
// Central Supabase initialization. Every other module imports `supabase`
// from here so there is exactly one client instance across the whole
// site + admin dashboard.
//
// HOW TO SET THIS UP:
// 1. Go to https://supabase.com/dashboard → create a project.
// 2. Project Settings → API → copy the "Project URL" and "anon public" key.
// 3. Paste the values below.
// 4. Open the SQL Editor and run supabase/schema.sql to create the
//    tables, storage bucket, and access policies.
// 5. Enable Authentication → Providers → Email, then add one admin user
//    under Authentication → Users → Add user (there is no public
//    sign-up flow anywhere in this project, on purpose).
// -----------------------------------------------------------------------

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// TODO: replace with your project's actual values.
const supabaseUrl = "https://javdfbospnwmfnviukoa.supabase.co";
const supabaseAnonKey = "sb_publishable_6a1N0krdQZ4VwHm8Txf4LA_GZ-AZbgP";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// True once you've pasted a real anon key above. While this is false,
// database.js serves instant local sample data instead of hitting the
// network — otherwise the site hangs for many seconds per page trying
// (and failing) to reach a Supabase project that doesn't exist.
export const isConfigured = supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY";
