import { describe, expect, it } from 'vitest';
import { parseMediaId, parsePage, parseSearchQuery } from './tmdb';

describe('TMDB request validation', () => {
    it('accepts bounded page and media ID values', () => {
        expect(parsePage(undefined)).toBe('1');
        expect(parsePage('500')).toBe('500');
        expect(parseMediaId('123')).toBe('123');
    });

    it('rejects invalid or unbounded values', () => {
        expect(parsePage('0')).toBeNull();
        expect(parsePage('501')).toBeNull();
        expect(parseMediaId('1abc')).toBeNull();
        expect(parseSearchQuery('')).toBeNull();
        expect(parseSearchQuery('a'.repeat(101))).toBeNull();
    });
});
