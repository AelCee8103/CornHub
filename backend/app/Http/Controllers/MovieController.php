<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MovieController extends Controller
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.tmdb.key') ?? '';
        $this->baseUrl = config('services.tmdb.base_url') ?? 'https://api.themoviedb.org/3';
    }

        /**
         * Helper to perform TMDB requests.
         */
        private function tmdbRequest(string $endpoint, array $params = [])
        {
            $params['api_key'] = $this->apiKey;

            // withoutVerifying() bypasses local cURL CA certificate checks on Windows
            $response = Http::withoutVerifying()->get("{$this->baseUrl}/{$endpoint}", $params);

            if ($response->failed()) {
                return response()->json([
                    'error' => 'Failed to fetch data from TMDB',
                    'details' => $response->json(),
                ], $response->status());
            }

            return response()->json($response->json());
        }

    /**
     * Discover / Browse movies (popular, trending, or by genre).
     */
    public function discover(Request $request)
    {
        $page = $request->query('page', 1);
        $genre = $request->query('with_genres');
        $sortBy = $request->query('sort_by', 'popularity.desc');

        $params = [
            'language' => 'en-US',
            'page' => $page,
            'sort_by' => $sortBy,
        ];

        if ($genre) {
            $params['with_genres'] = $genre;
        }

        return $this->tmdbRequest('discover/movie', $params);
    }

    /**
     * Search movies by title.
     */
    public function search(Request $request)
    {
        $query = $request->query('query');
        $page = $request->query('page', 1);

        if (! $query) {
            return response()->json(['results' => [], 'total_pages' => 0]);
        }

        return $this->tmdbRequest('search/movie', [
            'query' => $query,
            'page' => $page,
            'language' => 'en-US',
        ]);
    }

    /**
     * Get details for a specific movie including videos/trailers.
     */
    public function details($id)
    {
        return $this->tmdbRequest("movie/{$id}", [
            'append_to_response' => 'videos,credits,similar',
            'language' => 'en-US',
        ]);
    }

    /**
     * Fetch list of official movie genres.
     */
    public function genres()
    {
        return $this->tmdbRequest('genre/movie/list', [
            'language' => 'en-US',
        ]);
    }
}
