import { fetchTmdb, sendTmdbResponse } from '../../lib/tmdb.js';

export default async function handler(request, response) {
    return sendTmdbResponse(response, await fetchTmdb('/search/tv', {
        page: request.query?.page || '1',
        query: request.query?.query || '',
    }));
}
