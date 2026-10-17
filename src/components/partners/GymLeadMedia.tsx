import { LoadingImage } from '@/src/components/ds';
import { YoutubeEmbed } from '@/src/components/exercise/YoutubeEmbed';
import { partnerDetailStyles as styles } from '@/src/components/partners/partnerDetailStyles';
import type { PublicGymListing } from '@/src/types/partner';
import { gymHasImage, gymHasVideo } from '@/src/types/partner';
import React from 'react';
import { View } from 'react-native';

type GymLeadMediaProps = {
  gym: PublicGymListing;
};

export function GymLeadMedia({ gym }: GymLeadMediaProps) {
  if (gymHasVideo(gym)) {
    return (
      <View style={styles.gymLeadMediaFrame}>
        <YoutubeEmbed
          youtubeId={gym.videoId}
          noRoundCorners
          fillParent
          accessibilityLabel={`Tour video for ${gym.name}`}
        />
      </View>
    );
  }

  if (gymHasImage(gym)) {
    return (
      <LoadingImage
        source={{ uri: gym.gymImageUrl }}
        style={styles.gymLeadMediaFrame}
        accessibilityLabel={`${gym.name} photo`}
      />
    );
  }

  return null;
}
