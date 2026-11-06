# CornHub frontend

This Vite application provides movie and TV discovery, TMDB-backed details and
playback, Supabase authentication, watchlists, and custom playlists.

## Development

From this directory:

```powershell
npm install
npm run dev
```

Configure `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `TMDB_API_KEY`
using the environment variable examples in the repository. `TMDB_API_KEY` is
read only by the Vercel functions under `api/` and must not use a `VITE_`
prefix.

## Validation

```powershell
npm run test
npm run lint
npm run build
```

The Supabase migrations and deployment instructions are documented in the
repository root README.
