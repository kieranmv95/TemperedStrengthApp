import type { Exercise } from '@/src/types/exercise';

/** Must match ios.bundleIdentifier / android.package in app.json */
export const YOUTUBE_EMBED_ORIGIN = 'https://com.kieranvenison.temperedstrengthapp';

export function getYoutubeEmbedUrl(youtubeId: string): string {
  const params = new URLSearchParams({
    playsinline: '1',
    modestbranding: '1',
    rel: '0',
    mute: '1',
    origin: YOUTUBE_EMBED_ORIGIN,
  });
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
}

/**
 * HTML iframe embed for WebView. Using baseUrl + referrer policy avoids YouTube error 153.
 */
export function getYoutubeEmbedHtml(youtubeId: string): string {
  const embedUrl = getYoutubeEmbedUrl(youtubeId);
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #000; }
    iframe { width: 100%; height: 100%; border: 0; }
  </style>
</head>
<body>
  <iframe
    src="${embedUrl}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    referrerpolicy="strict-origin-when-cross-origin"
  ></iframe>
</body>
</html>`;
}

export function exerciseHasVideo(exercise: Exercise | undefined): boolean {
  return !!exercise?.youtube_id;
}
