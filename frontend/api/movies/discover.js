import { fetchTmdb, parsePage, requireGet, sendTmdbResponse } from '../../lib/tmdb.js';

export default async function handler(request, response) {
    if (!requireGet(request, response)) return;
    const page = parsePage(request.query?.page);
    if (!page) return response.status(400).json({ message: 'Page must be an integer from 1 to 500.' });

    return sendTmdbResponse(response, await fetchTmdb('/discover/movie', {
        page,
        sort_by: request.query?.sort_by || 'popularity.desc',
        ...(request.query?.vote_count_gte ? { 'vote_count.gte': request.query.vote_count_gte } : {}),
        ...(request.query?.with_genres ? { with_genres: request.query.with_genres } : {}),
    }));
}
