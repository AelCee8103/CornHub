import { fetchTmdb, parseMediaId, requireGet, sendTmdbResponse } from '../../lib/tmdb.js';

export default async function handler(request, response) {
    if (!requireGet(request, response)) return;
    const tvId = request.query?.id;

    if (!parseMediaId(tvId)) {
        return response.status(400).json({ message: 'Invalid TV ID.' });
    }

    return sendTmdbResponse(response, await fetchTmdb(`/tv/${tvId}`, {
        append_to_response: 'videos,external_ids',
    }));
}
