import { TokenPreviewScreen } from '@/src/screens/dev/TokenPreviewScreen';
import { Redirect } from 'expo-router';

export default function DevTokensRoute() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }
  return <TokenPreviewScreen />;
}
