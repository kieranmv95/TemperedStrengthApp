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
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const TOOL_TILE_WIDTH = 132;
const ICON_WELL_SIZE = 36;

type ToolTileProps = {
  tool: ToolDefinition;
  onPress: () => void;
  fill?: boolean;
};

function ToolTile({ tool, onPress, fill = false }: ToolTileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        elevation.raised,
        fill ? styles.tileFill : styles.tileFixed,
        pressed && styles.tilePressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={tool.title}
      accessibilityHint={tool.description}
    >
      <View style={styles.iconWell}>
        <Ionicons
          name={tool.icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color={color.gold}
        />
      </View>
      <Text style={styles.tileLabel} numberOfLines={2}>
        {tool.pillLabel}
      </Text>
    </Pressable>
  );
}

type HubToolsSectionProps = {
  onOpenTool: (route: ToolRoute) => void;
};

/**
 * Tools as a horizontal row where the next tile peeks in, or as a wrapped
 * grid after "See all".
 */
export function HubToolsSection({ onOpenTool }: HubToolsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionHeader
          title="Tools"
          actionLabel={showAll ? 'Show less' : 'See all'}
          onActionPress={() => setShowAll((prev) => !prev)}
          actionAccessibilityLabel={
            showAll ? 'Show fewer tools' : 'See all tools'
          }
        />
        <Text style={styles.description}>
          Calculators and training utilities that work offline.
        </Text>
      </View>
      {showAll ? (
        <View style={styles.grid}>
          {TOOLS.map((tool) => (
            <View key={tool.id} style={styles.gridCell}>
              <ToolTile
                tool={tool}
                onPress={() => onOpenTool(tool.route)}
                fill
              />
            </View>
          ))}
        </View>
      ) : (
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
    gap: space.xs,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
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
  tileLabel: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
});
