<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Watchlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'movie_id',
        'title',
        'poster_path',
        'vote_average',
        'release_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
