import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Playlist } from "@/src/data/brief";

interface PlaylistCardProps {
  playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const handlePress = async () => {
    try {
      const canOpen = await Linking.canOpenURL(playlist.itunesUrl);
      if (canOpen) {
        await Linking.openURL(playlist.itunesUrl);
      } else {
        Alert.alert(
          "Cannot Open",
          "Unable to open this playlist. Make sure you have Apple Music installed."
        );
      }
    } catch (error) {
      console.error("Error opening playlist:", error);
      Alert.alert("Error", "Failed to open the playlist.");
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
          <Ionicons name="play" size={24} color="#FFFFFF" />
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
    marginRight: 12,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  artwork: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#2A2A2A",
  },
  playOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(201, 176, 114, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  subtitle: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
});

