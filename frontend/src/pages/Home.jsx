import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { discoverMedia, getGenres, searchMedia } from '../services/movies';
import { addToWatchlist, listWatchlist, removeFromWatchlist } from '../services/userData';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import ErrorState from '../components/ErrorState';
import { Sparkles, Film } from 'lucide-react';
import { useToast } from '../lib/toast';
import { logError, userFacingError } from '../lib/errors';

export default function Home() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('query') || '';

    const [media, setMedia] = useState([]);
    const [mediaType, setMediaType] = useState('movie');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [category, setCategory] = useState('popularity.desc');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    const [selectedMedia, setSelectedMedia] = useState(null);
    const [playlistMedia, setPlaylistMedia] = useState(null);
    const [watchlistIds, setWatchlistIds] = useState(new Set());
    const [busyIds, setBusyIds] = useState(new Set());

    const { isAuthenticated } = useAuth();
    const { notify } = useToast();

    // Load genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await getGenres(mediaType);
                setGenres(response.genres || []);
            } catch (err) {
                logError('Failed to load genres', err);
                notify({ type: 'error', message: userFacingError(err, 'Unable to load genres.'), key: `genres-${mediaType}` });
            }
        };
        fetchGenres();
    }, [mediaType, notify]);

    // Load user's watchlist movie IDs
    useEffect(() => {
        if (!isAuthenticated) {
            setTimeout(() => setWatchlistIds(new Set()), 0);
            return;
        }

        const fetchWatchlist = async () => {
            try {
                const data = await listWatchlist();
                const ids = new Set(data.map((item) => `${item.media_type || 'movie'}:${item.media_id || item.movie_id}`));
                setWatchlistIds(ids);
            } catch (err) {
                logError('Failed to load watchlist', err);
                notify({ type: 'error', message: userFacingError(err, 'Unable to load your watchlist.'), key: 'home-watchlist-load-error' });
            }
        };
        fetchWatchlist();
    }, [isAuthenticated, notify]);

    // Load movies on search, genre, category, or page change
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError('');
            try {
                let response;
                if (searchQuery) {
                    response = await searchMedia(mediaType, { query: searchQuery, page });
                } else {
                    response = await discoverMedia(mediaType, {
                        page,
                        sort_by: category,
                        vote_count_gte: category === 'vote_average.desc' ? '300' : undefined,
                        with_genres: selectedGenre || undefined,
                    });
                }
                setMedia((response.results || []).map((item) => ({ ...item, mediaType })));
                setTotalPages(Math.min(response.total_pages || 1, 500));
            } catch (err) {
                logError('Failed to load titles', err);
                setError(userFacingError(err, 'Unable to load titles.'));
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [searchQuery, category, selectedGenre, page, mediaType, reloadKey]);

    // Watchlist toggle handler
    const handleToggleWatchlist = async (movie) => {
        if (!isAuthenticated) {
            notify({ type: 'warning', message: `Please log in to add ${mediaType === 'tv' ? 'series' : 'movies'} to your watchlist.`, key: 'watchlist-login-required' });
            return;
        }

        const mediaId = movie.media_id || movie.movie_id || movie.id;
        const isSaved = watchlistIds.has(`${mediaType}:${mediaId}`);
        const key = `${mediaType}:${mediaId}`;
        if (busyIds.has(key)) return;
        setBusyIds((prev) => new Set(prev).add(key));

        try {
            if (isSaved) {
                await removeFromWatchlist(movie);
                setWatchlistIds((prev) => {
                    const next = new Set(prev);
                    next.delete(`${mediaType}:${mediaId}`);
                    return next;
                });
                notify({ type: 'success', message: 'Removed from your watchlist.', key: `watchlist-remove-${key}` });
            } else {
                await addToWatchlist(movie);
                setWatchlistIds((prev) => new Set(prev).add(`${mediaType}:${mediaId}`));
                notify({ type: 'success', message: 'Added to your watchlist.', key: `watchlist-add-${key}` });
            }
        } catch (err) {
            logError('Failed to update watchlist', err);
            notify({ type: 'error', message: userFacingError(err, 'Unable to update your watchlist.'), key: `watchlist-error-${key}` });
        } finally {
            setBusyIds((prev) => {
                const next = new Set(prev);
                next.delete(key);
                return next;
            });
        }
    };

    const handleOpenPlaylistModal = (movie) => {
        if (!isAuthenticated) {
            notify({ type: 'warning', message: `Please log in to add ${mediaType === 'tv' ? 'series' : 'movies'} to custom playlists.`, key: 'playlist-login-required' });
            return;
        }
        setPlaylistMedia(movie);
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
                            <><Sparkles className="w-6 h-6 text-amber-500" /> Discover {mediaType === 'tv' ? 'Series' : 'Movies'}</>
                        )}
                    </h1>
                    <p className="text-neutral-400 text-xs mt-1">
                        Explore movies, series, trailers, and curated collections
                    </p>
                </div>

                {!searchQuery && (
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={mediaType}
                            onChange={(e) => {
                                setMediaType(e.target.value);
                                setSelectedGenre('');
                                setPage(1);
                            }}
                            className="bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
                        >
                            <option value="movie">Movies</option>
                            <option value="tv">Series</option>
                        </select>
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
                            <option value="vote_average.desc">Top Rated</option>
                            <option value={mediaType === 'tv' ? 'first_air_date.desc' : 'primary_release_date.desc'}>
                                Latest Releases
                            </option>
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

            {/* Media Grid */}
            {error ? (
                <ErrorState message={error} onRetry={() => setReloadKey((key) => key + 1)} />
            ) : loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
                </div>
            ) : media.length === 0 ? (
                <div className="text-center py-20 text-neutral-400">
                    <Film className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-base font-semibold">No {mediaType === 'tv' ? 'series' : 'movies'} found</p>
                    <p className="text-xs text-neutral-500 mt-1">Try searching with different keywords or genre filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {media.map((item) => (
                        <MovieCard
                            key={`${mediaType}-${item.id}`}
                            movie={item}
                            onSelect={setSelectedMedia}
                            isInWatchlist={watchlistIds.has(`${mediaType}:${item.id}`)}
                            onToggleWatchlist={handleToggleWatchlist}
                            onAddToPlaylist={handleOpenPlaylistModal}
                            busy={busyIds.has(`${mediaType}:${item.id}`)}
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
            {selectedMedia && (
                <MovieModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
            )}

            {/* Add to Playlist Modal */}
            {playlistMedia && (
                <AddToPlaylistModal
                    movie={playlistMedia}
                    onClose={() => setPlaylistMedia(null)}
                />
            )}
        </div>
    );
}