import { fetchTmdb, requireGet, sendTmdbResponse } from '../../lib/tmdb.js';

export default async function handler(request, response) {
    if (!requireGet(request, response)) return;
    return sendTmdbResponse(response, await fetchTmdb('/genre/movie/list'));
}
