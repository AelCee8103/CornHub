import { fetchTmdb, parsePage, parseSearchQuery, requireGet, sendTmdbResponse } from '../../lib/tmdb.js';

export default async function handler(request, response) {
    if (!requireGet(request, response)) return;
    const page = parsePage(request.query?.page);
    const query = parseSearchQuery(request.query?.query);
    if (!page || !query) return response.status(400).json({ message: 'A search query and page from 1 to 500 are required.' });

    return sendTmdbResponse(response, await fetchTmdb('/search/tv', {
        page,
        query,
    }));
}
