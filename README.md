# Portfolio — Public Site (standalone)

This is the public-facing site only. It has **no login, no admin
pages** — it just reads content from Supabase and displays it.

It's a companion to a separate `portfolio-admin` project. Both talk to
the **same Supabase project**, so anything published from the admin
dashboard appears here automatically.

## Setup

1. Paste your Supabase project's URL + anon key into
   `supabase/supabase-config.js`. **Use the exact same values here as
   in `portfolio-admin`** — they must point at the same project, or the
   admin dashboard's edits won't show up here.
2. In the Supabase dashboard, open **SQL Editor → New query**, paste in
   `supabase/schema.sql`, and run it (only needs to be done once, from
   either project — it creates the tables, storage bucket, and access
   policies).
3. Open `index.html` in a browser (or deploy the folder to any static
   host — Netlify, Vercel, GitHub Pages, etc.).

Until real Supabase keys are added, the site shows realistic sample
content automatically (see `supabase/sample-data.js`) with a small
"Demo mode" banner, so it's always safe to preview.

## What's inside

```
portfolio-public/
├── index.html, about.html, projects.html, project.html,
│   experience.html, skills.html, contact.html
├── css/            design tokens + shared styles
├── js/
│   ├── components/  shared navbar/footer (layout.js), toasts/cards/forms (ui.js)
│   └── pages/        one controller per page
└── supabase/
    ├── supabase-config.js   ← paste your project URL + anon key here
    ├── database.js           read-only queries used by the public site
    ├── storage.js            (kept for shared code paths; not used for uploads here)
    ├── sample-data.js        demo content shown before Supabase is configured
    └── schema.sql            reference copy — the real one is run from Supabase SQL Editor
```

This site only ever *reads* from the database/storage — all writes
happen through the separate admin dashboard.
