import React from 'react';
import { Star, Plus, Bookmark, Check, Trash2 } from 'lucide-react';

export default function MovieCard({
  movie,
  onSelect,
  isInWatchlist,
  onToggleWatchlist,
  onAddToPlaylist,
  onRemove,
}) {
  const movieId = movie.movie_id || movie.id;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'NR';

  return (
    <div className="group relative bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden cursor-pointer" onClick={() => onSelect(movieId)}>
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm text-amber-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          <h3
            className="text-white font-semibold text-sm line-clamp-1 hover:text-amber-400 cursor-pointer"
            onClick={() => onSelect(movieId)}
          >
            {movie.title}
          </h3>
          <p className="text-neutral-400 text-xs mt-0.5">{releaseYear}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-neutral-800">
          {onToggleWatchlist && (
            <button
              onClick={() => onToggleWatchlist(movie)}
              title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isInWatchlist
                  ? 'bg-amber-500 text-black'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
              }`}
            >
              {isInWatchlist ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isInWatchlist ? 'Saved' : 'Watchlist'}</span>
            </button>
          )}

          {onAddToPlaylist && (
            <button
              onClick={() => onAddToPlaylist(movie)}
              title="Add to Custom Playlist"
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

          {onRemove && (
            <button
              onClick={() => onRemove(movie)}
              title="Remove"
              className="bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}