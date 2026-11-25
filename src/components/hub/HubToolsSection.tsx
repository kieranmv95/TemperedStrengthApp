import { SectionHeader } from '@/src/components/ds';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { TOOLS, type ToolDefinition, type ToolRoute } from '@/src/data/tools';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const TOOL_TILE_WIDTH = 132;
const ICON_WELL_SIZE = 40;

type ToolTileProps = {
  tool: ToolDefinition;
  onPress: () => void;
  /** Explore grid: taller tile with a short blurb under the title. */
  showBlurb?: boolean;
  fill?: boolean;
};

function ToolTile({
  tool,
  onPress,
  showBlurb = false,
  fill = false,
}: ToolTileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        elevation.raised,
        fill ? styles.tileFill : styles.tileFixed,
        showBlurb && styles.tileWithBlurb,
        pressed && styles.tilePressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={tool.title}
      accessibilityHint={tool.description}
    >
      <View style={styles.iconWell}>
        <Ionicons
          name={tool.icon as keyof typeof Ionicons.glyphMap}
          size={22}
          color={color.gold}
        />
      </View>
      <View style={styles.copy}>
        <Text style={styles.tileLabel} numberOfLines={2}>
          {tool.pillLabel}
        </Text>
        {showBlurb ? (
          <Text style={styles.tileBlurb} numberOfLines={3}>
            {tool.blurb}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

type HubToolsSectionProps = {
  onOpenTool: (route: ToolRoute) => void;
  /** Home shows the scrolling tiles only, with no title. */
  tilesOnly?: boolean;
};

/**
 * Explore shows the full tools grid with short blurbs. Home can pass
 * `tilesOnly` for a compact horizontal row without the section header.
 */
export function HubToolsSection({
  onOpenTool,
  tilesOnly = false,
}: HubToolsSectionProps) {
  return (
    <View style={styles.section}>
      {tilesOnly ? null : (
        <View style={styles.header}>
          <SectionHeader title="Tools" />
          <Text style={styles.description}>
            Calculators and training utilities that work offline.
          </Text>
        </View>
      )}
      {tilesOnly ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
          snapToInterval={TOOL_TILE_WIDTH + space.sm}
          decelerationRate="fast"
        >
          {TOOLS.map((tool) => (
            <ToolTile
              key={tool.id}
              tool={tool}
              onPress={() => onOpenTool(tool.route)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.grid}>
          {TOOLS.map((tool) => (
            <View key={tool.id} style={styles.gridCell}>
              <ToolTile
                tool={tool}
                onPress={() => onOpenTool(tool.route)}
                showBlurb
                fill
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.sm,
  },
  header: {
    paddingHorizontal: space.md,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
  row: {
    gap: space.sm,
    paddingHorizontal: space.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    paddingHorizontal: space.md,
  },
  gridCell: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  tile: {
    minHeight: MIN_TARGET_SIZE * 2,
    padding: space.sm,
    gap: space.sm,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
  },
  tileWithBlurb: {
    minHeight: MIN_TARGET_SIZE * 2.75,
    padding: space.md,
  },
  tileFixed: {
    width: TOOL_TILE_WIDTH,
  },
  tileFill: {
    flex: 1,
  },
  tilePressed: {
    backgroundColor: color.surface2,
  },
  iconWell: {
    width: ICON_WELL_SIZE,
    height: ICON_WELL_SIZE,
    borderRadius: radius.sm,
    backgroundColor: color.goldTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: space.xxs,
  },
  tileLabel: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  tileBlurb: {
    ...typography.caption,
    color: color.textSecondary,
  },
});
