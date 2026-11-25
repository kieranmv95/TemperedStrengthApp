import { NumberField } from '@/src/components/ds';
import { BarbellLoadResultView } from '@/src/components/barbellLoad/BarbellLoadResult';
import { OwnedPlatesPicker } from '@/src/components/barbellLoad/OwnedPlatesPicker';
import {
  ToolScreenShell,
  toolFormStyles as styles,
} from '@/src/components/tools/ToolScreenShell';
import { space } from '@/src/constants/tokens';
import { getToolById } from '@/src/data/tools';
import { useBarbellLoadPrefs } from '@/src/hooks/useBarbellLoadPrefs';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import { increment } from '@/src/services/metricService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import { getBarbellWeight } from '@/src/utils/barbellLoad';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const TOOL = getToolById('bar-loader')!;

function parseTargetWeight(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n <= 0) {
    return null;
  }
  return n;
}

export function BarLoaderScreen() {
  const posthog = usePostHog();
  const { unit } = useWeightUnit();
  const {
    barType,
    ownedPlates,
    setBarType,
    setOwnedPlatesForUnit,
  } = useBarbellLoadPrefs(unit);

  const [weightInput, setWeightInput] = useState('100');
  const targetWeight = parseTargetWeight(weightInput);
  const minBar = getBarbellWeight(barType, unit);

  useFocusEffect(
    useCallback(() => {
      increment('tool_bar_loader_views');
      posthog.capture(posthogEventsNames.content.toolView, {
        tool_id: TOOL.id,
      });
    }, [posthog])
  );

  return (
    <ToolScreenShell title={TOOL.title}>
      <View style={localStyles.content}>
        <Text style={styles.cardDescription}>{TOOL.description}</Text>

        <NumberField
          label={`Target weight (${unit})`}
          value={weightInput}
          onChangeText={setWeightInput}
          placeholder={unit}
          allowDecimal
        />

        {targetWeight === null ? (
          <Text
            style={styles.errorText}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            Enter a target weight greater than 0.
          </Text>
        ) : targetWeight < minBar ? (
          <Text
            style={styles.errorText}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            Target is below the bar ({minBar} {unit}). Raise the weight or
            switch bars.
          </Text>
        ) : null}

        {targetWeight !== null ? (
          <BarbellLoadResultView
            targetWeight={targetWeight}
            unit={unit}
            barType={barType}
            ownedPlates={ownedPlates}
            onBarTypeChange={(next) => {
              void setBarType(next);
            }}
          />
        ) : null}

        <OwnedPlatesPicker
          unit={unit}
          ownedPlates={ownedPlates}
          onChange={(plates) => {
            void setOwnedPlatesForUnit(plates);
          }}
        />
      </View>
    </ToolScreenShell>
  );
}

const localStyles = StyleSheet.create({
  content: {
    gap: space.md,
  },
});
