# CornHub - Movie Discovery & Watchlist Web Application

A full-stack movie discovery, watchlist, and custom playlist management web application powered by **PHP**, **MySQL**, and **The Movie Database (TMDB) API**.

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Project Architecture & File Structure](#-project-architecture--file-structure)
5. [Database Schema & SQL Script](#-database-schema--sql-script)
6. [Local Setup & Installation Guide](#-local-setup--installation-guide)
7. [Deployment Guide (Live Portfolio Demo)](#-deployment-guide-for-portfolio-demo)
8. [API Configuration](#-api-configuration)
9. [Recommended Enhancements & Best Practices](#-recommended-enhancements--best-practices)

---

## 🍿 Project Overview

**CornHub** is an interactive movie platform where users can explore trending and popular movies in real-time, search for films, view detailed descriptions, ratings, and trailers, and manage personal watchlists and custom-curated movie playlists.

The application combines a dynamic frontend interface (HTML5, CSS3/SCSS, Vanilla JavaScript with AJAX) with a PHP backend and a MySQL database for user authentication, session control, and persistent playlist management.

---

## ✨ Key Features

- **🎬 Live Movie Discovery**: Fetches top popular, trending, and highly-rated movies in real-time using TMDB API.
- **🔍 Real-Time Movie Search**: Instant search-as-you-type querying the TMDB database.
- **📄 Detailed Movie Page**: Full movie information including poster, genres, synopsis, ratings, and release dates.
- **🔐 User Authentication**:
  - Secure registration and login flow.
  - PHP session-backed state management across pages.
  - Protected operations for managing lists and watchlists.
- **🛡️ Account Recovery**: Password reset workflow with personal security questions.
- **⭐ Personal Watchlist (Favorites)**: Add, view, delete, or clear movies in a dedicated favorites view.
- **📁 Custom Movie Playlists**: Create multiple custom-named lists (e.g., "Weekend Marathon", "Sci-Fi Classics"), add/remove movies, and rename or delete lists.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, SCSS, Vanilla JavaScript (ES6, AJAX / `XMLHttpRequest`), Remixicon, FontAwesome.
- **Backend**: PHP 7.4 / 8.x (Session management, MySQLi prepared statements).
- **Database**: MySQL / MariaDB (Relational schema with 5 dedicated tables).
- **External API**: [The Movie Database (TMDB) API v3](https://www.themoviedb.org/documentation/api).

---

## 📂 Project Architecture & File Structure

```text
CornHub/
├── assets/
│   ├── css/styles.css           # Global stylesheets
│   ├── js/main.js               # Main frontend UI logic
│   └── scss/styles.scss         # SCSS source styling
├── images/                      # Static logos, icons, and graphics
│   ├── CornHub_Logo.png
│   ├── deleteIcon.png
│   └── editIcon.png
│
├── index.php                    # Home page (Movie discovery, search, user session header)
├── moviePage.php                # Individual movie detail page
├── myList.php                   # Custom created lists management page
├── myfav.php                    # User personal watchlist/favorites page
├── login.php                    # Login form view
├── signup.html / signup.php     # Registration views & processing
├── account_recovery.php         # Security question validation interface
├── accountRecovery2.php         # Password reset interface
├── passChange.php               # Password update confirmation page
├── in_out.php                   # Authentication route switcher (Login vs Logout)
├── logout.php                   # Session termination endpoint
├── back.php                     # Navigation history controller
│
├── addMovie.php                 # Backend endpoint: Add movie to Watchlist
├── addMovieToCreatedList.php    # Backend endpoint: Add movie to custom playlist
├── check_answers.php            # Backend endpoint: Verify security questions
├── check_list_name.php          # Backend endpoint: Validate playlist uniqueness
├── check_session.php            # Backend endpoint: Check active user session
├── clearAllMovies.php           # Backend endpoint: Clear all movies in watchlist
├── clearMyListMovies.php        # Backend endpoint: Clear movies in custom playlist
├── create_account.php           # Backend endpoint: Register user & security answers
├── deleteList.php               # Backend endpoint: Delete custom playlist & its movies
├── deleteMovie.php              # Backend endpoint: Remove movie from watchlist
├── deleteMyListMovie.php        # Backend endpoint: Remove movie from custom playlist
├── fetch_lists.php              # Backend endpoint: Fetch user playlists (HTML format)
├── fetch_my_lists.php           # Backend endpoint: Fetch user playlists (JSON/Modal)
├── fetch_playlists.php          # Backend endpoint: Fetch playlists for dropdown
├── get_watchlist.php            # Backend endpoint: Retrieve watchlist movie keys
├── login_session.php            # Backend endpoint: Handle login session creation
├── movkeysession.php            # Backend endpoint: Session movie key tracking
├── populate_lists.php           # Backend endpoint: Populate list items
├── retrieveFavorites.php        # Backend endpoint: Retrieve watchlist entries
├── retrieveMyListMovies.php     # Backend endpoint: Retrieve movies in a list
├── save_list.php                # Backend endpoint: Create new custom playlist
├── update_list_name.php         # Backend endpoint: Rename playlist
├── update_password.php          # Backend endpoint: Update user password in database
├── validate_login.php           # Backend endpoint: Validate login credentials
└── wlist_isLogin.php            # Backend endpoint: Guard check for list access
```

---

## 🗄️ Database Schema & SQL Script

To set up the database, create a database named `corn_hub` and run the following SQL script:

```sql
CREATE DATABASE IF NOT EXISTS `corn_hub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `corn_hub`;

-- 1. Accounts Table: stores user credentials
CREATE TABLE IF NOT EXISTS `accounts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Recovery Table: stores security questions for account recovery
CREATE TABLE IF NOT EXISTS `recovery_table` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `accounts` VARCHAR(255) NOT NULL,
    `question1_Answer` VARCHAR(255) NOT NULL,
    `question2_Answer` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`accounts`) REFERENCES `accounts`(`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Watchlist Table: stores personal movie favorites
CREATE TABLE IF NOT EXISTS `watchlist` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `movieKey` INT NOT NULL,
    `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Created List Table: stores custom user playlists
CREATE TABLE IF NOT EXISTS `createdlist` (
    `listID` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `listName` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Created List Movies Table: stores movies mapped to custom playlists
CREATE TABLE IF NOT EXISTS `createdlistmovies` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `listID` INT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `movieKey` INT NOT NULL,
    FOREIGN KEY (`listID`) REFERENCES `createdlist`(`listID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 💻 Local Setup & Installation Guide

### Option 1: Using XAMPP / WampServer (Recommended for Windows)

1. **Install XAMPP**:
   - Download and install [XAMPP](https://www.apachefriends.org/).
   - Start **Apache** and **MySQL** modules from the XAMPP Control Panel.

2. **Place Project in Web Directory**:
   - Copy or move the `CornHub` directory to your web root:
     - Windows: `C:\xampp\htdocs\CornHub`
     - macOS: `/Applications/XAMPP/xamppfiles/htdocs/CornHub`
     - Linux: `/opt/lampp/htdocs/CornHub`

3. **Import Database**:
   - Open your browser and go to `http://localhost/phpmyadmin`.
   - Click **New** in the left sidebar, enter database name `corn_hub`, and click **Create**.
   - Select the `corn_hub` database, navigate to the **SQL** tab, paste the SQL schema from above, and click **Go**.

4. **Verify Database Configuration**:
   - Default PHP backend files connect with:
     - Host: `localhost`
     - User: `root`
     - Password: `""` (empty)
     - Database: `corn_hub`
     - Port: `3306`

5. **Run Application**:
   - Visit: `http://localhost/CornHub/`

---

### Option 2: Using Built-in PHP Server & Local MySQL CLI

1. Ensure **PHP 7.4+** and **MySQL** are installed on your machine.
2. Initialize MySQL and create the schema using the SQL script above.
3. Open a terminal in the project root:
   ```bash
   php -S localhost:8000
   ```
4. Open your browser at `http://localhost:8000`.

---

## 🚀 Deployment Guide for Portfolio Demo

To share this project as a live portfolio demo link, follow one of the methods below:

### Option A: Free Traditional Web Hosting (Easiest & Free)

Free PHP/MySQL web hosts allow you to upload PHP files and connect to a free MySQL database with phpMyAdmin:

1. **Recommended Free Providers**:
   - [InfinityFree](https://www.infinityfree.com/) (Free unlimited hosting, MySQL database, cPanel, phpMyAdmin).
   - [000webhost](https://www.000webhost.com/) by Hostinger.

2. **Step-by-step Setup on InfinityFree**:
   - Create a free account on [InfinityFree](https://www.infinityfree.com/) and register a free subdomain (e.g. `cornhub-demo.infinityfreeapp.com`).
   - Log into the Control Panel (cPanel) and open **MySQL Databases**.
   - Create a database (e.g., `epiz_XXXXX_corn_hub`). Note your database hostname (e.g., `sqlXXX.infinityfree.com`), username, and password.
   - Open **phpMyAdmin** from cPanel, select your database, and run the SQL creation script from this README.
   - Update database credentials in the PHP files (replace `localhost`, `root`, `""`, `corn_hub` with your hosting credentials).
   - Use the **File Manager** or an FTP client (FileZilla) to upload all project files to the `htdocs` folder.
   - Your live portfolio demo link is ready at: `http://your-subdomain.infinityfreeapp.com`.

---

### Option B: Cloud Containers / PaaS (Docker + Render / Railway / Fly.io)

For modern cloud container hosting with automated Git deployments:

1. **Create a `Dockerfile` in the project root**:
   ```dockerfile
   FROM php:8.1-apache
   RUN docker-php-ext-install mysqli pdo pdo_mysql
   COPY . /var/www/html/
   EXPOSE 80
   ```

2. **Create a Managed MySQL Database**:
   - Use [Aiven](https://aiven.io/), [PlanetScale](https://planetscale.com/), or [Railway MySQL](https://railway.app/) for a free-tier managed MySQL instance.
   - Run the SQL script on the remote MySQL database.

3. **Deploy on Render / Railway**:
   - Push your repository to GitHub.
   - Connect GitHub repository to [Render](https://render.com/) or [Railway](https://railway.app/).
   - Set environment variables or update database connection parameters to point to your cloud MySQL host.
   - Access your live SSL-enabled URL (e.g. `https://cornhub-demo.onrender.com`).

---

## 🔑 API Configuration

This project uses **The Movie Database (TMDB) API** to retrieve movie data, images, and search results.

- The API key is configured inside `script.js` and `moviePage.js`:
  ```javascript
  const APIKEY = 'api_key=YOUR_TMDB_API_KEY';
  ```
- To use your own API key:
  1. Create a free account at [TheMovieDB.org](https://www.themoviedb.org/).
  2. Navigate to **Settings > API** and generate an API Key.
  3. Replace the `APIKEY` string in `script.js` and `moviePage.js`.

---

## 💡 Recommended Enhancements & Best Practices

Before showcasing in technical interviews, consider the following improvements:

1. **Centralize Database Configuration**:
   - Consolidate repetitive `$servername`, `$username`, `$password` connection declarations across individual PHP files into a single `config/db.php` helper file.
2. **Environment Variables**:
   - Use `.env` or server environment variables (`getenv()`) for database credentials and TMDB API keys instead of hardcoding.
3. **Password Security**:
   - Upgrade plain-text / escaped password storage to secure PHP hashing:
     - Registration: `password_hash($password, PASSWORD_BCRYPT)`
     - Authentication: `password_verify($password, $hashedPassword)`
4. **Prepared Statements Consistency**:
   - Ensure all queries (e.g. in `check_answers.php`, `fetch_lists.php`) strictly use parameterized prepared statements (`$stmt->prepare()`) to prevent SQL injection.
