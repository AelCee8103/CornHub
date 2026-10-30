/* global process */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTmdb(endpoint, params = {}) {
    if (!process.env.TMDB_API_KEY) {
        return {
            status: 500,
            body: { message: 'TMDB_API_KEY is not configured.' },
        };
    }

    const searchParams = new URLSearchParams({
        api_key: process.env.TMDB_API_KEY,
        ...params,
    });

    try {
        const tmdbResponse = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams}`);
        const body = await tmdbResponse.json();
        return { status: tmdbResponse.status, body };
    } catch (error) {
        console.error('TMDB request failed', error);
        return {
            status: 502,
            body: { message: 'Movie service unavailable.' },
        };
    }
}

export function sendTmdbResponse(response, result) {
    return response.status(result.status).json(result.body);
}
