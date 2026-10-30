const movieApi = async (path, params = {}) => {
    const query = new URLSearchParams(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    );
    const response = await fetch(`/api/movies/${path}${query.toString() ? `?${query}` : ''}`);

    if (!response.ok) {
        throw new Error('Failed to load movie data.');
    }

    return response.json();
};

export const getGenres = () => movieApi('genres');

export const discoverMovies = (params) => movieApi('discover', params);

export const searchMovies = (params) => movieApi('search', params);

export const getMovieDetails = (movieId) => movieApi(String(movieId));
