# VidSrc API Documentation

Complete guide to embedding movies and TV shows on a website using VidSrc (`vidsrc.sh`).

- **Official docs:** https://vidsrc.sh/vidsrc/docs/
- **Community:** https://vidsrc.community/
- **Authentication:** None. No API key and no sign-up required.
- **Model:** One iframe, one URL. All domains serve identical content, so any mirror can be used if one is unavailable in your region.

> **Note:** This document is a reference summary of the official documentation. Domains, DNS targets and features may change, so always check the official docs and their Announcements section for the latest information.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Custom Domain](#2-custom-domain)
3. [Movie Embed](#3-movie-embed)
4. [TV Show Embed](#4-tv-show-embed)
5. [Query String Format](#5-query-string-format)
6. [Query Parameters](#6-query-parameters)
7. [Subtitles](#7-subtitles)
8. [Player Events](#8-player-events)
9. [Resume Playback](#9-resume-playback)
10. [Content Info API](#10-content-info-api)
11. [Latest Content Lists](#11-latest-content-lists)
12. [Content ID Lists](#12-content-id-lists)
13. [Complete Examples](#13-complete-examples)
14. [Quick Reference](#14-quick-reference)

---

## 1. Quick Start

### Movie

```html
<iframe
  src="https://vidsrc.sh/embed/movie/tt1300854"
  width="100%" height="560"
  frameborder="0" allowfullscreen
></iframe>
```

### TV Show Episode

```html
<iframe
  src="https://vidsrc.sh/embed/tv/1399/1/1"
  width="100%" height="560"
  frameborder="0" allowfullscreen
></iframe>
```

Copy an embed URL, drop it in an iframe, and the player is live.

---

## 2. Custom Domain

You can point your own domain to VidSrc and use it as a player URL.

### Benefits

| Benefit | Description |
|---|---|
| **50% fewer ads** | Visitors see half the ad load compared to the default domains. |
| **No VidSrc logo** | Player branding is removed, so the player looks native to your site. |
| **Your own URL** | Embed URLs use your domain, e.g. `player.yoursite.com/embed/movie/tt1300854`. |
| **Direct autoplay** | The player opens and starts playing with no play button (`autoplay=1`). This works on **custom domains only**. Official/default domains always show a play button first. |

### Setup Tutorial

#### Step 1: Point your domain DNS to VidSrc

Create a [Cloudflare](https://cloudflare.com) account and add your domain. Then go to **DNS → Records** and add a **CNAME record**:

```
Type:    CNAME
Name:    @  (root domain)
Value:   vidsrc-ip.com
Proxy:   Proxied (orange cloud ON)
```

> **Important:** The target may change. Always check the **Announcements** section of the official site for the latest value before setting up.

#### Step 2: Configure SSL in Cloudflare

In the Cloudflare dashboard, go to **SSL/TLS → Overview → Configure**.

#### Step 3: Set SSL mode to Flexible

In the Configure panel, set **Custom SSL/TLS** to **Flexible** and click **Save**.

| Mode | Use? |
|---|---|
| Off | No |
| **Flexible** | **Yes (required)** |
| Full | No |
| Full (strict) | No |

> **Warning:** Do **not** use Full or Full (strict). The connection to VidSrc's origin must remain on HTTP, so Flexible is required.

Once done, your domain works exactly like an official VidSrc domain:

```
https://yourdomain.com/embed/movie/tt1300854
```

---

## 3. Movie Embed

```
GET /embed/movie/{id}
```

Embeds a movie player. Returns a fully responsive, auto-updated player.

### Parameters

| Parameter | Required | Description |
|---|---|---|
| `{id}` | Yes | IMDB ID (starts with `tt`, e.g. `tt1300854`) or numeric TMDB ID. |

### Example

```
https://vidsrc.sh/embed/movie/tt1300854
```

```html
<iframe
  src="https://vidsrc.sh/embed/movie/tt1300854"
  width="100%" height="560"
  frameborder="0" allowfullscreen
></iframe>
```

---

## 4. TV Show Embed

```
GET /embed/tv/{id}/{season}/{episode}
ALT /embed/tv/{id}/{season}-{episode}
```

Embeds a specific episode, or the whole series with a built-in season/episode picker.

### Parameters

| Parameter | Required | Description |
|---|---|---|
| `{id}` | Yes | IMDB ID (e.g. `tt0944947`) or numeric TMDB ID (e.g. `1399`). |
| `{season}` | Optional | Season number. Omit season and episode to show the season/episode picker. |
| `{episode}` | Optional | Episode number within the season. |

### Example

```
https://vidsrc.sh/embed/tv/1399/1/1
```

```html
<iframe
  src="https://vidsrc.sh/embed/tv/1399/1/1"
  width="100%" height="560"
  frameborder="0" allowfullscreen
></iframe>
```

### Notes

- TMDB IDs can be found at [themoviedb.org](https://www.themoviedb.org). Search for the show and take the number from the URL.
- `/embed/tv/1399` (no season/episode) opens the series with a picker and **automatically resumes** the last-watched episode and position.
- The alternative format `/embed/tv/{id}/{season}-{episode}` is also supported, e.g. `/embed/tv/1399/1-1`.

---

## 5. Query String Format

An alternative way to pass IDs via query string instead of URL path segments. Useful for programmatic URL construction.

```
GET /embed/movie?imdb={id}
```

```
# Movie by IMDB
https://vidsrc.sh/embed/movie?imdb=tt1300854

# TV Show by TMDB
https://vidsrc.sh/embed/tv?tmdb=1399&season=1&episode=1

# TV Show by IMDB
https://vidsrc.sh/embed/tv?imdb=tt0944947&season=1&episode=1
```

| Parameter | Used with | Description |
|---|---|---|
| `imdb` | movie, tv | IMDB ID (e.g. `tt1300854`) |
| `tmdb` | movie, tv | TMDB ID (e.g. `1399`) |
| `season` | tv | Season number |
| `episode` | tv | Episode number |

---

## 6. Query Parameters

All embed endpoints support optional query parameters appended to the URL.

### Playback

| Parameter | Type | Required | Description |
|---|---|---|---|
| `autoplay` | `0` / `1` | Optional | Force autoplay on (`1`) or off (`0`). **Direct autoplay (opening straight into the player with no play button) works on [custom domains](#2-custom-domain) only.** Official/default domains always show a play button first, and this parameter then only controls whether playback starts automatically after that click. Browsers may block unmuted autoplay; the player falls back to muted with an unmute prompt. |
| `autonext` | `0` / `1` | Optional | **TV only.** Set `1` to auto-play the next episode when the current one ends (shows an "Up next" countdown). Works for both `/embed/tv/{id}` (no season/episode) and specific-episode URLs. Off by default. |
| `startAt` | Float | Optional | Start playback at a specific time in seconds. E.g. `startAt=300` starts at 5 minutes. |

### Subtitles

| Parameter | Type | Required | Description |
|---|---|---|---|
| `ds_lang` | String | Optional | Default subtitle language for auto-selection. Accepts ISO 639-1 codes (e.g. `en`) or 3-letter codes (e.g. `eng`). Pass a comma-separated **priority list of up to 3**, e.g. `en,fr,de`. The player picks the first language that has a subtitle. |
| `sub_url` | URL | Optional | Load your own external subtitle file (`.vtt` or `.srt`) as a selectable, auto-applied track. Fetched and converted to WebVTT **entirely in the viewer's browser**. The file's host **must send CORS headers** (`Access-Control-Allow-Origin`). Must be an `https://` URL. |
| `sub_label` | String | Optional | Display name for the `sub_url` track (e.g. `English`). Defaults to "Custom subtitle". |
| `sub_lang` | String | Optional | Language code for the `sub_url` track (e.g. `en`). |

### Examples

```
# Enable autoplay
https://vidsrc.sh/embed/movie/tt1300854?autoplay=1

# English subtitles default
https://vidsrc.sh/embed/movie/tt1300854?ds_lang=en

# Start at 5 minutes + autoplay
https://vidsrc.sh/embed/movie/tt1300854?autoplay=1&startAt=300

# TV: auto-play next episode (whole show, starts at S1E1 / resume)
https://vidsrc.sh/embed/tv/tt0944947?autonext=1
```

---

## 7. Subtitles

VidSrc automatically sources subtitles from multiple providers, plus tracks extracted from the video itself.

Built-in subtitles are **automatic** and need no configuration. The player shows every available track and prefers the video-extracted ones. Use `ds_lang` to set the default language.

### Default Language

```
# Default subtitle language: German
https://vidsrc.sh/embed/movie/tt1300854?ds_lang=de

# Priority list (max 3): try English, then French, then German.
# The player uses the first language that has a subtitle.
https://vidsrc.sh/embed/movie/tt1300854?ds_lang=en,fr,de
```

### Custom Remote Subtitle (`sub_url`)

Your `sub_url` file is downloaded and converted to WebVTT **by the viewer's browser only**. VidSrc's servers never fetch it, so no server IP is exposed to the file's host. Because of that, the host **must allow cross-origin requests** (send an `Access-Control-Allow-Origin` header) or the browser will block the download.

```
# Load a custom .vtt/.srt subtitle track (label + language optional)
https://vidsrc.sh/embed/movie/tt1300854?sub_url=https://example.com/subs/en.vtt&sub_label=English&sub_lang=en
```

**Requirements checklist for `sub_url`:**

- Must be `https://`
- File must be `.vtt` or `.srt`
- Host must send `Access-Control-Allow-Origin`
- Remember to URL-encode the `sub_url` value if it contains its own query string

---

## 8. Player Events

The player sends `postMessage` events to the parent window so your page can react to playback state: track progress, auto-load next episodes, save watch history, and more.

### Event Payload

```json
{
  "type": "PLAYER_EVENT",
  "data": {
    "player_info": {
      "imdb":      "tt1300854",
      "tmdb":      null,
      "mediaType": "movie",
      "season":    null,
      "episode":   null
    },
    "player_status":   "playing",
    "player_progress": 125.4,
    "player_duration": 7200
  }
}
```

### Payload Fields

| Field | Description |
|---|---|
| `type` | Always `"PLAYER_EVENT"`. |
| `data.player_info.imdb` | IMDB ID, or `null`. |
| `data.player_info.tmdb` | TMDB ID, or `null`. |
| `data.player_info.mediaType` | `"movie"` or `"tv"`. |
| `data.player_info.season` | Season number (TV only). |
| `data.player_info.episode` | Episode number (TV only). |
| `data.player_status` | Current status (see below). |
| `data.player_progress` | Current time in seconds. |
| `data.player_duration` | Total duration in seconds. |

### Player Statuses

| Status | Fired When |
|---|---|
| `playing` | Playback starts/resumes, and every ~5 seconds during playback (progress updates). |
| `paused` | User pauses the video. |
| `completed` | Video reaches the end. |
| `seeked` | User seeks to a different position. |

### Listening for Events

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type !== 'PLAYER_EVENT') return;
  const { player_info, player_status, player_progress } = event.data.data;

  switch (player_status) {
    case 'playing':
      // Save progress for resume
      localStorage.setItem(`progress_${player_info.imdb || player_info.tmdb}`, player_progress);
      break;
    case 'paused':
      console.log('Paused at', player_progress, 's');
      break;
    case 'completed':
      console.log('Finished');
      break;
  }
});
```

### Auto-load Next Episode

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type !== 'PLAYER_EVENT') return;
  if (event.data.data.player_status !== 'completed') return;

  const { tmdb, imdb, season, episode } = event.data.data.player_info;
  const id = tmdb || imdb;
  const nextEp = parseInt(episode) + 1;
  document.querySelector('iframe').src =
    `https://vidsrc.sh/embed/tv/${id}/${season}/${nextEp}`;
});
```

> **Tip:** For a simpler approach with no JavaScript, use the `autonext=1` query parameter.

> **Security tip:** In production, validate `event.origin` against your VidSrc domain (or custom domain) before trusting message data.

---

## 9. Resume Playback

Save and restore a viewer's watch position using `player_progress` from [player events](#8-player-events) and the `startAt` query parameter.

| Parameter | Required | Description |
|---|---|---|
| `startAt` | Optional | Start at this timestamp in seconds, e.g. `?startAt=300` starts at 5 minutes. |

### Save & Restore Example

```javascript
// Save progress from player events
window.addEventListener('message', (e) => {
  if (e.data.type !== 'PLAYER_EVENT') return;
  const { player_info, player_status, player_progress } = e.data.data;
  if (player_status === 'playing') {
    const id = player_info.imdb || player_info.tmdb;
    localStorage.setItem(`progress_${id}`, player_progress);
  }
});

// Restore position when creating the iframe
const id = 'tt1300854';
const saved = localStorage.getItem(`progress_${id}`);
const src = `https://vidsrc.sh/embed/movie/${id}${saved ? `?startAt=${saved}` : ''}`;
document.querySelector('iframe').src = src;
```

### Resume at 5 minutes

```
https://vidsrc.sh/embed/movie/tt1300854?startAt=300
```

> **Note:** The series-level TV URL (`/embed/tv/{id}` with no season/episode) already resumes the last-watched episode and position automatically.

---

## 10. Content Info API

Look up metadata and the available **quality** for a single movie, TV show, or episode.

- Returns `200` with a JSON body when the title is available.
- Returns **`404` with a JSON body** when it isn't, so availability can be checked from the status code alone.
- No API key required. CORS enabled.
- Responses are cached for about 5 minutes.

### Endpoints

```
GET /info/movie/{id}.json
GET /info/tv/{id}.json
GET /info/tv/{id}/{season}/{episode}.json
```

### Parameters

| Parameter | Required | Description |
|---|---|---|
| `{id}` | Yes | IMDB ID (e.g. `tt1300854`) **or** numeric TMDB ID (e.g. `68721`). Both resolve to the same title. |
| `{season}` | Episode only | Season number. Include season *and* episode to query one episode; omit both for the whole show. |
| `{episode}` | Episode only | Episode number within the season. |

### Examples

```
# Movie by IMDB
https://vidsrc.sh/info/movie/tt1300854.json

# Movie by TMDB
https://vidsrc.sh/info/movie/68721.json

# Whole show (per-season quality), IMDB or TMDB
https://vidsrc.sh/info/tv/tt0944947.json
https://vidsrc.sh/info/tv/1399.json

# One episode, IMDB or TMDB
https://vidsrc.sh/info/tv/tt0944947/1/1.json
https://vidsrc.sh/info/tv/1399/1/1.json
```

### Movie Response

```json
{
  "status_code": 200,
  "type": "movie",
  "imdb_id": "tt1300854",
  "tmdb_id": "68721",
  "title": "Iron Man 3",
  "year": 2013,
  "quality": "1080p",
  "poster": "https://image.tmdb.org/t/p/w500/....jpg",
  "imdb_rating": 7.1,
  "embed_url": "https://vidsrc.sh/embed/movie/tt1300854",
  "embed_url_tmdb": "https://vidsrc.sh/embed/movie/68721",
  "time_added": "2021-03-18 23:43:39"
}
```

### TV Show Response

Lists every available season with its episode range and best quality. The top-level `quality` is the best quality across the whole series.

```json
{
  "status_code": 200,
  "type": "tv",
  "imdb_id": "tt0944947",
  "tmdb_id": "1399",
  "title": "Game of Thrones",
  "year": 2011,
  "quality": "1080p",
  "seasons": [
    { "season": 1, "episodes": 10, "first_episode": 1, "last_episode": 10, "quality": "1080p" }
  ],
  "total_episodes": 73,
  "poster": "https://image.tmdb.org/t/p/w500/....jpg",
  "imdb_rating": 9.2,
  "embed_url": "https://vidsrc.sh/embed/tv/tt0944947",
  "embed_url_tmdb": "https://vidsrc.sh/embed/tv/1399"
}
```

(The `seasons` array contains one entry per available season.)

### Episode Response

```json
{
  "status_code": 200,
  "type": "episode",
  "imdb_id": "tt0944947",
  "tmdb_id": "1399",
  "show_title": "Game of Thrones",
  "year": 2011,
  "season": 1,
  "episode": 1,
  "quality": "1080p",
  "poster": "https://image.tmdb.org/t/p/w500/....jpg",
  "imdb_rating": 9.2,
  "embed_url": "https://vidsrc.sh/embed/tv/tt0944947/1/1",
  "embed_url_tmdb": "https://vidsrc.sh/embed/tv/1399/1/1",
  "time_added": "2021-03-18 23:58:40"
}
```

### Not Found (HTTP 404)

```json
{
  "status_code": 404,
  "error": "not found",
  "message": "This title is not available."
}
```

### Quality Values

| Value | Meaning |
|---|---|
| `1080p` | Full HD source |
| `720p` | HD source |
| `DVD` | DVD / SD source (movies) |
| `SD` | Standard definition (episodes) |
| `CAM` | Cam / low-quality source |

### Example: Check Availability Before Embedding

```javascript
async function isAvailable(type, id) {
  const res = await fetch(`https://vidsrc.sh/info/${type}/${id}.json`);
  return res.ok; // 200 = available, 404 = not available
}

if (await isAvailable('movie', 'tt1300854')) {
  // render the iframe
}
```

---

## 11. Latest Content Lists

Paginated JSON feeds of the most recently added movies, TV shows and episodes. **50 results per page, newest first.** No API key required. Feeds are cached for about 5 minutes.

### Endpoints

| Endpoint | Returns |
|---|---|
| `/movies/latest/page-{N}.json` | Latest added movies |
| `/tvshows/latest/page-{N}.json` | Latest added TV shows |
| `/episodes/latest/page-{N}.json` | Latest added episodes |

```
https://vidsrc.sh/movies/latest/page-1.json
```

### Response Shape

Every response is `{ "result": [ ... ], "pages": <total> }`. To walk the whole catalogue, request `page-1` through `page-{pages}`. `page-1` holds the newest items; higher page numbers reach further back in time.

```json
{
  "result": [
    {
      "imdb_id": "tt1300854",
      "tmdb_id": "68721",
      "title": "Iron Man 3 2013",
      "embed_url": "https://vidsrc.sh/embed/movie?imdb=tt1300854",
      "embed_url_tmdb": "https://vidsrc.sh/embed/movie?tmdb=68721",
      "quality": "1080p",
      "time_added": "2026-08-04 20:50:35"
    }
  ],
  "pages": 1833
}
```

### Fields

| Field | Present In | Description |
|---|---|---|
| `imdb_id` | all | IMDB ID, e.g. `tt1300854` |
| `tmdb_id` | all | TMDB ID (may be `null`) |
| `title` | movies, tvshows | Title with year |
| `show_title` | episodes | Series title with year |
| `season`, `episode` | episodes | Season and episode numbers |
| `embed_url` | all | Ready-to-embed URL (IMDB) |
| `embed_url_tmdb` | all | Ready-to-embed URL (TMDB). Present when a TMDB ID exists. |
| `quality`, `time_added` | movies, episodes | Best quality label and when it was added |
| `pages` | all | Total number of pages available |

### Example: Fetch All Pages

```javascript
async function fetchAllMovies() {
  const first = await fetch('https://vidsrc.sh/movies/latest/page-1.json').then(r => r.json());
  const all = [...first.result];
  for (let n = 2; n <= first.pages; n++) {
    const page = await fetch(`https://vidsrc.sh/movies/latest/page-${n}.json`).then(r => r.json());
    all.push(...page.result);
  }
  return all;
}
```

> **Tip:** For a full catalogue sync, the [ID lists](#12-content-id-lists) are much more efficient than paging through hundreds of feed pages.

---

## 12. Content ID Lists

Plain-text files containing every IMDB and TMDB ID available on VidSrc. **One ID per line**, updated **daily**, served from `/ids/` with CORS enabled. Useful for syncing your catalog or building import scripts.

| File | Content |
|---|---|
| `movie_imdb.txt` | All movie IMDB IDs, format: `tt1234567` |
| `movie_tmdb.txt` | All movie TMDB IDs, format: `385687` |
| `tv_imdb.txt` | All TV show IMDB IDs, format: `tt0944947` |
| `tv_tmdb.txt` | All TV show TMDB IDs, format: `1399` |
| `eps_tmdb.txt` | All episode TMDB IDs, format: `314541_1x3` |
| `eps_imdb.txt` | All episode IMDB IDs, format: `tt0944947_1x1` |

```
https://vidsrc.sh/ids/movie_imdb.txt
```

### Example: Load an ID List

```javascript
const text = await fetch('https://vidsrc.sh/ids/movie_imdb.txt').then(r => r.text());
const ids = text.split('\n').map(s => s.trim()).filter(Boolean);
console.log(`${ids.length} movies available`);
```

### Episode ID Format

Episode IDs follow the pattern `{showId}_{season}x{episode}`:

- `tt0944947_1x1` is Season 1, Episode 1 of the show with IMDB ID `tt0944947`
- `314541_1x3` is Season 1, Episode 3 of the show with TMDB ID `314541`

---

## 13. Complete Examples

### A. Full Player Page with Resume, Events and Next Episode

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Player</title>
</head>
<body>
  <iframe id="player" width="100%" height="560" frameborder="0" allowfullscreen></iframe>

  <script>
    const BASE = 'https://vidsrc.sh';
    const showId = '1399';
    const season = 1;
    const episode = 1;

    // Restore saved position
    const key = `progress_${showId}_${season}_${episode}`;
    const saved = localStorage.getItem(key);

    const params = new URLSearchParams({ autonext: '1', ds_lang: 'en' });
    if (saved) params.set('startAt', saved);

    document.getElementById('player').src =
      `${BASE}/embed/tv/${showId}/${season}/${episode}?${params}`;

    // Listen for player events
    window.addEventListener('message', (e) => {
      if (e.data?.type !== 'PLAYER_EVENT') return;
      const { player_info, player_status, player_progress } = e.data.data;

      if (player_status === 'playing') {
        const k = `progress_${player_info.tmdb || player_info.imdb}_${player_info.season}_${player_info.episode}`;
        localStorage.setItem(k, player_progress);
      }
    });
  </script>
</body>
</html>
```

### B. Responsive 16:9 Wrapper

```html
<div style="position:relative;padding-top:56.25%;">
  <iframe
    src="https://vidsrc.sh/embed/movie/tt1300854"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;"
    allowfullscreen
  ></iframe>
</div>
```

### C. Building Embed URLs Programmatically

```javascript
function embedUrl({ type, id, season, episode, ...opts }) {
  const base = 'https://vidsrc.sh/embed';
  let path = `${base}/${type}/${id}`;
  if (type === 'tv' && season != null && episode != null) {
    path += `/${season}/${episode}`;
  }
  const qs = new URLSearchParams(opts).toString();
  return qs ? `${path}?${qs}` : path;
}

embedUrl({ type: 'movie', id: 'tt1300854', autoplay: 1, ds_lang: 'en' });
// https://vidsrc.sh/embed/movie/tt1300854?autoplay=1&ds_lang=en

embedUrl({ type: 'tv', id: 1399, season: 1, episode: 1, autonext: 1 });
// https://vidsrc.sh/embed/tv/1399/1/1?autonext=1
```

### D. Custom Subtitle with Priority Languages

```
https://vidsrc.sh/embed/movie/tt1300854?ds_lang=en,fr,de&sub_url=https://example.com/subs/en.vtt&sub_label=English&sub_lang=en
```

---

## 14. Quick Reference

### Embed Endpoints

| Purpose | URL |
|---|---|
| Movie (path) | `/embed/movie/{id}` |
| Movie (query) | `/embed/movie?imdb={id}` or `/embed/movie?tmdb={id}` |
| TV episode (path) | `/embed/tv/{id}/{season}/{episode}` |
| TV episode (alt) | `/embed/tv/{id}/{season}-{episode}` |
| TV series with picker | `/embed/tv/{id}` |
| TV (query) | `/embed/tv?tmdb={id}&season={s}&episode={e}` |

### Query Parameters

| Parameter | Values | Notes |
|---|---|---|
| `autoplay` | `0` / `1` | Direct (no-click) autoplay works on custom domains only |
| `autonext` | `0` / `1` | TV only |
| `startAt` | seconds (float) | Resume position |
| `ds_lang` | e.g. `en` or `en,fr,de` | Up to 3 languages in priority order |
| `sub_url` | `https://...vtt/.srt` | Host must send CORS headers |
| `sub_label` | string | Label for `sub_url` track |
| `sub_lang` | language code | Language for `sub_url` track |

### Data Endpoints

| Purpose | URL |
|---|---|
| Movie info | `/info/movie/{id}.json` |
| Show info | `/info/tv/{id}.json` |
| Episode info | `/info/tv/{id}/{season}/{episode}.json` |
| Latest movies | `/movies/latest/page-{N}.json` |
| Latest shows | `/tvshows/latest/page-{N}.json` |
| Latest episodes | `/episodes/latest/page-{N}.json` |
| ID lists | `/ids/{movie,tv,eps}_{imdb,tmdb}.txt` |

### Player Event Statuses

`playing` · `paused` · `completed` · `seeked`

### Quality Labels

`1080p` · `720p` · `DVD` · `SD` · `CAM`

### Caching

| Resource | Cache |
|---|---|
| Info endpoints | ~5 minutes |
| Latest content feeds | ~5 minutes |
| ID lists | Updated daily |

### Good to Know

- No API key or registration needed.
- All domains serve identical content, so use a mirror if one is blocked in your region.
- CORS is enabled on the info, latest and ID list endpoints.
- Both IMDB (`tt...`) and TMDB (numeric) IDs are accepted almost everywhere.
- Custom domains give fewer ads, no branding and direct autoplay.

---

*Source: https://vidsrc.sh/vidsrc/docs/*
