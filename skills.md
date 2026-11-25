# SwipeMail

SwipeMail is a full-stack email management foundation that organizes Gmail messages with a four-direction, Tinder-like card deck.

## Stack

- React, TypeScript, Vite
- Tailwind CSS
- shadcn-style reusable UI structure
- Lucide React and Motion
- React Router DOM
- TanStack Query
- Supabase Auth, PostgreSQL, and Edge Functions

## Architecture

- `src/app` contains application providers and routing.
- `src/components` contains reusable common, layout, dashboard, swipe, and settings UI modules.
- `src/pages` contains route-level views.
- `src/hooks` contains React hooks.
- `src/services` contains application service boundaries.
- `src/lib` contains shared library configuration and utilities.
- `src/types` contains TypeScript models.
- `src/utils` contains pure helper functions.
- `src/constants` contains route and swipe-action constants.
- `src/styles` contains global styling.
- `supabase/migrations` contains database migrations.
- `supabase/functions` contains future Edge Functions.
- `docs` contains architectural and implementation documentation.

## Local setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

The development server is available at the URL printed by Vite, normally `http://localhost:5173`.

## Manual configuration

- Create a Supabase project and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Configure the Google OAuth client and set `VITE_GOOGLE_CLIENT_ID`.
- Enable and scope the Gmail API in Google Cloud.
- Set `OPENAI_API_KEY` only in an appropriate secure backend environment for future AI features.
