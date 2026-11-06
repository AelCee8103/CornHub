import { describe, expect, it } from 'vitest';
import { getMediaId, getMediaKey, getMediaType } from './media';

describe('media identity', () => {
    it('keeps movie and TV IDs distinct', () => {
        expect(getMediaKey({ id: 10, mediaType: 'movie' })).toBe('movie:10');
        expect(getMediaKey({ id: 10, mediaType: 'tv' })).toBe('tv:10');
    });

    it('supports persisted legacy movie rows', () => {
        const row = { movie_id: 42, title: 'Legacy title' };
        expect(getMediaId(row)).toBe(42);
        expect(getMediaType(row)).toBe('movie');
        expect(getMediaKey(row)).toBe('movie:42');
    });
});
