import { color as tokenColor } from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

type SmallChevronProps = {
  /** Icon colour; defaults to tertiary text. */
  color?: string;
  /** Kept for existing callers; the chevron no longer sits on a wash. */
  backgroundColor?: string;
};

/** Trailing "opens something" affordance inside a tappable row or card. */
export const SmallChevron = ({
  color = tokenColor.textTertiary,
}: SmallChevronProps) => (
  <Ionicons
    name="chevron-forward"
    size={18}
    color={color}
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
  />
);
