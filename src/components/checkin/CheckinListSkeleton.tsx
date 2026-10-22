import { checkinStyles as styles } from '@/src/components/checkin/checkinStyles';
import { Skeleton } from '@/src/components/ds';
import React from 'react';
import { View } from 'react-native';

const ROW_SKELETON_HEIGHT = 72;

type CheckinListSkeletonProps = {
  /** e.g. "Loading check-in". */
  accessibilityLabel: string;
};

/** Placeholder rows while check-in data loads. */
export function CheckinListSkeleton({
  accessibilityLabel,
}: CheckinListSkeletonProps) {
  return (
    <View style={styles.listSection}>
      <Skeleton
        width="100%"
        height={ROW_SKELETON_HEIGHT}
        radius="md"
        accessibilityLabel={accessibilityLabel}
      />
      <Skeleton width="100%" height={ROW_SKELETON_HEIGHT} radius="md" />
      <Skeleton width="100%" height={ROW_SKELETON_HEIGHT} radius="md" />
    </View>
  );
}
