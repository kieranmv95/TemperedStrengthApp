import { ComponentPreviewScreen } from '@/src/screens/dev/ComponentPreviewScreen';
import { Redirect } from 'expo-router';

export default function DevComponentsRoute() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }
  return <ComponentPreviewScreen />;
}
