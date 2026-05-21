import { TogetherWeLiftSheet } from '@/src/components/hub/TogetherWeLiftSheet';
import {
  TOGETHER_WE_LIFT,
  type TogetherWeLiftLinkKey,
} from '@/src/data/togetherWeLift';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import * as Linking from 'expo-linking';
import { usePostHog } from 'posthog-react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type TogetherWeLiftOpenSource =
  | 'hub_banner'
  | 'settings'
  | 'home'
  | 'deep_link'
  | 'unknown';

type TogetherWeLiftContextValue = {
  open: (source?: TogetherWeLiftOpenSource) => void;
  close: () => void;
};

const TogetherWeLiftContext = createContext<TogetherWeLiftContextValue | null>(
  null
);

export function TogetherWeLiftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const posthog = usePostHog();
  const [visible, setVisible] = useState(false);

  const open = useCallback(
    (source: TogetherWeLiftOpenSource = 'unknown') => {
      posthog.capture(posthogEventsNames.content.togetherWeLiftSheetOpened, {
        source,
      });
      setVisible(true);
    },
    [posthog]
  );

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const handlePressLink = useCallback(
    (key: TogetherWeLiftLinkKey) => {
      posthog.capture(posthogEventsNames.content.togetherWeLiftLinkPressed, {
        link_key: key,
      });
      const url = TOGETHER_WE_LIFT.links[key];
      Linking.openURL(url).catch((error) => {
        console.error('Failed to open Together We Lift URL:', error);
      });
    },
    [posthog]
  );

  const value = useMemo(
    () => ({
      open,
      close,
    }),
    [open, close]
  );

  return (
    <TogetherWeLiftContext.Provider value={value}>
      {children}
      <TogetherWeLiftSheet
        visible={visible}
        onClose={close}
        onPressLink={handlePressLink}
      />
    </TogetherWeLiftContext.Provider>
  );
}

export function useTogetherWeLiftContext(): TogetherWeLiftContextValue {
  const context = useContext(TogetherWeLiftContext);
  if (!context) {
    throw new Error(
      'useTogetherWeLift must be used within TogetherWeLiftProvider'
    );
  }
  return context;
}
