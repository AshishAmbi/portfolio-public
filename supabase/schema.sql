-- schema.sql
-- -----------------------------------------------------------------------
-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.
--
-- Creates the tables, storage bucket, and Row Level Security policies
-- for the portfolio site + admin dashboard. Each table has a fixed
-- shape: id (text), data (jsonb — holds all the page-specific fields),
-- created_at, updated_at.
--
-- Access model (mirrors the original Firestore/Storage rules): anyone
-- can READ published/public content; only a signed-in admin (any
-- authenticated user, since there's no public sign-up in this project)
-- can WRITE. Contact messages are the one exception: anyone can CREATE
-- a message (the public contact form), but only the admin can
-- read/update/delete them.
-- -----------------------------------------------------------------------

create extension if not exists pgcrypto;

-- ---------- Tables ----------

create table if not exists projects (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists experience (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb, -- data.type: internship | certification | achievement
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists skills (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists about (
  id text primary key, -- always "main"
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists resume (
  id text primary key, -- always "main"
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists settings (
  id text primary key, -- always "main"
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id text primary key default gen_random_uuid()::text,
  data jsonb not null default '{}'::jsonb, -- data.read: boolean
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every UPDATE.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array['projects','experience','skills','about','resume','settings','messages']
  loop
    execute format('drop trigger if exists trg_set_updated_at on %I', t);
    execute format(
      'create trigger trg_set_updated_at before update on %I for each row execute function set_updated_at()',
      t
    );
  end loop;
end $$;

-- ---------- Row Level Security ----------

alter table projects   enable row level security;
alter table experience enable row level security;
alter table skills     enable row level security;
alter table about      enable row level security;
alter table resume     enable row level security;
alter table settings   enable row level security;
alter table messages   enable row level security;

-- projects: public can read only published ones; admin can read/write everything.
create policy "projects_public_read" on projects for select
  using (coalesce((data->>'published')::boolean, false) or auth.role() = 'authenticated');
create policy "projects_admin_insert" on projects for insert to authenticated with check (true);
create policy "projects_admin_update" on projects for update to authenticated using (true);
create policy "projects_admin_delete" on projects for delete to authenticated using (true);

-- experience, skills, about, resume, settings: readable by everyone, writable by admin only.
create policy "experience_public_read" on experience for select using (true);
create policy "experience_admin_insert" on experience for insert to authenticated with check (true);
create policy "experience_admin_update" on experience for update to authenticated using (true);
create policy "experience_admin_delete" on experience for delete to authenticated using (true);

create policy "skills_public_read" on skills for select using (true);
create policy "skills_admin_insert" on skills for insert to authenticated with check (true);
create policy "skills_admin_update" on skills for update to authenticated using (true);
create policy "skills_admin_delete" on skills for delete to authenticated using (true);

create policy "about_public_read" on about for select using (true);
create policy "about_admin_insert" on about for insert to authenticated with check (true);
create policy "about_admin_update" on about for update to authenticated using (true);
create policy "about_admin_delete" on about for delete to authenticated using (true);

create policy "resume_public_read" on resume for select using (true);
create policy "resume_admin_insert" on resume for insert to authenticated with check (true);
create policy "resume_admin_update" on resume for update to authenticated using (true);
create policy "resume_admin_delete" on resume for delete to authenticated using (true);

create policy "settings_public_read" on settings for select using (true);
create policy "settings_admin_insert" on settings for insert to authenticated with check (true);
create policy "settings_admin_update" on settings for update to authenticated using (true);
create policy "settings_admin_delete" on settings for delete to authenticated using (true);

-- messages: anyone can create (public contact form); only admin can read/update/delete.
create policy "messages_public_insert" on messages for insert to anon, authenticated with check (true);
create policy "messages_admin_read"   on messages for select to authenticated using (true);
create policy "messages_admin_update" on messages for update to authenticated using (true);
create policy "messages_admin_delete" on messages for delete to authenticated using (true);

-- ---------- Storage ----------
-- One public bucket holding everything (project images/videos, resume,
-- certificates, profile photo), organized into folders — see
-- STORAGE_PATHS in supabase/storage.js. Public read; admin-only writes,
-- equivalent to the original storage.rules per-folder size/type checks
-- being enforced at the app layer instead.

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "portfolio_public_read" on storage.objects for select
  using (bucket_id = 'portfolio');

create policy "portfolio_admin_upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio');

create policy "portfolio_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio');
