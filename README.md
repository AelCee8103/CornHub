# CornHub

CornHub is a React/Vite movie discovery application with Supabase authentication and
user data, plus server-side Vercel functions for TMDB requests.

## Features

- Discover, search, filter, and inspect TMDB movies.
- Watch trailers and use the existing VidSrc player.
- Register, sign in, and sign out with Supabase Auth.
- Create and manage personal watchlists.
- Create playlists and add or remove movies.
- Row Level Security prevents users from reading or changing another user's data.

## Architecture

- **Frontend:** React 19, Vite, React Router, Tailwind CSS, Supabase JavaScript client.
- **Database/Auth:** Supabase PostgreSQL, Supabase Auth, and RLS.
- **Server-side API:** Vercel Function at `frontend/api/movies/[...path].js`.
- **External data:** TMDB API v3, accessed only by the Vercel Function.

The original Laravel implementation remains in `backend/` for reference and rollback.
It is not required for the Supabase + Vercel deployment.

## Local setup

### Supabase

1. Create a Supabase project.
2. Open the Supabase SQL Editor and run
   `supabase/migrations/001_initial_schema.sql`.
3. Configure the Auth site URL and redirect URLs for `http://localhost:5173`.
4. Decide whether email confirmation should be required for new accounts.

### Frontend

```powershell
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Start Vite:

```powershell
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Deploy with Vercel

Import the repository into Vercel and set the project root directory to `frontend`.
Use these settings:

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
Install command: npm install
```

Set these Vercel environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
TMDB_API_KEY=your-tmdb-api-key
```

`frontend/vercel.json` handles React Router refreshes. The Vercel function keeps
`TMDB_API_KEY` server-side. Never expose a Supabase service-role key or TMDB key in a
`VITE_` variable or frontend source.

After deployment, add the final Vercel URL to Supabase Auth's site URL and redirect URL
settings. Test registration, login, watchlists, playlists, movie discovery, search, and
direct refreshes of `/watchlist` and `/playlists`.
