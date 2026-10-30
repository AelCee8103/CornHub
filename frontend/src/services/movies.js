const mediaApi = async (mediaType, path, params = {}) => {
    const query = new URLSearchParams(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    );
    const apiResource = mediaType === 'tv' ? 'tv' : 'movies';
    const response = await fetch(`/api/${apiResource}/${path}${query.toString() ? `?${query}` : ''}`);

    if (!response.ok) {
        throw new Error(`Failed to load ${mediaType} data.`);
    }

    return response.json();
};

export const getGenres = (mediaType = 'movie') => mediaApi(mediaType, 'genres');

export const discoverMovies = (params) => mediaApi('movie', 'discover', params);

export const searchMovies = (params) => mediaApi('movie', 'search', params);

export const discoverMedia = (mediaType, params) => mediaApi(mediaType, 'discover', params);

export const searchMedia = (mediaType, params) => mediaApi(mediaType, 'search', params);

export const getMediaDetails = (mediaType, mediaId) => mediaApi(mediaType, String(mediaId));

export const getMovieDetails = (movieId) => getMediaDetails('movie', movieId);
