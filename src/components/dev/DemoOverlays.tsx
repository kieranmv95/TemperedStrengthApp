import {
  ActionChip,
  AnimatedNumber,
  BottomSheet,
  FilterChip,
} from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useToast } from '@/src/hooks/toast-context';
import React, { useRef, useState, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const DEMO_DISCIPLINES = [
  { label: 'Strength', count: 22 },
  { label: 'Hyrox', count: 9 },
  { label: 'Conditioning', count: 31 },
  { label: 'Girl Games', count: 12 },
] as const;

const DEMO_TOTAL = 168;

/** Dev-only: a filters-style sheet and toast triggers. */
export function DemoOverlays() {
  const { showToast } = useToast();
  const triggerRef = useRef<ComponentRef<typeof View>>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const matchCount =
    selected.length === 0
      ? DEMO_TOTAL
      : DEMO_DISCIPLINES.filter((d) => selected.includes(d.label)).reduce(
          (sum, d) => sum + d.count,
          0
        );

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View ref={triggerRef} collapsable={false}>
          <ActionChip
            label="Open filters sheet"
            icon="options-outline"
            tone="neutral"
            onPress={() => setSheetVisible(true)}
          />
        </View>
        <ActionChip
          label="Set logged toast"
          icon="checkmark-circle-outline"
          tone="neutral"
          onPress={() =>
            showToast({
              message: 'Set 2 logged',
              icon: 'checkmark-circle',
              action: {
                label: 'Undo',
                onPress: () => showToast({ message: 'Set 2 un-logged' }),
              },
            })
          }
        />
        <ActionChip
          label="Code copied toast"
          icon="copy-outline"
          tone="neutral"
          onPress={() => showToast({ message: 'Code TS10 copied' })}
        />
      </View>

      <BottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title="Filters"
        returnFocusRef={triggerRef}
        footer={
          <View style={styles.footer}>
            <Pressable
              onPress={() => setSelected([])}
              disabled={selected.length === 0}
              style={[
                styles.footerButton,
                styles.resetButton,
                selected.length === 0 && styles.resetDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Reset filters"
              accessibilityState={{ disabled: selected.length === 0 }}
            >
              <Text
                style={[
                  styles.resetLabel,
                  selected.length === 0 && styles.resetLabelDisabled,
                ]}
              >
                Reset
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSheetVisible(false)}
              style={[styles.footerButton, styles.showButton]}
              accessibilityRole="button"
              accessibilityLabel={`Show ${matchCount} workouts`}
            >
              <Text style={styles.showLabel}>Show </Text>
              <AnimatedNumber value={matchCount} style={styles.showLabel} />
            </Pressable>
          </View>
        }
      >
        <Text style={styles.sectionLabel} accessibilityRole="header">
          Discipline
        </Text>
        <View style={styles.row}>
          {DEMO_DISCIPLINES.map((discipline) => (
            <FilterChip
              key={discipline.label}
              label={discipline.label}
              count={discipline.count}
              selected={selected.includes(discipline.label)}
              onPress={() => toggle(discipline.label)}
              accessibilityLabel={`${discipline.label}, ${discipline.count} workouts`}
            />
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  sectionLabel: {
    ...typography.headline,
    color: color.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    gap: space.sm,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    minHeight: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  resetDisabled: {
    borderColor: color.surface3,
  },
  resetLabel: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  resetLabelDisabled: {
    color: color.textDisabled,
  },
  showButton: {
    backgroundColor: color.gold,
  },
  showLabel: {
    ...typography.calloutStrong,
    fontVariant: ['tabular-nums'],
    color: color.onGold,
  },
});
