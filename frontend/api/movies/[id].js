import { fetchTmdb, sendTmdbResponse } from '../../lib/tmdb.js';

export default async function handler(request, response) {
    const movieId = request.query?.id;

    if (!/^\d+$/.test(movieId || '')) {
        return response.status(400).json({ message: 'Invalid movie ID.' });
    }

    return sendTmdbResponse(response, await fetchTmdb(`/movie/${movieId}`, {
        append_to_response: 'videos,external_ids',
    }));
}
