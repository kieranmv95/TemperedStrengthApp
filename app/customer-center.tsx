import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import RevenueCatUI from 'react-native-purchases-ui';

export default function CustomerCenterScreen() {
  const handleDismiss = () => {
    router.back();
  };

  return (
    <AppSafeAreaView style={styles.container}>
      <View style={styles.content}>
        <RevenueCatUI.CustomerCenterView onDismiss={handleDismiss} />
      </View>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
  },
  content: {
    flex: 1,
  },
});
