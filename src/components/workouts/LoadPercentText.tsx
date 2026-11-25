import { GlossaryText } from '@/src/components/glossary/GlossaryText';
import { color } from '@/src/constants/tokens';
import { useBarbellLoad } from '@/src/hooks/barbell-load-context';
import {
  formatLoadPercentSegment,
  parseLoadPercentSegments,
  resolveLoadPercentWeights,
  stringHasLoadPercentTokens,
  type LoadPercentSegment,
} from '@/src/utils/loadPercent';
import {
  parsePrescribedWeightSegments,
  prescribedWeightToDisplay,
  type PrescribedWeightSegment,
} from '@/src/utils/prescribedWeight';
import type { WeightUnit } from '@/src/utils/storage';
import React from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

type LoadPercentTextProps = {
  text: string;
  oneRmKg: number | null;
  unit: WeightUnit;
  style?: StyleProp<TextStyle>;
  /**
   * Nearby copy that is not part of `text`, usually the movement name.
   * Used so a note like `22.5/15kg` on a dumbbell snatch is not treated as a bar.
   */
  weightContext?: string;
};

type CopyPiece =
  | { kind: 'text'; text: string }
  | { kind: 'percent'; segment: Extract<LoadPercentSegment, { type: 'load' }> }
  | {
      kind: 'weight';
      segment: Extract<PrescribedWeightSegment, { type: 'weight' }>;
    };

function piecesOf(text: string, weightContext?: string): CopyPiece[] {
  const percentSegments = stringHasLoadPercentTokens(text)
    ? parseLoadPercentSegments(text)
    : [{ type: 'text' as const, text }];

  const pieces: CopyPiece[] = [];
  for (const segment of percentSegments) {
    if (segment.type === 'load') {
      pieces.push({ kind: 'percent', segment });
      continue;
    }
    const weights = parsePrescribedWeightSegments(segment.text, weightContext);
    for (const weight of weights) {
      if (weight.type === 'text') {
        if (weight.text.length > 0) {
          pieces.push({ kind: 'text', text: weight.text });
        }
        continue;
      }
      pieces.push({ kind: 'weight', segment: weight });
    }
  }
  return pieces;
}

/**
 * Renders copy that may contain `{{percent}}` load tokens or a prescribed
 * barbell weight (`70kg/50kg`, `61/43kg`, `(70m/47.5f)kg`, `@ 50kg`).
 * Marked runs are gold. Resolved loads are underlined and open the bar loader.
 */
export function LoadPercentText({
  text,
  oneRmKg,
  unit,
  style,
  weightContext,
}: LoadPercentTextProps) {
  const { openBarbellLoad } = useBarbellLoad();
  const pieces = piecesOf(text, weightContext);

  const plain =
    pieces.length === 0 || (pieces.length === 1 && pieces[0]?.kind === 'text');
  if (plain) {
    return <GlossaryText text={text} style={style} />;
  }

  return (
    <Text style={style}>
      {pieces.map((piece, index) => {
        if (piece.kind === 'text') {
          return <GlossaryText key={index} text={piece.text} style={style} />;
        }

        if (piece.kind === 'percent') {
          const label = formatLoadPercentSegment(piece.segment, oneRmKg, unit);
          const weights = resolveLoadPercentWeights(
            piece.segment,
            oneRmKg,
            unit
          );

          if (weights === null) {
            return (
              <Text key={index} style={styles.load}>
                {label}
              </Text>
            );
          }

          return (
            <Text
              key={index}
              style={styles.loadTappable}
              onPress={() => {
                openBarbellLoad({
                  weight: weights.low,
                  rangeHighWeight: weights.high,
                  label,
                });
              }}
              accessibilityRole="button"
              accessibilityLabel={`Open bar loader for ${label}`}
              accessibilityHint="Shows which plates to load on the bar"
              suppressHighlighting
            >
              {label}
            </Text>
          );
        }

        const male = prescribedWeightToDisplay(
          piece.segment.male,
          piece.segment.unit,
          unit
        );
        const female =
          piece.segment.female === null
            ? null
            : prescribedWeightToDisplay(
                piece.segment.female,
                piece.segment.unit,
                unit
              );

        return (
          <Text
            key={index}
            style={styles.loadTappable}
            onPress={() => {
              openBarbellLoad({
                weight: male,
                womensWeight: female,
                label: piece.segment.label,
              });
            }}
            accessibilityRole="button"
            accessibilityLabel={`Open bar loader for ${piece.segment.label}`}
            accessibilityHint="Shows which plates to load on the bar"
            suppressHighlighting
          >
            {piece.segment.label}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  load: {
    color: color.gold,
  },
  loadTappable: {
    color: color.gold,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
