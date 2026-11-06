export const getMediaId = (media) => Number(media.media_id || media.movie_id || media.id);
export const getMediaType = (media) => media.media_type || media.mediaType || 'movie';
export const getMediaKey = (media) => `${getMediaType(media)}:${getMediaId(media)}`;
