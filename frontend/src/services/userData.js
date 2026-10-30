import { supabase } from '../lib/supabase';

const getUserId = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        throw error || new Error('You must be signed in.');
    }
    return user.id;
};

export const listWatchlist = async () => {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('watchlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const addToWatchlist = async (movie) => {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('watchlists')
        .upsert({
            user_id: userId,
            movie_id: Number(movie.movie_id || movie.id),
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date || null,
        }, { onConflict: 'user_id,movie_id' })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const removeFromWatchlist = async (movieId) => {
    const userId = await getUserId();
    const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', Number(movieId));

    if (error) throw error;
};

export const listPlaylists = async () => {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('playlists')
        .select('*, playlist_items(count)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((playlist) => ({
        ...playlist,
        items_count: playlist.playlist_items?.[0]?.count || 0,
    }));
};

export const getPlaylist = async (playlistId) => {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('playlists')
        .select('*, playlist_items(*)')
        .eq('id', playlistId)
        .eq('user_id', userId)
        .single();

    if (error) throw error;
    return { ...data, items: data.playlist_items || [] };
};

export const createPlaylist = async (name, description = '') => {
    const userId = await getUserId();
    const { data, error } = await supabase
        .from('playlists')
        .insert({ user_id: userId, name: name.trim(), description: description.trim() || null })
        .select()
        .single();

    if (error) throw error;
    return { ...data, items_count: 0 };
};

export const deletePlaylist = async (playlistId) => {
    const userId = await getUserId();
    const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId)
        .eq('user_id', userId);

    if (error) throw error;
};

export const addMovieToPlaylist = async (playlistId, movie) => {
    const { data, error } = await supabase
        .from('playlist_items')
        .insert({
            playlist_id: playlistId,
            movie_id: Number(movie.movie_id || movie.id),
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date || null,
        })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            return { alreadyExists: true };
        }
        throw error;
    }

    return { item: data, alreadyExists: false };
};

export const removeMovieFromPlaylist = async (playlistId, movieId) => {
    const { error } = await supabase
        .from('playlist_items')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('movie_id', Number(movieId));

    if (error) throw error;
};
