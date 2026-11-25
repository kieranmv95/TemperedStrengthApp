import { BottomSheet } from '@/src/components/ds';
import { BarbellLoadResultView } from '@/src/components/barbellLoad/BarbellLoadResult';
import { color, space, typography } from '@/src/constants/tokens';
import { useBarbellLoadPrefs } from '@/src/hooks/useBarbellLoadPrefs';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import {
  resolveBarbellSheetRequest,
  type OpenBarbellLoadOptions,
  type ResolvedBarbellLoad,
} from '@/src/utils/barbellLoad';
import { formatDisplayWeight } from '@/src/utils/oneRepMax';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type { OpenBarbellLoadOptions } from '@/src/utils/barbellLoad';

type BarbellLoadContextValue = {
  openBarbellLoad: (options: OpenBarbellLoadOptions) => void;
  closeBarbellLoad: () => void;
};

type SheetState = ResolvedBarbellLoad;

const BarbellLoadContext = createContext<BarbellLoadContextValue | null>(null);

/**
 * App-wide bar loader sheet. Call `openBarbellLoad` from any screen that has
 * a resolved absolute weight (e.g. gold load text in a workout).
 */
export function BarbellLoadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { unit } = useWeightUnit();
  const { barType, ownedPlates, setBarType } = useBarbellLoadPrefs(unit);
  const [sheet, setSheet] = useState<SheetState | null>(null);

  const closeBarbellLoad = useCallback(() => {
    setSheet(null);
  }, []);

  const openBarbellLoad = useCallback(
    (options: OpenBarbellLoadOptions) => {
      const resolved = resolveBarbellSheetRequest(options, barType);
      if (resolved === null) {
        return;
      }
      setSheet(resolved);
    },
    [barType]
  );

  const value = useMemo(
    () => ({ openBarbellLoad, closeBarbellLoad }),
    [openBarbellLoad, closeBarbellLoad]
  );

  const title =
    sheet?.label != null && sheet.label.length > 0
      ? `Bar load · ${sheet.label}`
      : sheet
        ? `Bar load · ${formatDisplayWeight(sheet.weight, unit)}`
        : 'Bar load';

  return (
    <BarbellLoadContext.Provider value={value}>
      {children}
      <BottomSheet
        visible={sheet !== null}
        onClose={closeBarbellLoad}
        title={title}
      >
        {sheet ? (
          <View style={styles.sheetBody}>
            <BarbellLoadResultView
              targetWeight={sheet.weight}
              unit={unit}
              barType={barType}
              ownedPlates={ownedPlates}
              onBarTypeChange={(next) => {
                void setBarType(next);
              }}
              rangeLowWeight={sheet.rangeLowWeight}
              rangeHighWeight={sheet.rangeHighWeight}
              onSelectRangeWeight={
                sheet.rangeHighWeight !== null
                  ? (weight) => {
                      setSheet((current) =>
                        current ? { ...current, weight } : current
                      );
                    }
                  : undefined
              }
            />
            <Text style={styles.platesHint}>
              Configure which plates you own in the full Bar Loader tool under
              Explore.
            </Text>
          </View>
        ) : null}
      </BottomSheet>
    </BarbellLoadContext.Provider>
  );
}

const styles = StyleSheet.create({
  sheetBody: {
    gap: space.md,
  },
  platesHint: {
    ...typography.caption,
    color: color.textSecondary,
  },
});

export function useBarbellLoad(): BarbellLoadContextValue {
  const context = useContext(BarbellLoadContext);
  if (!context) {
    throw new Error('useBarbellLoad must be used within BarbellLoadProvider');
  }
  return context;
}
