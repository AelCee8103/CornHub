import React, { useState, useEffect } from 'react';
import {
    addToWatchlist,
    createPlaylist,
    deletePlaylist,
    getPlaylist,
    listPlaylists,
    listWatchlist,
    removeFromWatchlist,
    removeMediaFromPlaylist,
} from '../services/userData';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import { List, Plus, Trash2, Film, FolderPlus } from 'lucide-react';

export default function PlaylistsPage() {
    const [playlists, setPlaylists] = useState([]);
    const [activePlaylist, setActivePlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [creating, setCreating] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [playlistMedia, setPlaylistMedia] = useState(null);
    const [watchlistIds, setWatchlistIds] = useState(new Set());

    useEffect(() => {
        fetchPlaylists();
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            const data = await listWatchlist();
            const ids = new Set(data.map((item) => `${item.media_type || 'movie'}:${item.media_id || item.movie_id}`));
            setWatchlistIds(ids);
        } catch (err) {
            console.error('Failed to load watchlist', err);
        }
    };

    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const data = await listPlaylists();
            setPlaylists(data);
            if (data.length > 0 && !activePlaylist) {
                fetchPlaylistDetails(data[0].id);
            }
        } catch (err) {
            console.error('Failed to load playlists', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlaylistDetails = async (id) => {
        try {
            setActivePlaylist(await getPlaylist(id));
        } catch (err) {
            console.error('Failed to fetch playlist details', err);
        }
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setCreating(true);
        try {
            const created = await createPlaylist(name, description);
            setPlaylists([created, ...playlists]);
            setActivePlaylist({ ...created, items: [] });
            setName('');
            setDescription('');
        } catch (err) {
            console.error('Failed to create playlist', err);
        } finally {
            setCreating(false);
        }
    };

    const handleDeletePlaylist = async (id) => {
        if (!confirm('Are you sure you want to delete this playlist?')) return;

        try {
            await deletePlaylist(id);
            const updated = playlists.filter((pl) => pl.id !== id);
            setPlaylists(updated);
            if (activePlaylist?.id === id) {
                if (updated.length > 0) {
                    fetchPlaylistDetails(updated[0].id);
                } else {
                    setActivePlaylist(null);
                }
            }
        } catch (err) {
            console.error('Failed to delete playlist', err);
        }
    };

    const handleToggleWatchlist = async (movie) => {
        const mediaId = movie.media_id || movie.movie_id || movie.id;
        const mediaType = movie.media_type || movie.mediaType || 'movie';
        const key = `${mediaType}:${mediaId}`;
        const isSaved = watchlistIds.has(key);

        try {
            if (isSaved) {
                await removeFromWatchlist(movie);
                setWatchlistIds((prev) => {
                    const next = new Set(prev);
                    next.delete(key);
                    return next;
                });
            } else {
                await addToWatchlist(movie);
                setWatchlistIds((prev) => new Set(prev).add(key));
            }
        } catch (err) {
            console.error('Failed to update watchlist', err);
        }
    };

    const handleRemoveMovieFromPlaylist = async (movie) => {
        if (!activePlaylist) return;
        const mediaId = movie.media_id || movie.movie_id || movie.id;
        const mediaType = movie.media_type || movie.mediaType || 'movie';

        try {
            await removeMediaFromPlaylist(activePlaylist.id, movie);
            const updatedItems = activePlaylist.items.filter((item) =>
                `${item.media_type || 'movie'}:${item.media_id || item.movie_id || item.id}` !== `${mediaType}:${mediaId}`
            );
            setActivePlaylist((prev) => ({
                ...prev,
                items: updatedItems,
            }));
            // Update the items count in the playlist list on sidebar
            setPlaylists((prev) =>
                prev.map((pl) =>
                    pl.id === activePlaylist.id ? { ...pl, items_count: updatedItems.length } : pl
                )
            );
        } catch (err) {
            console.error('Failed to remove movie from playlist', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-800">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <List className="w-6 h-6 text-amber-500" /> Custom Playlists
                </h1>
                <p className="text-neutral-400 text-xs mt-1">Organize your favorite movies and series into themed collections</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar: Playlists & Form */}
                <div className="space-y-6">
                    {/* Create Playlist Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 mb-3">
                            <FolderPlus className="w-4 h-4 text-amber-500" /> New Playlist
                        </h3>
                        <form onSubmit={handleCreatePlaylist} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Playlist Title"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                            <textarea
                                placeholder="Description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                            />
                            <button
                                type="submit"
                                disabled={creating || !name.trim()}
                                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>{creating ? 'Creating...' : 'Create Playlist'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Existing Playlists list */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
                            Your Collections ({playlists.length})
                        </h3>
                        {loading ? (
                            <div className="text-neutral-400 text-xs py-4 text-center">Loading playlists...</div>
                        ) : playlists.length === 0 ? (
                            <div className="text-neutral-500 text-xs py-4 text-center">No playlists yet</div>
                        ) : (
                            playlists.map((pl) => (
                                <div
                                    key={pl.id}
                                    onClick={() => fetchPlaylistDetails(pl.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                                        activePlaylist?.id === pl.id
                                            ? 'bg-amber-500/10 border-amber-500/50 text-white'
                                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                                    }`}
                                >
                                    <div className="overflow-hidden pr-2">
                                        <h4 className="text-sm font-semibold truncate">{pl.name}</h4>
                                        <p className="text-neutral-400 text-xs truncate">
                                            {pl.items_count ?? (activePlaylist?.id === pl.id ? activePlaylist.items?.length : 0)} titles
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePlaylist(pl.id);
                                        }}
                                        title="Delete Playlist"
                                        className="text-neutral-500 hover:text-red-400 p-1 rounded-md transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Content Area: Movies in active playlist */}
                <div className="lg:col-span-3">
                    {activePlaylist ? (
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 min-h-[500px]">
                            <div className="mb-6 pb-4 border-b border-neutral-800">
                                <h2 className="text-xl font-bold text-white">{activePlaylist.name}</h2>
                                {activePlaylist.description && (
                                    <p className="text-neutral-400 text-xs mt-1">{activePlaylist.description}</p>
                                )}
                                <span className="inline-block mt-2 bg-neutral-800 text-neutral-300 text-xs px-2.5 py-0.5 rounded-full">
                  {activePlaylist.items?.length || 0} titles
                </span>
                            </div>

                            {!activePlaylist.items || activePlaylist.items.length === 0 ? (
                                <div className="text-center py-20 text-neutral-400">
                                    <Film className="w-12 h-12 mx-auto mb-3 opacity-40" />
                                    <p className="text-sm font-semibold">No titles in this playlist yet</p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Go to the Discover page and click the "+" icon on any movie to add it here.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {activePlaylist.items.map((movie) => {
                                        const mediaId = movie.media_id || movie.movie_id || movie.id;
                                        const mediaType = movie.media_type || movie.mediaType || 'movie';
                                        return (
                                            <MovieCard
                                                key={movie.id}
                                                movie={movie}
                                                onSelect={setSelectedMedia}
                                                isInWatchlist={watchlistIds.has(`${mediaType}:${mediaId}`)}
                                                onToggleWatchlist={handleToggleWatchlist}
                                                onAddToPlaylist={setPlaylistMedia}
                                                onRemove={handleRemoveMovieFromPlaylist}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-neutral-900/30 border border-neutral-800 rounded-xl p-12 text-center text-neutral-400 min-h-[400px]">
                            <List className="w-12 h-12 mb-3 opacity-30" />
                            <p className="text-base font-semibold">Select or create a playlist</p>
                            <p className="text-xs text-neutral-500 mt-1">Choose a playlist on the left to view its movie list.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedMedia && (
                <MovieModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
            )}

            {playlistMedia && (
                <AddToPlaylistModal
                    movie={playlistMedia}
                    onClose={() => {
                        setPlaylistMedia(null);
                        if (activePlaylist) {
                            fetchPlaylistDetails(activePlaylist.id);
                        }
                    }}
                />
            )}
        </div>
    );
}