import { fetchTmdb, parseMediaId, requireGet, sendTmdbResponse } from '../../lib/tmdb.js';

export default async function handler(request, response) {
    if (!requireGet(request, response)) return;
    const movieId = request.query?.id;

    if (!parseMediaId(movieId)) {
        return response.status(400).json({ message: 'Invalid movie ID.' });
    }

    return sendTmdbResponse(response, await fetchTmdb(`/movie/${movieId}`, {
        append_to_response: 'videos,external_ids',
    }));
}
