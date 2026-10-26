import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { X, Star, Calendar, Clock, Film } from 'lucide-react';

export default function MovieModal({ movieId, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!movieId) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/movies/${movieId}`);
                setDetails(response.data);
            } catch (err) {
                console.error('Failed to load movie details', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [movieId]);

    if (!movieId) return null;

    const trailer = details?.videos?.results?.find(
        (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-white">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black p-2 rounded-full text-neutral-300 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
                    </div>
                ) : details ? (
                    <div>
                        {/* Trailer or Backdrop */}
                        {trailer ? (
                            <div className="aspect-video w-full">
                                <iframe
                                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                                    title={details.title}
                                    className="w-full h-full rounded-t-2xl"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : details.backdrop_path ? (
                            <div className="aspect-video w-full overflow-hidden">
                                <img
                                    src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
                                    alt={details.title}
                                    className="w-full h-full object-cover rounded-t-2xl"
                                />
                            </div>
                        ) : null}

                        {/* Details Content */}
                        <div className="p-6">
                            <h2 className="text-2xl font-bold">{details.title}</h2>
                            {details.tagline && (
                                <p className="text-neutral-400 italic text-sm mt-1">{details.tagline}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 mt-4">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                    {details.vote_average?.toFixed(1)} / 10
                </span>
                                {details.release_date && (
                                    <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                                        {details.release_date}
                  </span>
                                )}
                                {details.runtime && (
                                    <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-neutral-400" />
                                        {details.runtime} mins
                  </span>
                                )}
                            </div>

                            {/* Genres */}
                            {details.genres?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {details.genres.map((g) => (
                                        <span key={g.id} className="bg-neutral-800 text-neutral-300 text-xs px-2.5 py-1 rounded-full">
                      {g.name}
                    </span>
                                    ))}
                                </div>
                            )}

                            {/* Overview */}
                            <div className="mt-5">
                                <h3 className="text-sm font-semibold uppercase text-neutral-400 tracking-wider">Overview</h3>
                                <p className="text-neutral-300 text-sm mt-1 leading-relaxed">
                                    {details.overview || 'No overview available for this movie.'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-neutral-400">Failed to load movie information.</div>
                )}
            </div>
        </div>
    );
}