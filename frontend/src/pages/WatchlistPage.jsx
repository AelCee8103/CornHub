import React, { useState, useEffect } from 'react';
import { listWatchlist, removeFromWatchlist } from '../services/userData';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import { Bookmark, Film } from 'lucide-react';

export default function WatchlistPage() {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [playlistMovie, setPlaylistMovie] = useState(null);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        setLoading(true);
        try {
            setWatchlist(await listWatchlist());
        } catch (err) {
            console.error('Failed to load watchlist', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWatchlist = async (movie) => {
        const movieId = movie.movie_id || movie.id;
        try {
            await removeFromWatchlist(movieId);
            setWatchlist((prev) => prev.filter((item) => (item.movie_id || item.id) !== movieId));
        } catch (err) {
            console.error('Failed to remove from watchlist', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-800">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Bookmark className="w-6 h-6 text-amber-500" /> My Saved Watchlist
                </h1>
                <p className="text-neutral-400 text-xs mt-1">
                    {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved for later
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
                </div>
            ) : watchlist.length === 0 ? (
                <div className="text-center py-20 text-neutral-400">
                    <Film className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-base font-semibold">Your watchlist is empty</p>
                    <p className="text-xs text-neutral-500 mt-1">Explore movies and click "Watchlist" on any card to save it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {watchlist.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onSelect={setSelectedMovieId}
                            isInWatchlist={true}
                            onToggleWatchlist={handleRemoveFromWatchlist}
                            onAddToPlaylist={setPlaylistMovie}
                            onRemove={handleRemoveFromWatchlist}
                        />
                    ))}
                </div>
            )}

            {selectedMovieId && (
                <MovieModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
            )}

            {playlistMovie && (
                <AddToPlaylistModal
                    movie={playlistMovie}
                    onClose={() => setPlaylistMovie(null)}
                />
            )}
        </div>
    );
}