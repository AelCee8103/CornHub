<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use Illuminate\Http\Request;

class PlaylistController extends Controller
{
    /**
     * Get all playlists for the authenticated user.
     */
    public function index(Request $request)
    {
        $playlists = $request->user()->playlists()->withCount('items')->latest()->get();

        return response()->json($playlists);
    }

    /**
     * Create a new custom playlist.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $playlist = $request->user()->playlists()->create($validated);

        return response()->json([
            'message' => 'Playlist created successfully',
            'playlist' => $playlist,
        ], 201);
    }

    /**
     * Get a specific playlist along with all its movies.
     */
    public function show(Request $request, $id)
    {
        $playlist = $request->user()->playlists()->with('items')->findOrFail($id);

        return response()->json($playlist);
    }

    /**
     * Update playlist title/description.
     */
    public function update(Request $request, $id)
    {
        $playlist = $request->user()->playlists()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $playlist->update($validated);

        return response()->json([
            'message' => 'Playlist updated successfully',
            'playlist' => $playlist,
        ]);
    }

    /**
     * Delete an entire playlist.
     */
    public function destroy(Request $request, $id)
    {
        $playlist = $request->user()->playlists()->findOrFail($id);
        $playlist->delete();

        return response()->json(['message' => 'Playlist deleted successfully']);
    }

    /**
     * Add a movie to a playlist.
     */
    public function addMovie(Request $request, $id)
    {
        $playlist = $request->user()->playlists()->findOrFail($id);

        $validated = $request->validate([
            'movie_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'poster_path' => 'nullable|string',
            'vote_average' => 'nullable|numeric',
            'release_date' => 'nullable|string',
        ]);

        $item = $playlist->items()->firstOrCreate(
            ['movie_id' => $validated['movie_id']],
            $validated
        );

        return response()->json([
            'message' => 'Movie added to playlist',
            'item' => $item,
        ], 201);
    }

    /**
     * Remove a movie from a playlist.
     */
    public function removeMovie(Request $request, $id, $movieId)
    {
        $playlist = $request->user()->playlists()->findOrFail($id);
        $playlist->items()->where('movie_id', $movieId)->delete();

        return response()->json(['message' => 'Movie removed from playlist']);
    }
}
