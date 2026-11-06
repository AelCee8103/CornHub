import { useEffect, useRef, useState } from 'react';
import { getMediaDetails } from '../services/movies';
import VidSrcPlayer from './VidSrcPlayer';
import { X, Star, Calendar, Clock, Play, Video, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import ErrorState from './ErrorState';
import { logError, userFacingError } from '../lib/errors';

export default function MovieModal({ media, movieId, onClose }) {
    const selectedMedia = media || { id: movieId, mediaType: 'movie' };
    const mediaType = selectedMedia.mediaType || selectedMedia.media_type || 'movie';
    const mediaId = selectedMedia.media_id || selectedMedia.movie_id || selectedMedia.id;
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);
    const [activeTab, setActiveTab] = useState('watch'); // 'watch' | 'trailer' | 'backdrop'
    const [playerUnavailable, setPlayerUnavailable] = useState(false);
    const [backdropUnavailable, setBackdropUnavailable] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [episodesOpen, setEpisodesOpen] = useState(true);
    const dialogRef = useRef(null);
    const triggerRef = useRef(document.activeElement);

    useEffect(() => {
        if (!mediaId) return;

        const fetchDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getMediaDetails(mediaType, mediaId);
                setDetails(response);
                setPlayerUnavailable(false);
                setBackdropUnavailable(false);
                // default to 'watch'
                setActiveTab('watch');
                const firstSeason = response.seasons?.find((season) => season.season_number > 0);
                setSelectedSeason(firstSeason?.season_number || 1);
                setSelectedEpisode(1);
                setEpisodesOpen(true);
            } catch (err) {
                logError('Failed to load title details', err);
                setError(userFacingError(err, 'Unable to load title details.'));
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [mediaId, mediaType, reloadKey]);

    useEffect(() => {
        const previous = triggerRef.current;
        dialogRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key !== 'Tab') return;
            const focusable = dialogRef.current?.querySelectorAll('button, iframe, [href], input, select, textarea');
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

    if (!mediaId) return null;

    const trailer = details?.videos?.results?.find(
        (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );
    const seasons = details?.seasons?.filter((season) => season.season_number > 0 && season.episode_count > 0) || [];
    const currentSeason = seasons.find((season) => season.season_number === selectedSeason) || seasons[0];
    const currentSeasonNumber = currentSeason?.season_number || selectedSeason;
    const episodeCount = currentSeason?.episode_count || 0;
    const hasPreviousEpisode = selectedEpisode > 1 || seasons.some((season) => season.season_number < currentSeasonNumber);
    const hasNextEpisode = selectedEpisode < episodeCount || seasons.some((season) => season.season_number > currentSeasonNumber);

    const navigateEpisode = (direction) => {
        if (!seasons.length) return;

        const seasonIndex = seasons.findIndex((season) => season.season_number === currentSeasonNumber);
        if (direction === 'next') {
            if (selectedEpisode < episodeCount) {
                setSelectedEpisode((episode) => episode + 1);
            } else {
                const nextSeason = seasons[seasonIndex + 1];
                if (nextSeason) {
                    setSelectedSeason(nextSeason.season_number);
                    setSelectedEpisode(1);
                }
            }
        } else if (selectedEpisode > 1) {
            setSelectedEpisode((episode) => episode - 1);
        } else {
            const previousSeason = seasons[seasonIndex - 1];
            if (previousSeason) {
                setSelectedSeason(previousSeason.season_number);
                setSelectedEpisode(previousSeason.episode_count);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="movie-dialog-title" aria-describedby="movie-dialog-description" tabIndex="-1" className="relative bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-white" onMouseDown={(event) => event.stopPropagation()}>
                <button
                    onClick={onClose}
                    aria-label="Close title details"
                    className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black p-2 rounded-full text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {loading ? (
                    <div className="flex items-center justify-center p-24">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
                    </div>
                ) : error ? (
                    <ErrorState message={error} onRetry={() => setReloadKey((key) => key + 1)} />
                ) : details ? (
                    <div>
                        {/* Media Display Area (VidSrc Player / Trailer / Backdrop) */}
                        <div className="w-full bg-black rounded-t-2xl overflow-hidden">
                            {activeTab === 'watch' && !playerUnavailable ? (
                                <VidSrcPlayer
                                    mediaType={mediaType}
                                    tmdbId={details.id || mediaId}
                                    imdbId={details.external_ids?.imdb_id || details.imdb_id}
                                    title={details.title || details.name}
                                    season={mediaType === 'tv' ? currentSeasonNumber : undefined}
                                    episode={mediaType === 'tv' ? selectedEpisode : undefined}
                                    onEpisodeComplete={mediaType === 'tv' && hasNextEpisode ? () => navigateEpisode('next') : undefined}
                                />
                            ) : activeTab === 'watch' ? (
                                <div className="flex aspect-video w-full items-center justify-center text-sm text-neutral-400">
                                    The player is unavailable. Try the trailer or backdrop instead.
                                </div>
                            ) : activeTab === 'trailer' && trailer ? (
                                <div className="aspect-video w-full">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                                        title={details.title || details.name}
                                        className="w-full h-full border-0"
                                        onError={() => setPlayerUnavailable(true)}
                                        allow="autoplay; encrypted-media; fullscreen"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : details.backdrop_path && !backdropUnavailable ? (
                                <div className="aspect-video w-full overflow-hidden">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
                                        alt={details.title || details.name || 'Title backdrop'}
                                        onError={() => setBackdropUnavailable(true)}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video w-full flex items-center justify-center text-neutral-400 text-xs">
                                    No preview image available
                                </div>
                            )}
                        </div>

                        {mediaType === 'tv' && seasons.length > 0 && (
                            <section className="bg-neutral-950 border-b border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setEpisodesOpen((open) => !open)}
                                    aria-expanded={episodesOpen}
                                    className="w-full flex items-center justify-between px-6 py-3 text-left text-sm font-semibold text-neutral-200 hover:bg-neutral-900 transition-colors sm:hidden"
                                >
                                    <span>Episodes · S{currentSeasonNumber} E{selectedEpisode}</span>
                                    {episodesOpen ? <ChevronLeft className="w-4 h-4 rotate-90" /> : <ChevronRight className="w-4 h-4 rotate-90" />}
                                </button>

                                <div className={`${episodesOpen ? 'block' : 'hidden'} sm:block px-6 py-4`}>
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <label className="flex items-center gap-2 text-xs text-neutral-400">
                                            <span>Season</span>
                                            <select
                                                value={currentSeasonNumber}
                                                onChange={(event) => {
                                                    setSelectedSeason(Number(event.target.value));
                                                    setSelectedEpisode(1);
                                                }}
                                                className="bg-neutral-800 border border-neutral-700 text-white rounded-md px-2 py-1.5 focus:outline-none focus:border-amber-500"
                                            >
                                                {seasons.map((season) => (
                                                    <option key={season.id || season.season_number} value={season.season_number}>
                                                        Season {season.season_number}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => navigateEpisode('previous')}
                                                disabled={!hasPreviousEpisode}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-800 text-neutral-200 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-colors"
                                            >
                                                <ChevronLeft className="w-3.5 h-3.5" />
                                                Previous
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigateEpisode('next')}
                                                disabled={!hasNextEpisode}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-colors"
                                            >
                                                Next
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-4 max-h-48 overflow-y-auto">
                                        {Array.from({ length: episodeCount }, (_, index) => index + 1).map((episodeNumber) => (
                                            <button
                                                type="button"
                                                key={episodeNumber}
                                                onClick={() => setSelectedEpisode(episodeNumber)}
                                                aria-current={selectedEpisode === episodeNumber ? 'true' : undefined}
                                                className={`px-3 py-2 rounded-md text-xs text-left transition-colors ${
                                                    selectedEpisode === episodeNumber
                                                        ? 'bg-amber-500 text-black font-bold'
                                                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                                }`}
                                            >
                                                Episode {episodeNumber}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

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
                            <h2 id="movie-dialog-title" className="text-2xl font-bold">{details.title || details.name || 'Untitled title'}</h2>
                            {details.tagline && (
                                <p className="text-neutral-400 italic text-sm mt-1">{details.tagline}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 mt-4">
                                <span className="flex items-center gap-1 text-amber-400 font-bold">
                                    <Star className="w-4 h-4 fill-amber-400" />
                                    {details.vote_average ? Number(details.vote_average).toFixed(1) : 'NR'} / 10
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-neutral-400" />
                                    {details.release_date || details.first_air_date || 'Release date unavailable'}
                                </span>
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
                                <p id="movie-dialog-description" className="text-neutral-300 text-sm mt-1 leading-relaxed">
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