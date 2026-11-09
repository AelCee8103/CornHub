import { useState, useEffect } from 'react';
import { Play, RotateCcw, Server, ShieldCheck } from 'lucide-react';
import { buildEmbedUrl, getSandboxPolicy } from './vidsrc';

const IFRAME_LOAD_TIMEOUT_MS = 15000;

const SOURCES = [
  { id: 'vidcore', name: 'VidCore', requiresTmdb: true },
  { id: 'vidsrc', name: 'VidSrc (vidsrc.sh)', requiresTmdb: false },
];

export default function VidSrcPlayer({
  mediaType = 'movie',
  tmdbId,
  imdbId,
  title,
  season,
  episode,
  onEpisodeComplete,
}) {
  const targetId = tmdbId || imdbId;
  const episodeKey = mediaType === 'tv' && season && episode ? `_${season}_${episode}` : '';
  const storageKey = `vidsrc_progress_${mediaType}_${targetId}${episodeKey}`;

  const [currentSource, setCurrentSource] = useState(tmdbId ? 'vidcore' : 'vidsrc');
  const [savedProgress, setSavedProgress] = useState(0);
  const [resumeState, setResumeState] = useState({ key: '', seconds: 0 });
  const [useResume, setUseResume] = useState(true);
  const [loadState, setLoadState] = useState({ url: '', loaded: false, timedOut: false });
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    if (!targetId) return;
    const progress = localStorage.getItem(storageKey);
    const savedSeconds = progress && Number(progress) > 10 ? Math.floor(Number(progress)) : 0;
    const timerId = window.setTimeout(() => {
      setSavedProgress(savedSeconds);
      setResumeState({ key: storageKey, seconds: savedSeconds });
    }, 0);
    return () => window.clearTimeout(timerId);
  }, [targetId, storageKey]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type !== 'PLAYER_EVENT') return;

      const data = event.data.data;
      if (!data) return;

      const { player_status, player_progress } = data;
      if ((player_status === 'playing' || player_status === 'paused') && player_progress) {
        localStorage.setItem(storageKey, player_progress);
        setSavedProgress(Math.floor(player_progress));
      } else if (player_status === 'completed') {
        localStorage.removeItem(storageKey);
        setSavedProgress(0);
        onEpisodeComplete?.();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEpisodeComplete, storageKey]);

  const resumeReady = resumeState.key === storageKey;
  const resumeAt = resumeReady && useResume ? resumeState.seconds : 0;
  const embedUrl = resumeReady
    ? buildEmbedUrl({ provider: currentSource, mediaType, tmdbId, imdbId, season, episode, resumeAt })
    : '';
  const playerLoading = resumeReady && loadState.url === embedUrl && !loadState.loaded && !loadState.timedOut;
  const playerTimedOut = resumeReady && loadState.url === embedUrl && loadState.timedOut;

  useEffect(() => {
    if (!embedUrl) return undefined;

    const timeoutId = window.setTimeout(() => {
      setLoadState((state) => (
        state.url === embedUrl && !state.loaded
          ? { ...state, timedOut: true }
          : state.url === embedUrl
            ? state
            : { url: embedUrl, loaded: false, timedOut: true }
      ));
    }, IFRAME_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timeoutId);
  }, [embedUrl]);

  if (!targetId) {
    return (
      <div className="aspect-video w-full flex items-center justify-center bg-neutral-900 text-neutral-400 text-xs">
        Media ID is missing for playback.
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleResetProgress = () => {
    localStorage.removeItem(storageKey);
    setSavedProgress(0);
    setResumeState({ key: storageKey, seconds: 0 });
    setUseResume(false);
  };

  const handleRetry = () => {
    setLoadState({ url: embedUrl, loaded: false, timedOut: false });
    setRetryNonce((nonce) => nonce + 1);
  };

  return (
    <div className="flex flex-col w-full bg-neutral-950">
      {/* Player Iframe */}
      <div className="relative aspect-video w-full bg-black overflow-hidden shadow-2xl">
        {!resumeReady ? (
          <div className="flex aspect-video w-full items-center justify-center text-sm text-neutral-400">
            Preparing player...
          </div>
        ) : <iframe
          key={`${embedUrl}-${retryNonce}`}
          src={embedUrl}
          title={title || (mediaType === 'tv' ? 'TV Player' : 'Movie Player')}
          className="w-full h-full border-0"
          sandbox={getSandboxPolicy(currentSource, mediaType)}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoadState({ url: embedUrl, loaded: true, timedOut: false })}
          onError={() => setLoadState({ url: embedUrl, loaded: false, timedOut: true })}
        ></iframe>}
        {playerLoading ? (
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3 text-xs text-neutral-400">
            Loading player...
          </div>
        ) : null}
        {playerTimedOut ? (
          <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-2 bg-black/80 px-3 py-2 text-xs text-neutral-300">
            <span>Player is taking longer than usual.</span>
            <button
              type="button"
              onClick={handleRetry}
              className="rounded bg-neutral-700 px-2 py-1 text-white hover:bg-neutral-600"
            >
              Retry
            </button>
            <span className="text-neutral-500">or choose another source below</span>
          </div>
        ) : null}
      </div>

      {/* Player Toolbar / Controls */}
      <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-300">
        {/* Server Switcher */}
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-neutral-400">Source:</span>
          <select
            value={currentSource}
            onChange={(e) => setCurrentSource(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white rounded-md px-2 py-1 text-xs focus:outline-none focus:border-amber-500"
          >
            {SOURCES.map((source) => (
              <option
                key={source.id}
                value={source.id}
                disabled={source.requiresTmdb && !tmdbId}
              >
                {source.name}
              </option>
            ))}
          </select>
        </div>

        {/* Resume Watch Status / Actions */}
        <div className="flex items-center gap-3">
          {savedProgress > 10 && (
            <div className="flex items-center gap-2 bg-neutral-800/80 px-2.5 py-1 rounded-md border border-neutral-700">
              <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>
                Resume from <strong className="text-white">{formatTime(savedProgress)}</strong>
              </span>
              <button
                onClick={handleResetProgress}
                title="Restart from beginning"
                className="text-neutral-400 hover:text-red-400 ml-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1 text-emerald-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{currentSource === 'vidcore' ? 'VidCore Stream Ready' : 'VidSrc Stream Ready'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
