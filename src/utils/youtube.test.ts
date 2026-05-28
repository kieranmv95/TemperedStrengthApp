import {
  getYoutubeEmbedHtml,
  getYoutubeEmbedUrl,
  YOUTUBE_EMBED_ORIGIN,
} from './youtube';

describe('youtube utils', () => {
  it('builds embed URL with origin for WebView referrer', () => {
    expect(getYoutubeEmbedUrl('abc123')).toBe(
      `https://www.youtube.com/embed/abc123?playsinline=1&modestbranding=1&rel=0&origin=${encodeURIComponent(YOUTUBE_EMBED_ORIGIN)}`
    );
  });

  it('builds HTML embed with referrer policy', () => {
    const html = getYoutubeEmbedHtml('abc123');
    expect(html).toContain('referrerpolicy="strict-origin-when-cross-origin"');
    expect(html).toContain('abc123');
  });
});
