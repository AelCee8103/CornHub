export const VIDCORE_SANDBOX = 'allow-scripts allow-same-origin allow-forms allow-presentation';

export const getSandboxPolicy = (provider) => (
    // The policy is intentionally independent of media type; VidCore uses it for movies and TV.
    provider === 'vidcore' ? VIDCORE_SANDBOX : undefined
);

export const buildEmbedUrl = ({
    provider = 'vidsrc',
    mediaType,
    tmdbId,
    imdbId,
    season,
    episode,
    resumeAt = 0,
}) => {
    const embedType = mediaType === 'tv' ? 'tv' : 'movie';
    const episodePath = mediaType === 'tv' && season && episode ? `/${season}/${episode}` : '';
    const isVidCore = provider === 'vidcore';
    const targetId = isVidCore ? tmdbId : tmdbId || imdbId;

    if (!targetId) {
        return '';
    }

    const host = isVidCore ? 'vidcore.org' : 'vidsrc.sh';
    const autoplayValue = isVidCore ? 'true' : '1';
    const queryParams = new URLSearchParams({ autoplay: autoplayValue });

    if (resumeAt > 10) {
        queryParams.set('startAt', resumeAt.toString());
    }

    return `https://${host}/embed/${embedType}/${targetId}${episodePath}?${queryParams.toString()}`;
};
