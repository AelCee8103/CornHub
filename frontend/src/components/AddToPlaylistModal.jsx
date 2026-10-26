import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Plus, Check } from 'lucide-react';

export default function AddToPlaylistModal({ movie, onClose }) {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [creating, setCreating] = useState(false);
    const [addedIds, setAddedIds] = useState(new Set());
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const response = await api.get('/playlists');
            setPlaylists(response.data);
        } catch (err) {
            console.error('Failed to load playlists', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;

        setCreating(true);
        try {
            const response = await api.post('/playlists', { name: newPlaylistName });
            setPlaylists([response.data.playlist, ...playlists]);
            setNewPlaylistName('');
        } catch (err) {
            console.error('Failed to create playlist', err);
        } finally {
            setCreating(false);
        }
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            await api.post(`/playlists/${playlistId}/movies`, {
                movie_id: movie.id || movie.movie_id,
                title: movie.title,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
            });

            setAddedIds((prev) => new Set(prev).add(playlistId));
            setMessage('Movie added to playlist!');
            setTimeout(() => setMessage(''), 2500);
        } catch (err) {
            console.error('Failed to add movie to playlist', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-white relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-bold mb-1">Add to Playlist</h3>
                <p className="text-neutral-400 text-xs mb-4">
                    Select a playlist for <span className="text-amber-400 font-medium">{movie?.title}</span>
                </p>

                {message && (
                    <div className="mb-4 p-2.5 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                        <Check className="w-4 h-4" /> {message}
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
                    {loading ? (
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
                                        <p className="text-neutral-400 text-xs">{pl.items_count ?? 0} movies</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddToPlaylist(pl.id)}
                                        disabled={isAdded}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                                            isAdded
                                                ? 'bg-emerald-600/30 text-emerald-300'
                                                : 'bg-amber-500 hover:bg-amber-600 text-black cursor-pointer'
                                        }`}
                                    >
                                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                        <span>{isAdded ? 'Added' : 'Add'}</span>
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