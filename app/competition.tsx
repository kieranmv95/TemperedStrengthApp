import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';
import { Colors } from '@/src/constants/theme';
import { useLiveCompetition } from '@/src/hooks/useLiveCompetition';
import { LiveCompetitionScreen } from '@/src/screens/LiveCompetitionScreen';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

export default function CompetitionRoute() {
  const { competition, isLoading, isRefetching, refetch } = useLiveCompetition();

  useEffect(() => {
    if (!isLoading && !competition) {
      router.replace('/');
    }
  }, [competition, isLoading]);

  if (isLoading) {
    return (
      <AppSafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </AppSafeAreaView>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundScreen,
  },
});
