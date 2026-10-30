import React, { useEffect, useState } from 'react';
import { getMediaDetails } from '../services/movies';
import VidSrcPlayer from './VidSrcPlayer';
import { X, Star, Calendar, Clock, Play, Video, Image as ImageIcon } from 'lucide-react';

export default function MovieModal({ media, movieId, onClose }) {
    const selectedMedia = media || { id: movieId, mediaType: 'movie' };
    const mediaType = selectedMedia.mediaType || selectedMedia.media_type || 'movie';
    const mediaId = selectedMedia.media_id || selectedMedia.movie_id || selectedMedia.id;
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('watch'); // 'watch' | 'trailer' | 'backdrop'

    useEffect(() => {
        if (!mediaId) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const response = await getMediaDetails(mediaType, mediaId);
                setDetails(response);
                // default to 'watch'
                setActiveTab('watch');
            } catch (err) {
                console.error('Failed to load movie details', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [mediaId, mediaType]);

    if (!mediaId) return null;

    const trailer = details?.videos?.results?.find(
        (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-white">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black p-2 rounded-full text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {loading ? (
                    <div className="flex items-center justify-center p-24">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
                    </div>
                ) : details ? (
                    <div>
                        {/* Media Display Area (VidSrc Player / Trailer / Backdrop) */}
                        <div className="w-full bg-black rounded-t-2xl overflow-hidden">
                            {activeTab === 'watch' ? (
                                <VidSrcPlayer
                                    mediaType={mediaType}
                                    tmdbId={details.id || mediaId}
                                    imdbId={details.external_ids?.imdb_id || details.imdb_id}
                                    title={details.title || details.name}
                                />
                            ) : activeTab === 'trailer' && trailer ? (
                                <div className="aspect-video w-full">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                                        title={details.title || details.name}
                                        className="w-full h-full border-0"
                                        allow="autoplay; encrypted-media; fullscreen"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : details.backdrop_path ? (
                                <div className="aspect-video w-full overflow-hidden">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
                                        alt=                                        {details.title || details.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video w-full flex items-center justify-center text-neutral-400 text-xs">
                                    No preview available
                                </div>
                            )}
                        </div>

                        {/* View Switcher Bar */}
                        <div className="px-6 py-2.5 bg-neutral-950 border-b border-neutral-800 flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('watch')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                    activeTab === 'watch'
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                }`}
                            >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Watch {mediaType === 'tv' ? 'Series' : 'Movie'} (VidSrc)</span>
                            </button>

                            {trailer && (
                                <button
                                    onClick={() => setActiveTab('trailer')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                        activeTab === 'trailer'
                                            ? 'bg-amber-500 text-black'
                                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                    }`}
                                >
                                    <Video className="w-3.5 h-3.5 text-red-500" />
                                    <span>Trailer</span>
                                </button>
                            )}

                            {details.backdrop_path && (
                                <button
                                    onClick={() => setActiveTab('backdrop')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                        activeTab === 'backdrop'
                                            ? 'bg-amber-500 text-black'
                                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                    }`}
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span>Backdrop</span>
                                </button>
                            )}
                        </div>

                        {/* Details Content */}
                        <div className="p-6">
                            <h2 className="text-2xl font-bold">{details.title || details.name}</h2>
                            {details.tagline && (
                                <p className="text-neutral-400 italic text-sm mt-1">{details.tagline}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 mt-4">
                                <span className="flex items-center gap-1 text-amber-400 font-bold">
                                    <Star className="w-4 h-4 fill-amber-400" />
                                    {details.vote_average ? Number(details.vote_average).toFixed(1) : 'NR'} / 10
                                </span>
                                {(details.release_date || details.first_air_date) && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4 text-neutral-400" />
                                        {details.release_date || details.first_air_date}
                                    </span>
                                )}
                                {(details.runtime || details.episode_run_time?.[0]) && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-neutral-400" />
                                        {details.runtime || details.episode_run_time?.[0]} mins
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
                                    {details.overview || `No overview available for this ${mediaType === 'tv' ? 'series' : 'movie'}.`}
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