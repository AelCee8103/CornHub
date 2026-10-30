import { fetchTmdb, sendTmdbResponse } from '../../lib/tmdb.js';

export default async function handler(request, response) {
    return sendTmdbResponse(response, await fetchTmdb('/discover/tv', {
        page: request.query?.page || '1',
        sort_by: request.query?.sort_by || 'popularity.desc',
        ...(request.query?.with_genres ? { with_genres: request.query.with_genres } : {}),
    }));
}
