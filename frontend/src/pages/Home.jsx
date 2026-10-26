import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import { Sparkles, TrendingUp, Star, Film } from 'lucide-react';

export default function Home() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('query') || '';

    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [category, setCategory] = useState('popularity.desc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [playlistMovie, setPlaylistMovie] = useState(null);
    const [watchlistIds, setWatchlistIds] = useState(new Set());

    const { isAuthenticated } = useAuth();

    // Load genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await api.get('/movies/genres');
                setGenres(response.data.genres || []);
            } catch (err) {
                console.error('Failed to load genres', err);
            }
        };
        fetchGenres();
    }, []);

    // Load user's watchlist movie IDs
    useEffect(() => {
        if (!isAuthenticated) {
            setWatchlistIds(new Set());
            return;
        }

        const fetchWatchlist = async () => {
            try {
                const response = await api.get('/watchlist');
                const ids = new Set(response.data.map((item) => Number(item.movie_id)));
                setWatchlistIds(ids);
            } catch (err) {
                console.error('Failed to load watchlist', err);
            }
        };
        fetchWatchlist();
    }, [isAuthenticated]);

    // Load movies on search, genre, category, or page change
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                let response;
                if (searchQuery) {
                    response = await api.get('/movies/search', {
                        params: { query: searchQuery, page },
                    });
                } else {
                    response = await api.get('/movies/discover', {
                        params: {
                            page,
                            sort_by: category,
                            with_genres: selectedGenre || undefined,
                        },
                    });
                }
                setMovies(response.data.results || []);
                setTotalPages(Math.min(response.data.total_pages || 1, 500));
            } catch (err) {
                console.error('Failed to load movies', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [searchQuery, category, selectedGenre, page]);

    // Watchlist toggle handler
    const handleToggleWatchlist = async (movie) => {
        if (!isAuthenticated) {
            alert('Please log in to add movies to your watchlist.');
            return;
        }

        const movieId = movie.movie_id || movie.id;
        const isSaved = watchlistIds.has(movieId);

        try {
            if (isSaved) {
                await api.delete(`/watchlist/${movieId}`);
                setWatchlistIds((prev) => {
                    const next = new Set(prev);
                    next.delete(movieId);
                    return next;
                });
            } else {
                await api.post('/watchlist', {
                    movie_id: movieId,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    release_date: movie.release_date,
                });
                setWatchlistIds((prev) => new Set(prev).add(movieId));
            }
        } catch (err) {
            console.error('Failed to update watchlist', err);
        }
    };

    const handleOpenPlaylistModal = (movie) => {
        if (!isAuthenticated) {
            alert('Please log in to add movies to custom playlists.');
            return;
        }
        setPlaylistMovie(movie);
    };

    return (
        <div className="space-y-6">
            {/* Hero Banner / Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        {searchQuery ? (
                            <>Search Results for: <span className="text-amber-400 font-semibold">"{searchQuery}"</span></>
                        ) : (
                            <><Sparkles className="w-6 h-6 text-amber-500" /> Discover Movies</>
                        )}
                    </h1>
                    <p className="text-neutral-400 text-xs mt-1">
                        Explore thousands of movies, trailers, and curated collections
                    </p>
                </div>

                {!searchQuery && (
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Sort Category */}
                        <select
                            value={category}
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(1);
                            }}
                            className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
                        >
                            <option value="popularity.desc">Most Popular</option>
                            <option value="vote_average.desc&vote_count.gte=300">Top Rated</option>
                            <option value="primary_release_date.desc">Latest Releases</option>
                        </select>

                        {/* Genre Select */}
                        <select
                            value={selectedGenre}
                            onChange={(e) => {
                                setSelectedGenre(e.target.value);
                                setPage(1);
                            }}
                            className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
                        >
                            <option value="">All Genres</option>
                            {genres.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Movies Grid */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
                </div>
            ) : movies.length === 0 ? (
                <div className="text-center py-20 text-neutral-400">
                    <Film className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-base font-semibold">No movies found</p>
                    <p className="text-xs text-neutral-500 mt-1">Try searching with different keywords or genre filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onSelect={setSelectedMovieId}
                            isInWatchlist={watchlistIds.has(movie.id)}
                            onToggleWatchlist={handleToggleWatchlist}
                            onAddToPlaylist={handleOpenPlaylistModal}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-6 border-t border-neutral-800">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1 || loading}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-xs font-semibold rounded-lg text-neutral-200 transition-colors cursor-pointer"
                    >
                        Previous
                    </button>
                    <span className="text-xs text-neutral-400">
            Page <span className="text-white font-bold">{page}</span> of {totalPages}
          </span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages || loading}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-xs font-semibold rounded-lg text-neutral-200 transition-colors cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Movie Details Modal */}
            {selectedMovieId && (
                <MovieModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
            )}

            {/* Add to Playlist Modal */}
            {playlistMovie && (
                <AddToPlaylistModal
                    movie={playlistMovie}
                    onClose={() => setPlaylistMovie(null)}
                />
            )}
        </div>
    );
}