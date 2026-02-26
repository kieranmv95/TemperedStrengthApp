import type { Playlist } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '../../constants/theme';
import * as Linking from 'expo-linking';
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type PlaylistCardProps = {
  playlist: Playlist;
};

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const handlePress = async () => {
    try {
      const canOpen = await Linking.canOpenURL(playlist.itunesUrl);
      if (canOpen) {
        await Linking.openURL(playlist.itunesUrl);
      } else {
        Alert.alert(
          'Cannot Open',
          'Unable to open this playlist. Make sure you have Apple Music installed.'
        );
      }
    } catch (error) {
      console.error('Error opening playlist:', error);
      Alert.alert('Error', 'Failed to open the playlist.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: playlist.artworkUrl }} style={styles.artwork} />
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={24} color={Colors.textPrimary} />
        </View>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {playlist.title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {playlist.subtitle}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: Spacing.xl,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  artwork: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.backgroundElevated,
  },
  playOverlay: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.accentOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.md,
    marginTop: 2,
  },
});
