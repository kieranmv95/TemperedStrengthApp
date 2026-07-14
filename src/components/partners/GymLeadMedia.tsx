import { YoutubeEmbed } from '@/src/components/exercise/YoutubeEmbed';
import { partnerDetailStyles as styles } from '@/src/components/partners/partnerDetailStyles';
import type { PublicGymListing } from '@/src/types/partner';
import { gymHasImage, gymHasVideo } from '@/src/types/partner';
import { Image } from 'expo-image';
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
      <View style={styles.gymLeadMediaFrame}>
        <Image
          source={{ uri: gym.gymImageUrl }}
          style={styles.gymLeadMediaImage}
          contentFit="cover"
          accessibilityLabel={`${gym.name} photo`}
        />
      </View>
    );
  }

  return null;
}
