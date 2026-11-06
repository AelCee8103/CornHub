/* global process */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const CACHE_TTL_MS = 60 * 1000;
const responseCache = new Map();

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
    const cacheKey = `${endpoint}?${searchParams.toString()}`;
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.result;

    try {
        const tmdbResponse = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams}`);
        const body = await tmdbResponse.json();
        const result = { status: tmdbResponse.status, body };
        if (tmdbResponse.ok) {
            responseCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, result });
        }
        return result;
    } catch (error) {
        console.error('TMDB request failed', error);
        return {
            status: 502,
            body: { message: 'Movie service unavailable.' },
        };
    }
}

export function requireGet(request, response) {
    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET');
        response.status(405).json({ message: 'Method not allowed.' });
        return false;
    }
    return true;
}

export function parsePage(value) {
    const page = Number(value || 1);
    return Number.isInteger(page) && page >= 1 && page <= 500 ? String(page) : null;
}

export function parseSearchQuery(value) {
    const query = typeof value === 'string' ? value.trim() : '';
    return query.length >= 1 && query.length <= 100 ? query : null;
}

export function parseMediaId(value) {
    return /^\d+$/.test(value || '') ? value : null;
}

export function sendTmdbResponse(response, result) {
    return response.status(result.status).json(result.body);
}
