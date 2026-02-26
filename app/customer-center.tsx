import { Colors } from '@/src/constants/theme';
import { useSubscription } from '@/src/hooks/use-subscription';
import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';

export default function CustomerCenterScreen() {
  const { refresh } = useSubscription();

  const handleDismiss = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <RevenueCatUI.CustomerCenterView onDismiss={handleDismiss} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  content: {
    flex: 1,
  },
});
