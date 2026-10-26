<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\WatchlistController;
use Illuminate\Support\Facades\Route;

// Public Movie Discovery Routes (Proxy to TMDB)
Route::prefix('movies')->group(function () {
    Route::get('/discover', [MovieController::class, 'discover']);
    Route::get('/search', [MovieController::class, 'search']);
    Route::get('/genres', [MovieController::class, 'genres']);
    Route::get('/{id}', [MovieController::class, 'details']);
});

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected User Routes (Require Sanctum Token)
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Profile
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Watchlist Management
    Route::get('/watchlist', [WatchlistController::class, 'index']);
    Route::post('/watchlist', [WatchlistController::class, 'store']);
    Route::get('/watchlist/check/{movieId}', [WatchlistController::class, 'check']);
    Route::delete('/watchlist/{movieId}', [WatchlistController::class, 'destroy']);

    // Custom Playlists Management
    Route::get('/playlists', [PlaylistController::class, 'index']);
    Route::post('/playlists', [PlaylistController::class, 'store']);
    Route::get('/playlists/{id}', [PlaylistController::class, 'show']);
    Route::put('/playlists/{id}', [PlaylistController::class, 'update']);
    Route::delete('/playlists/{id}', [PlaylistController::class, 'destroy']);
    Route::post('/playlists/{id}/movies', [PlaylistController::class, 'addMovie']);
    Route::delete('/playlists/{id}/movies/{movieId}', [PlaylistController::class, 'removeMovie']);
});
