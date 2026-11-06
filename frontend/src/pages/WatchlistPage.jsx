import { useState, useEffect, useCallback } from 'react';
import { listWatchlist, removeFromWatchlist } from '../services/userData';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import { Bookmark, Film } from 'lucide-react';
import ErrorState from '../components/ErrorState';
import { useToast } from '../lib/toast';
import { logError, userFacingError } from '../lib/errors';

export default function WatchlistPage() {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [playlistMedia, setPlaylistMedia] = useState(null);
    const [busyIds, setBusyIds] = useState(new Set());
    const { notify } = useToast();

    const fetchWatchlist = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            setWatchlist(await listWatchlist());
        } catch (err) {
            logError('Failed to load watchlist', err);
            setError(userFacingError(err, 'Unable to load your watchlist.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(fetchWatchlist, 0);
        return () => clearTimeout(timer);
    }, [fetchWatchlist]);

    const handleRemoveFromWatchlist = async (movie) => {
        const mediaId = movie.media_id || movie.movie_id || movie.id;
        const key = `${movie.media_type || 'movie'}:${mediaId}`;
        if (busyIds.has(key)) return;
        setBusyIds((prev) => new Set(prev).add(key));
        try {
            await removeFromWatchlist(movie);
            setWatchlist((prev) => prev.filter((item) =>
                `${item.media_type || 'movie'}:${item.media_id || item.movie_id || item.id}` !==
                `${movie.media_type || 'movie'}:${mediaId}`
            ));
            notify({ type: 'success', message: 'Removed from your watchlist.', key: `watchlist-remove-${key}` });
        } catch (err) {
            logError('Failed to remove from watchlist', err);
            notify({ type: 'error', message: userFacingError(err, 'Unable to remove from your watchlist.'), key: `watchlist-remove-error-${key}` });
        } finally {
            setBusyIds((prev) => {
                const next = new Set(prev);
                next.delete(key);
                return next;
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-800">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Bookmark className="w-6 h-6 text-amber-500" /> My Saved Watchlist
                </h1>
                <p className="text-neutral-400 text-xs mt-1">
                    {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved for later
                </p>
            </div>

            {error ? (
                <ErrorState message={error} onRetry={fetchWatchlist} />
            ) : loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
                </div>
            ) : watchlist.length === 0 ? (
                <div className="text-center py-20 text-neutral-400">
                    <Film className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-base font-semibold">Your watchlist is empty</p>
                    <p className="text-xs text-neutral-500 mt-1">Explore movies or series and click "Watchlist" on any card to save it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {watchlist.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onSelect={setSelectedMedia}
                            isInWatchlist={true}
                            onToggleWatchlist={handleRemoveFromWatchlist}
                            onAddToPlaylist={setPlaylistMedia}
                            onRemove={handleRemoveFromWatchlist}
                            busy={busyIds.has(`${movie.media_type || 'movie'}:${movie.media_id || movie.movie_id || movie.id}`)}
                        />
                    ))}
                </div>
            )}

            {selectedMedia && (
                <MovieModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
            )}

            {playlistMedia && (
                <AddToPlaylistModal
                    movie={playlistMedia}
                    onClose={() => setPlaylistMedia(null)}
                />
            )}
        </div>
    );
}