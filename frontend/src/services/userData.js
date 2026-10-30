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

const getMediaId = (media) => Number(media.media_id || media.movie_id || media.id);
const getMediaType = (media) => media.media_type || media.mediaType || 'movie';
const getMediaTitle = (media) => media.title || media.name;
const getMediaDate = (media) => media.release_date || media.first_air_date || null;

export const addToWatchlist = async (media) => {
    const userId = await getUserId();
    const mediaId = getMediaId(media);
    const mediaType = getMediaType(media);
    const { data, error } = await supabase
        .from('watchlists')
        .upsert({
            user_id: userId,
            media_id: mediaId,
            media_type: mediaType,
            title: getMediaTitle(media),
            poster_path: media.poster_path,
            vote_average: media.vote_average,
            release_date: getMediaDate(media),
        }, { onConflict: 'user_id,media_type,media_id' })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const removeFromWatchlist = async (media, mediaType = 'movie') => {
    const userId = await getUserId();
    const mediaId = typeof media === 'object' ? getMediaId(media) : Number(media);
    const type = typeof media === 'object' ? getMediaType(media) : mediaType;
    const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', userId)
        .eq('media_id', mediaId)
        .eq('media_type', type);

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

export const addMediaToPlaylist = async (playlistId, media) => {
    const mediaId = getMediaId(media);
    const { data, error } = await supabase
        .from('playlist_items')
        .insert({
            playlist_id: playlistId,
            media_id: mediaId,
            media_type: getMediaType(media),
            title: getMediaTitle(media),
            poster_path: media.poster_path,
            vote_average: media.vote_average,
            release_date: getMediaDate(media),
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

export const removeMediaFromPlaylist = async (playlistId, media, mediaType = 'movie') => {
    const mediaId = typeof media === 'object' ? getMediaId(media) : Number(media);
    const type = typeof media === 'object' ? getMediaType(media) : mediaType;
    const { error } = await supabase
        .from('playlist_items')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('media_id', mediaId)
        .eq('media_type', type);

    if (error) throw error;
};

export const addMovieToPlaylist = addMediaToPlaylist;
export const removeMovieFromPlaylist = removeMediaFromPlaylist;
