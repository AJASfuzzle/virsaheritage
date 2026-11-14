import { describe, expect, it } from 'vitest';
import { sourceFor, withSourceWhitespace } from './dom-translation';

describe('global translation source tracking', () => {
  it('retains separate sources for the two text nodes around Kitab', () => {
    const first = sourceFor('India speaks in over a thousand tongues. Many will be silent within a generation. ');
    const last = sourceFor(' records them - pronunciation, proverb, song and script - for the centuries to come.');
    expect(first.original).not.toEqual(last.original);
    expect(last.original).toContain('records them');
  });
  it('uses original English when switching from Hindi to Gujarati', () => {
    expect(sourceFor('नमस्ते', { original: 'Hello', applied: 'नमस्ते' }).original).toBe('Hello');
  });
  it('updates the source when React changes dynamic content', () => {
    expect(sourceFor('Liked by you', { original: 'Like', applied: 'पसंद' }).original).toBe('Liked by you');
  });
  it('preserves spaces around inline translated text', () => {
    expect(withSourceWhitespace(' records them ', 'उन्हें दर्ज करता है')).toBe(' उन्हें दर्ज करता है ');
  });
});
