import { Colors } from '@/src/constants/theme';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';
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
    backgroundColor: Colors.backgroundScreen,
  },
  content: {
    flex: 1,
  },
});
