import { registerPostHogCapture } from '@/src/services/posthogClient';
import { usePostHog } from 'posthog-react-native';
import { useEffect } from 'react';

/**
 * Registers the PostHog client so non-React modules can capture events.
 */
export function PostHogCaptureBridge() {
  const posthog = usePostHog();

  useEffect(() => {
    registerPostHogCapture((event, properties) => {
      posthog.capture(event, properties);
    });
    return () => {
      registerPostHogCapture(null);
    };
  }, [posthog]);

  return null;
}
