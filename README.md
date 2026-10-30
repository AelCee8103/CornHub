# CornHub - Movie Listing & Discovery Web Application

**CornHub** is a modern, full-stack movie listing and discovery web application. It enables users to explore trending and top-rated movies, search films in real-time, view detailed movie metadata, and organize their favorite titles with personal watchlists and custom-curated playlists.

Built with a decoupled client-server architecture, CornHub features a responsive **React (Vite)** single-page application frontend and a robust **Laravel** RESTful API backend powered by **The Movie Database (TMDB) API**.

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Architecture & System Design](#-architecture--system-design)
5. [Project Structure](#-project-structure)
6. [Database Schema](#-database-schema)
7. [API Reference](#-api-reference)
8. [Getting Started & Local Setup](#-getting-started--local-setup)
   - [Prerequisites](#prerequisites)
   - [Backend Setup (Laravel)](#backend-setup-laravel)
   - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
9. [Environment Configuration](#-environment-configuration)

---

## 🍿 Project Overview

CornHub serves as a central movie directory and catalog platform. Users can browse movies by genre, sort by popularity or release date, search titles dynamically, and inspect comprehensive movie details such as plot synopses, user ratings, cast information, and official trailers. 

Registered users have access to personal curation tools:
- **Watchlist**: Quick-bookmarking system for keeping track of films to watch.
- **Custom Playlists**: Create themed lists (e.g., *"Weekend Marathons"*, *"Favorite Sci-Fi"*), add or remove movies, and manage playlists.

*Note: CornHub is strictly a movie listing, discovery, and cataloging application.*

---

## ✨ Key Features

- **🎬 Dynamic Movie Discovery**: Browse popular, top-rated, and recently released movies fetched in real-time via TMDB.
- **🏷️ Genre & Sort Filtering**: Filter movie listings by official genres (Action, Drama, Sci-Fi, Comedy, etc.) and sort by popularity, rating, or release date.
- **🔍 Instant Search**: Real-time search functionality allowing users to find movies by keyword/title.
- **📄 Comprehensive Movie Details**: Modal view displaying detailed synopses, genres, runtime, release date, rating scores, poster/backdrop imagery, and official YouTube trailers.
- **🔐 Secure User Authentication**:
  - User registration and login powered by **Laravel Sanctum**.
  - Token-based API authentication (`Bearer <token>`).
  - Client-side session persistence and automatic token refresh/expiration cleanup.
  - Route protection for authenticated user views.
- **⭐ Personal Watchlist**: Add/remove movies to a dedicated personal watchlist with instantaneous status indicators.
- **📁 Custom Movie Playlists**: Create, rename, and delete custom playlists, and add or remove movies from specific playlists with interactive modals.

---

## 🛠️ Tech Stack

### Frontend
- **Framework / Library**: [React 19](https://react.dev/) (Single Page Application)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) (configured with request/response interceptors)
- **State Management**: React Context API (`AuthContext`)

### Backend
- **Framework**: [Laravel 11 / 12](https://laravel.com/) (RESTful API architecture)
- **Language**: PHP 8.2+
- **Authentication**: [Laravel Sanctum](https://laravel.com/docs/sanctum) (API Token Authentication)
- **ORM**: Eloquent ORM
- **HTTP Client**: Laravel HTTP Client (Guzzle wrapper)

### Database
- **DBMS**: MySQL / MariaDB (or SQLite for local development)

### External Services
- **Data Source**: [The Movie Database (TMDB) API v3](https://developer.themoviedb.org/docs) (proxied securely through Laravel backend)

---

## 🏗️ Architecture & System Design

CornHub is engineered with a **Decoupled Client-Server (SPA + REST API)** architecture:

```text
┌───────────────────────────────────────────────┐
│              Client (Frontend)                │
│       React 19 + Vite + Tailwind CSS          │
│   (Context API, Axios Interceptors, Router)   │
└───────────────────────┬───────────────────────┘
                        │ HTTP / JSON Requests
                        │ (Bearer Token Authentication)
                        ▼
┌───────────────────────────────────────────────┐
│              Server (Backend)                 │
│         Laravel RESTful API (Sanctum)         │
├───────────────────────┬───────────────────────┤
│    Internal Data      │    External Proxy     │
│   (Auth, Watchlist,   │  (Movie Discovery &   │
│      Playlists)       │     Search APIs)      │
└───────────┬───────────┴───────────┬───────────┘
            │                       │
            ▼                       ▼
┌───────────────────────┐   ┌───────────────────┐
│    Database (MySQL)   │   │     TMDB API      │
│ (Users, Playlists,    │   │  (Movie Metadata, │
│      Watchlist)       │   │  Genres, Images)  │
└───────────────────────┘   └───────────────────┘
```

1. **Client Tier**: React SPA handles UI rendering, client-side routing, and local authentication state. All API communication uses Axios with interceptors that automatically attach authentication tokens to protected requests.
2. **API Gateway / Controller Tier**: Laravel API controllers validate incoming payload, enforce Sanctum token middleware, and handle business logic.
3. **TMDB Proxy**: The backend acts as a proxy for TMDB requests, keeping TMDB API credentials secure on the server.
4. **Persistence Tier**: Eloquent ORM models manage database interactions with relational integrity and cascade deletions.

---

## 📂 Project Structure

```text
CornHub/
├── backend/                             # Laravel Backend (REST API)
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       ├── AuthController.php       # User registration, login, logout, me
│   │   │       ├── MovieController.php      # TMDB discovery, search, genres, details proxy
│   │   │       ├── PlaylistController.php   # Custom playlist & item management
│   │   │       └── WatchlistController.php  # User watchlist CRUD
│   │   └── Models/
│   │       ├── User.php                     # User model & relationships
│   │       ├── Playlist.php                 # Playlist entity model
│   │       ├── PlaylistItem.php             # Pivot/item model for playlist movies
│   │       └── Watchlist.php                # Watchlist entity model
│   ├── config/
│   │   └── services.php                 # TMDB API keys and configuration
│   ├── database/
│   │   └── migrations/                  # Database migration files
│   ├── routes/
│   │   └── api.php                      # Public & Sanctum protected API routes
│   ├── .env.example                     # Backend environment configuration template
│   └── composer.json                    # PHP dependencies
│
├── frontend/                            # React Frontend (SPA)
│   ├── public/                          # Static assets and icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddToPlaylistModal.jsx   # Modal for adding movie to user's playlists
│   │   │   ├── MovieCard.jsx            # Reusable movie card component with actions
│   │   │   ├── MovieModal.jsx           # Detailed movie view (synopsis, trailer, ratings)
│   │   │   ├── Navbar.jsx               # Navigation bar, search input, auth links
│   │   │   └── ProtectedRoute.jsx       # Route guard for authenticated views
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Authentication provider and hook (`useAuth`)
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Discovery, genre filters, and search results
│   │   │   ├── Login.jsx                # User login view
│   │   │   ├── PlaylistsPage.jsx        # Playlist management page
│   │   │   ├── Register.jsx             # User registration view
│   │   │   └── WatchlistPage.jsx        # User personal watchlist view
│   │   ├── services/
│   │   │   └── api.js                   # Central Axios client with interceptors
│   │   ├── App.jsx                      # App router and layout wrapper
│   │   ├── index.css                    # Tailwind CSS configuration and global styles
│   │   └── main.jsx                     # Application entry point
│   ├── package.json                     # Node.js dependencies and scripts
│   └── vite.config.js                   # Vite configuration
│
└── README.md                            # Project documentation
```

---

## 🗄️ Database Schema

The database schema is managed via Laravel database migrations:

- **`users`**: Stores user account credentials (`id`, `name`, `email`, `password`, `timestamps`).
- **`personal_access_tokens`**: Manages Sanctum Bearer tokens for API sessions.
- **`watchlists`**: Stores bookmarked movies associated with a user (`id`, `user_id`, `movie_id`, `title`, `poster_path`, `vote_average`, `release_date`, `timestamps`).
- **`playlists`**: Stores custom playlist metadata (`id`, `user_id`, `name`, `description`, `timestamps`).
- **`playlist_items`**: Stores movies mapped to a specific playlist (`id`, `playlist_id`, `movie_id`, `title`, `poster_path`, `vote_average`, `release_date`, `timestamps`).

---

## 🔌 API Reference

### Movie Discovery & Search (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/movies/discover` | Discover movies with pagination, genre filtering (`with_genres`), and sorting (`sort_by`). |
| `GET` | `/api/movies/search` | Search movies by title keyword (`query`, `page`). |
| `GET` | `/api/movies/genres` | Retrieve official movie genre list from TMDB. |
| `GET` | `/api/movies/{id}` | Get full details for a movie (includes trailers and similar movies). |

### Authentication (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/register` | Register a new user (`name`, `email`, `password`, `password_confirmation`). |
| `POST` | `/api/login` | Authenticate user and receive a Sanctum Bearer token. |

### Protected Routes (Requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user` | Get profile information of the currently authenticated user. |
| `POST` | `/api/logout` | Revoke current user authentication token. |
| `GET` | `/api/watchlist` | Retrieve all movies in user's watchlist. |
| `POST` | `/api/watchlist` | Add a movie to user's watchlist. |
| `GET` | `/api/watchlist/check/{movieId}` | Check if a specific movie exists in watchlist. |
| `DELETE` | `/api/watchlist/{movieId}` | Remove a movie from watchlist. |
| `GET` | `/api/playlists` | List all custom playlists created by user (with movie count). |
| `POST` | `/api/playlists` | Create a new custom playlist. |
| `GET` | `/api/playlists/{id}` | Retrieve playlist details and its list of movies. |
| `PUT` | `/api/playlists/{id}` | Update playlist name or description. |
| `DELETE` | `/api/playlists/{id}` | Delete a playlist and its mapped items. |
| `POST` | `/api/playlists/{id}/movies` | Add a movie to a playlist. |
| `DELETE` | `/api/playlists/{id}/movies/{movieId}` | Remove a movie from a playlist. |

---

## 💻 Getting Started & Local Setup

### Prerequisites
Make sure you have the following installed on your machine:
- **PHP 8.2+** and **Composer**
- **Node.js 18+** and **npm**
- **MySQL / MariaDB** (or SQLite)
- **TMDB API Key** ([Get a free key here](https://www.themoviedb.org/settings/api))

---

### Backend Setup (Laravel)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Create the local environment file:
   ```bash
   cp .env.example .env
   ```

4. Generate the application key:
   ```bash
   php artisan key:generate
   ```

5. Configure database and TMDB credentials in `backend/.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=corn_hub
   DB_USERNAME=root
   DB_PASSWORD=

   # TMDB Configuration
   TMDB_API_KEY=your_tmdb_api_key_here
   TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

6. Run database migrations:
   ```bash
   php artisan migrate
   ```

7. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   *The backend API will run at `http://127.0.0.1:8000`.*

---

### Frontend Setup (React + Vite)

1. Open a separate terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. *(Optional)* Configure the API base URL in `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will run at `http://localhost:5173`.*

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)
| Variable | Description |
| :--- | :--- |
| `APP_URL` | Base URL for the Laravel backend (e.g. `http://localhost:8000`). |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins allowed to call the API. |
| `DB_CONNECTION` | Database driver (`mysql` or `sqlite`). |
| `DB_DATABASE` | Database name. |
| `TMDB_API_KEY` | TMDB API v3 developer key used for fetching movie listings and details. |
| `TMDB_BASE_URL` | TMDB API base endpoint (default: `https://api.themoviedb.org/3`). |

### Frontend (`frontend/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_API_BASE_URL` | Base URL pointing to the Laravel API (e.g. `http://127.0.0.1:8000/api`). |

## 🚀 Production Deployment

The application is deployed as two services:

1. **Railway** hosts the Laravel API and a Railway-managed MySQL database.
2. **Vercel** hosts the React/Vite frontend.

### Railway

Create a Railway project from this repository, add a MySQL database, and configure the
Laravel service with `backend` as its root directory. The checked-in
`backend/railway.json` provides the Composer build command, health check, migration
command, and `$PORT`-bound Laravel start command.

Set these variables in the Railway service:

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your-generated-key
APP_URL=https://your-railway-domain
CORS_ALLOWED_ORIGINS=https://your-vercel-domain
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
TMDB_API_KEY=your-tmdb-key
TMDB_BASE_URL=https://api.themoviedb.org/3
```

Generate `APP_KEY` with `php artisan key:generate --show`. Keep `APP_KEY` and
`TMDB_API_KEY` in Railway Variables only; do not commit them.

### Vercel

Import the repository into Vercel and set `frontend` as the root directory. Use the
Vite preset with `npm run build` and `dist` as the output directory. Add this Vercel
environment variable before deploying:

```env
VITE_API_BASE_URL=https://your-railway-domain/api
```

`frontend/vercel.json` handles client-side React Router rewrites, so routes such as
`/watchlist` and `/playlists` continue to work after a page refresh.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
