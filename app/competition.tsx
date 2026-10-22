import { Skeleton, StandardLayout } from '@/src/components/ds';
import { space } from '@/src/constants/tokens';
import { useLiveCompetition } from '@/src/hooks/useLiveCompetition';
import { LiveCompetitionScreen } from '@/src/screens/LiveCompetitionScreen';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function CompetitionRoute() {
  const { competition, isLoading, isRefetching, refetch } =
    useLiveCompetition();

  useEffect(() => {
    if (!isLoading && !competition) {
      router.replace('/');
    }
  }, [competition, isLoading]);

  if (isLoading) {
    return (
      <StandardLayout title="Competition" onBackPress={() => router.back()}>
        <StandardLayout.Body>
          <View style={styles.loading}>
            <Skeleton
              width="100%"
              height={128}
              radius="md"
              accessibilityLabel="Loading competition"
            />
            <Skeleton width="60%" height={36} radius="pill" />
            <Skeleton width="100%" height={48} radius="md" />
            <Skeleton width="100%" height={48} radius="md" />
            <Skeleton width="100%" height={48} radius="md" />
          </View>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  if (!competition) {
    return null;
  }

  return (
    <LiveCompetitionScreen
      competition={competition}
      isRefetching={isRefetching}
      onRefresh={refetch}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    gap: space.sm,
  },
});
