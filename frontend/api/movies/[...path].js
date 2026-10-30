/* global process */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export default async function handler(request, response) {
    const segments = request.query.path || [];
    const [resource] = segments;
    const params = new URLSearchParams({
        api_key: process.env.TMDB_API_KEY || '',
    });

    let endpoint;

    if (resource === 'genres') {
        endpoint = '/genre/movie/list';
    } else if (resource === 'discover') {
        endpoint = '/discover/movie';
        copyParams(request, params, ['page', 'sort_by', 'with_genres']);
    } else if (resource === 'search') {
        endpoint = '/search/movie';
        copyParams(request, params, ['page', 'query']);
    } else if (/^\d+$/.test(resource)) {
        endpoint = `/movie/${resource}`;
        params.set('append_to_response', 'videos,external_ids');
    } else {
        return response.status(404).json({ message: 'Movie endpoint not found.' });
    }

    if (!process.env.TMDB_API_KEY) {
        return response.status(500).json({ message: 'TMDB_API_KEY is not configured.' });
    }

    try {
        const tmdbResponse = await fetch(`${TMDB_BASE_URL}${endpoint}?${params}`);
        const data = await tmdbResponse.json();
        return response.status(tmdbResponse.status).json(data);
    } catch (error) {
        console.error('TMDB request failed', error);
        return response.status(502).json({ message: 'Movie service unavailable.' });
    }
}

function copyParams(request, target, keys) {
    keys.forEach((key) => {
        const value = request.query[key];
        if (value) target.set(key, value);
    });
}
