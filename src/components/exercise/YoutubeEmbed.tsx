import { exerciseVideoStyles as styles } from '@/src/components/exercise/exerciseVideoStyles';
import {
  getYoutubeEmbedHtml,
  YOUTUBE_EMBED_ORIGIN,
} from '@/src/utils/youtube';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

type YoutubeEmbedProps = {
  youtubeId: string;
  accessibilityLabel?: string;
};

export function YoutubeEmbed({
  youtubeId,
  accessibilityLabel,
}: YoutubeEmbedProps) {
  const embedHtml = useMemo(
    () => getYoutubeEmbedHtml(youtubeId),
    [youtubeId]
  );

  return (
    <View style={styles.videoContainer}>
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
