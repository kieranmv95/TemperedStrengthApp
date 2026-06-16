import { exerciseVideoStyles as styles } from '@/src/components/exercise/exerciseVideoStyles';
import {
  getYoutubeEmbedHtml,
  YOUTUBE_EMBED_ORIGIN,
} from '@/src/utils/youtube';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

type YoutubeEmbedProps = {
  noRoundCorners?: boolean;
  youtubeId: string;
  accessibilityLabel?: string;
};

export function YoutubeEmbed({
  noRoundCorners = false,
  youtubeId,
  accessibilityLabel,
}: YoutubeEmbedProps) {
  const embedHtml = useMemo(
    () => getYoutubeEmbedHtml(youtubeId),
    [youtubeId]
  );

  return (
    <View style={[styles.videoContainer, noRoundCorners && { borderRadius: 0 }]}>
      <WebView
        source={{
          html: embedHtml,
          baseUrl: YOUTUBE_EMBED_ORIGIN,
        }}
        style={styles.webView}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
}
