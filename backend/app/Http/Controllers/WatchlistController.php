<?php

namespace App\Http\Controllers;

use App\Models\Watchlist;
use Illuminate\Http\Request;

class WatchlistController extends Controller
{
    /**
     * List all movies in the authenticated user's watchlist.
     */
    public function index(Request $request)
    {
        $watchlist = $request->user()->watchlist()->latest()->get();

        return response()->json($watchlist);
    }

    /**
     * Add a movie to the user's watchlist.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'poster_path' => 'nullable|string',
            'vote_average' => 'nullable|numeric',
            'release_date' => 'nullable|string',
        ]);

        $item = $request->user()->watchlist()->firstOrCreate(
            ['movie_id' => $validated['movie_id']],
            $validated
        );

        return response()->json([
            'message' => 'Movie added to watchlist',
            'item' => $item,
        ], 201);
    }

    /**
     * Check if a specific movie is in the user's watchlist.
     */
    public function check(Request $request, $movieId)
    {
        $exists = $request->user()->watchlist()->where('movie_id', $movieId)->exists();

        return response()->json(['in_watchlist' => $exists]);
    }

    /**
     * Remove a movie from the user's watchlist.
     */
    public function destroy(Request $request, $movieId)
    {
        $deleted = $request->user()->watchlist()->where('movie_id', $movieId)->delete();

        if (! $deleted) {
            return response()->json(['message' => 'Movie not found in watchlist'], 404);
        }

        return response()->json(['message' => 'Movie removed from watchlist']);
    }
}
