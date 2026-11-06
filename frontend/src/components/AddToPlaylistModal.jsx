import { useCallback, useEffect, useRef, useState } from 'react';
import {
    addMediaToPlaylist,
    createPlaylist,
    listPlaylists,
} from '../services/userData';
import { X, Plus, Check, AlertCircle } from 'lucide-react';
import ErrorState from './ErrorState';
import { useToast } from '../lib/toast';
import { logError, userFacingError } from '../lib/errors';

export default function AddToPlaylistModal({ movie, onClose }) {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [creating, setCreating] = useState(false);
    const [addedIds, setAddedIds] = useState(new Set());
    const [message, setMessage] = useState(null);
    const [error, setError] = useState('');
    const [addingIds, setAddingIds] = useState(new Set());
    const dialogRef = useRef(null);
    const triggerRef = useRef(document.activeElement);
    const { notify } = useToast();

    const targetMediaId = Number(movie?.media_id || movie?.movie_id || movie?.id);
    const targetMediaType = movie?.media_type || movie?.mediaType || 'movie';

    const fetchPlaylists = useCallback(async () => {
        setError('');
        try {
            const data = await listPlaylists();
            setPlaylists(data);

            const initialAddedIds = new Set();
            data.forEach((pl) => {
                if (pl.items?.some((item) =>
                    Number(item.media_id || item.movie_id) === targetMediaId &&
                    (item.media_type || 'movie') === targetMediaType
                )) {
                    initialAddedIds.add(pl.id);
                }
            });
            setAddedIds(initialAddedIds);
        } catch (err) {
            logError('Failed to load playlists', err);
            setError(userFacingError(err, 'Unable to load playlists.'));
        } finally {
            setLoading(false);
        }
    }, [targetMediaId, targetMediaType]);

    useEffect(() => {
        const timer = setTimeout(fetchPlaylists, 0);
        return () => clearTimeout(timer);
    }, [fetchPlaylists]);

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;

        setCreating(true);
        try {
            const created = await createPlaylist(newPlaylistName);
            setPlaylists([created, ...playlists]);
            setNewPlaylistName('');
            setMessage({
                type: 'success',
                text: `Created playlist "${created.name}"`,
            });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            logError('Failed to create playlist', err);
            notify({ type: 'error', message: userFacingError(err, 'Unable to create playlist.'), key: 'create-playlist-error' });
        } finally {
            setCreating(false);
        }
    };

    const handleAddToPlaylist = async (playlistId) => {
        if (addingIds.has(playlistId)) return;
        if (addedIds.has(playlistId)) {
            notify({ type: 'warning', message: `"${movie?.title || movie?.name || 'This title'}" is already in this playlist.`, key: `playlist-duplicate-${playlistId}` });
            return;
        }

        setAddingIds((prev) => new Set(prev).add(playlistId));
        try {
            const result = await addMediaToPlaylist(playlistId, movie);

            setAddedIds((prev) => new Set(prev).add(playlistId));

            if (result.alreadyExists) {
                notify({ type: 'warning', message: `"${movie?.title || movie?.name || 'This title'}" is already in this playlist.`, key: `playlist-duplicate-${playlistId}` });
            } else {
                notify({ type: 'success', message: `Added "${movie?.title || movie?.name || 'Title'}" to playlist.`, key: `playlist-added-${playlistId}` });
                setPlaylists((prev) =>
                    prev.map((pl) =>
                        pl.id === playlistId ? { ...pl, items_count: (pl.items_count || 0) + 1 } : pl
                    )
                );
            }
            setTimeout(() => setMessage(null), 3500);
        } catch (err) {
            logError('Failed to add title to playlist', err);
            notify({ type: 'error', message: userFacingError(err, 'Unable to add title to playlist.'), key: `playlist-add-error-${playlistId}` });
        } finally {
            setAddingIds((prev) => {
                const next = new Set(prev);
                next.delete(playlistId);
                return next;
            });
        }
    };

    useEffect(() => {
        const previous = triggerRef.current;
        dialogRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
            if (event.key !== 'Tab') return;
            const focusable = dialogRef.current?.querySelectorAll('button, input, [href], select, textarea');
            if (!focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            previous?.focus?.();
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="playlist-dialog-title" aria-describedby="playlist-dialog-description" tabIndex="-1" className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-white relative shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
                <button
                    onClick={onClose}
                    aria-label="Close add to playlist dialog"
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 id="playlist-dialog-title" className="text-lg font-bold mb-1">Add to Playlist</h3>
                <p id="playlist-dialog-description" className="text-neutral-400 text-xs mb-4">
                    Select a playlist for <span className="text-amber-400 font-medium">{movie?.title || movie?.name}</span>
                </p>

                {message && (
                    <div
                        className={`mb-4 p-3 border text-xs rounded-xl flex items-center gap-2.5 transition-all shadow-sm ${
                            message.type === 'info' || message.type === 'warning'
                                ? 'bg-amber-950/80 border-amber-600/50 text-amber-200'
                                : message.type === 'error'
                                ? 'bg-red-950/80 border-red-800 text-red-200'
                                : 'bg-emerald-950/80 border-emerald-600/50 text-emerald-200'
                        }`}
                    >
                        {message.type === 'info' || message.type === 'warning' ? (
                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                        ) : message.type === 'error' ? (
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                        ) : (
                            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                        )}
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                {/* Create new playlist form */}
                <form onSubmit={handleCreatePlaylist} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="New playlist name..."
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                        type="submit"
                        disabled={creating || !newPlaylistName.trim()}
                        className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create</span>
                    </button>
                </form>

                {/* Playlists list */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {error ? (
                        <ErrorState message={error} onRetry={fetchPlaylists} />
                    ) : loading ? (
                        <div className="text-center py-6 text-xs text-neutral-400">Loading playlists...</div>
                    ) : playlists.length === 0 ? (
                        <div className="text-center py-6 text-xs text-neutral-400">
                            No playlists found. Create one above!
                        </div>
                    ) : (
                        playlists.map((pl) => {
                            const isAdded = addedIds.has(pl.id);
                            return (
                                <div
                                    key={pl.id}
                                    className="flex items-center justify-between p-3 bg-neutral-800/60 hover:bg-neutral-800 rounded-lg transition-colors"
                                >
                                    <div>
                                        <h4 className="text-sm font-medium">{pl.name}</h4>
                                        <p className="text-neutral-400 text-xs">{pl.items_count ?? 0} titles</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddToPlaylist(pl.id)}
                                        disabled={addingIds.has(pl.id)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                                            isAdded
                                                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                                                : 'bg-amber-500 hover:bg-amber-600 text-black'
                                        }`}
                                        title={isAdded ? 'Already in this playlist. Click to view notification.' : 'Add to playlist'}
                                    >
                                        {isAdded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                                        <span>{addingIds.has(pl.id) ? 'Adding...' : isAdded ? 'In Playlist' : 'Add'}</span>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}