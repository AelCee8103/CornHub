import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Server, ShieldCheck } from 'lucide-react';

const SERVERS = [
  { id: 'vidsrc.sh', name: 'Server 1 (vidsrc.sh)' },
  { id: 'vidsrc.pm', name: 'Server 2 (vidsrc.pm)' },
  { id: 'vidsrc.net', name: 'Server 3 (vidsrc.net)' },
  { id: 'vidsrc.xyz', name: 'Server 4 (vidsrc.xyz)' },
];

export default function VidSrcPlayer({ mediaType = 'movie', tmdbId, imdbId, title }) {
  const targetId = imdbId || tmdbId;
  const storageKey = `vidsrc_progress_${mediaType}_${targetId}`;

  const [currentServer, setCurrentServer] = useState('vidsrc.sh');
  const [savedProgress, setSavedProgress] = useState(0);
  const [resumeAt, setResumeAt] = useState(0);
  const [useResume, setUseResume] = useState(true);

  // Check saved progress on mount
  useEffect(() => {
    if (!targetId) return;
    const progress = localStorage.getItem(storageKey);
    if (progress && Number(progress) > 10) {
      const savedSeconds = Math.floor(Number(progress));
      setSavedProgress(savedSeconds);
      setResumeAt(savedSeconds);
    } else {
      setSavedProgress(0);
      setResumeAt(0);
    }
  }, [targetId, storageKey]);

  // Listen to postMessage player events from VidSrc
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
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [storageKey]);

  if (!targetId) {
    return (
      <div className="aspect-video w-full flex items-center justify-center bg-neutral-900 text-neutral-400 text-xs">
        Media ID is missing for playback.
      </div>
    );
  }

  const queryParams = new URLSearchParams();
  queryParams.set('autoplay', '1');
  if (useResume && resumeAt > 10) {
    queryParams.set('startAt', resumeAt.toString());
  }

  const embedType = mediaType === 'tv' ? 'tv' : 'movie';
  const embedUrl = `https://${currentServer}/embed/${embedType}/${targetId}?${queryParams.toString()}`;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleResetProgress = () => {
    localStorage.removeItem(storageKey);
    setSavedProgress(0);
    setResumeAt(0);
    setUseResume(false);
  };

  return (
    <div className="flex flex-col w-full bg-neutral-950">
      {/* Player Iframe */}
      <div className="relative aspect-video w-full bg-black overflow-hidden shadow-2xl">
        <iframe
          key={`${embedUrl}-${useResume}`}
          src={embedUrl}
          title={title || (mediaType === 'tv' ? 'TV Player' : 'Movie Player')}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Player Toolbar / Controls */}
      <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-300">
        {/* Server Switcher */}
        <div className="flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-neutral-400">Source:</span>
          <select
            value={currentServer}
            onChange={(e) => setCurrentServer(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white rounded-md px-2 py-1 text-xs focus:outline-none focus:border-amber-500"
          >
            {SERVERS.map((srv) => (
              <option key={srv.id} value={srv.id}>
                {srv.name}
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
            <span>VidSrc Stream Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
