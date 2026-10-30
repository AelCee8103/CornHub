import { fetchTmdb, sendTmdbResponse } from '../../lib/tmdb.js';

export default async function handler(_request, response) {
    return sendTmdbResponse(response, await fetchTmdb('/genre/tv/list'));
}
