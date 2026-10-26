<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaylistItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'playlist_id',
        'movie_id',
        'title',
        'poster_path',
        'vote_average',
        'release_date',
    ];

    public function playlist()
    {
        return $this->belongsTo(Playlist::class);
    }
}
