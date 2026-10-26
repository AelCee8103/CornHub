<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
   {
       Schema::create('watchlists', function (Blueprint $table) {
           $table->id();
           $table->foreignId('user_id')->constrained()->cascadeOnDelete();
           $table->unsignedBigInteger('movie_id');
           $table->string('title');
           $table->string('poster_path')->nullable();
           $table->decimal('vote_average', 3, 1)->nullable();
           $table->string('release_date')->nullable();
           $table->timestamps();

           // Prevent adding duplicate movies to the same user's watchlist
           $table->unique(['user_id', 'movie_id']);
       });
   }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('watchlists');
    }
};
