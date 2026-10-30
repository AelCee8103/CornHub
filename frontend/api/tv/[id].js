import { fetchTmdb, sendTmdbResponse } from '../../lib/tmdb.js';

export default async function handler(request, response) {
    const tvId = request.query?.id;

    if (!/^\d+$/.test(tvId || '')) {
        return response.status(400).json({ message: 'Invalid TV ID.' });
    }

    return sendTmdbResponse(response, await fetchTmdb(`/tv/${tvId}`, {
        append_to_response: 'videos,external_ids',
    }));
}
