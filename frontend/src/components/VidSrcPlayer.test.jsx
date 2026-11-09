import { describe, expect, it } from 'vitest';
import { buildEmbedUrl, getSandboxPolicy, VIDCORE_SANDBOX } from './vidsrc';

describe('provider embed URLs', () => {
    it('prefers the TMDB ID when both identifiers are available', () => {
        expect(buildEmbedUrl({
            provider: 'vidsrc',
            mediaType: 'movie',
            tmdbId: 123,
            imdbId: 'tt123',
        })).toBe('https://vidsrc.sh/embed/movie/123?autoplay=1');
    });

    describe('provider iframe policies', () => {
        it('sandboxes VidCore for movie playback', () => {
            expect(getSandboxPolicy('vidcore', 'movie')).toBe(VIDCORE_SANDBOX);
        });

        it('uses the same VidCore sandbox policy for TV playback', () => {
            expect(getSandboxPolicy('vidcore', 'tv')).toBe(VIDCORE_SANDBOX);
        });

        it('does not sandbox VidSrc', () => {
            expect(getSandboxPolicy('vidsrc')).toBeUndefined();
        });
    });

    it('uses the IMDb ID when no TMDB ID is available', () => {
        expect(buildEmbedUrl({
            provider: 'vidsrc',
            mediaType: 'movie',
            imdbId: 'tt123',
        })).toBe('https://vidsrc.sh/embed/movie/tt123?autoplay=1');
    });

    it('uses the canonical season and episode path', () => {
        expect(buildEmbedUrl({
            provider: 'vidsrc',
            mediaType: 'tv',
            tmdbId: 456,
            season: 2,
            episode: 3,
            resumeAt: 120,
        })).toBe('https://vidsrc.sh/embed/tv/456/2/3?autoplay=1&startAt=120');
    });

    it('builds a VidCore movie URL with the TMDB ID', () => {
        expect(buildEmbedUrl({
            provider: 'vidcore',
            mediaType: 'movie',
            tmdbId: 533535,
        })).toBe('https://vidcore.org/embed/movie/533535?autoplay=true');
    });

    it('builds a VidCore TV URL with resume playback', () => {
        expect(buildEmbedUrl({
            provider: 'vidcore',
            mediaType: 'tv',
            tmdbId: 1399,
            season: 1,
            episode: 2,
            resumeAt: 120,
        })).toBe('https://vidcore.org/embed/tv/1399/1/2?autoplay=true&startAt=120');
    });

    it('does not build a VidCore URL without a TMDB ID', () => {
        expect(buildEmbedUrl({
            provider: 'vidcore',
            mediaType: 'movie',
            imdbId: 'tt123',
        })).toBe('');
    });
});
