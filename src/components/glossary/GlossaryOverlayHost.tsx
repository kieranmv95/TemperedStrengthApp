import { GlossaryTermBody } from '@/src/components/glossary/GlossaryTermBody';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { GlossaryTermContext } from '@/src/hooks/glossary-term-context';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { GlossaryTerm } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import { usePostHog } from 'posthog-react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

/** Returns true when a definition was open and this call closed it. */
export type GlossaryDismiss = () => boolean;

type GlossaryOverlayHostProps = Pick<
  ViewProps,
  'accessibilityViewIsModal' | 'onAccessibilityEscape'
> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * Parent modals call this from Android back. A second native modal cannot
   * present while one is already open, so the definition lives in this host.
   */
  dismissRef?: React.RefObject<GlossaryDismiss | null>;
};

/**
 * Shows a glossary definition inside the popup that is already open.
 * A root `Modal` sheet cannot appear above another `Modal`.
 */
export function GlossaryOverlayHost({
  children,
  style,
  dismissRef,
  accessibilityViewIsModal,
  onAccessibilityEscape,
}: GlossaryOverlayHostProps) {
  const posthog = usePostHog();
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const termRef = useRef<GlossaryTerm | null>(null);

  const close = useCallback(() => {
    termRef.current = null;
    setTerm(null);
  }, []);

  const openGlossaryTerm = useCallback(
    (next: GlossaryTerm) => {
      termRef.current = next;
      setTerm(next);
      posthog?.capture(posthogEventsNames.content.glossaryView, {
        term: next.term,
        source: 'inline',
      });
    },
    [posthog]
  );

  useEffect(() => {
    if (!dismissRef) {
      return;
    }
    dismissRef.current = () => {
      if (termRef.current === null) {
        return false;
      }
      termRef.current = null;
      setTerm(null);
      return true;
    };
    return () => {
      dismissRef.current = null;
    };
  }, [dismissRef]);

  const value = useMemo(() => ({ openGlossaryTerm }), [openGlossaryTerm]);

  return (
    <GlossaryTermContext.Provider value={value}>
      <View
        style={[styles.host, style]}
        accessibilityViewIsModal={accessibilityViewIsModal}
        onAccessibilityEscape={onAccessibilityEscape}
      >
        {children}
        {term ? (
          <GlossaryDefinitionOverlay term={term} onClose={close} />
        ) : null}
      </View>
    </GlossaryTermContext.Provider>
  );
}

type GlossaryDefinitionOverlayProps = {
  term: GlossaryTerm;
  onClose: () => void;
};

function GlossaryDefinitionOverlay({
  term,
  onClose,
}: GlossaryDefinitionOverlayProps) {
  const titleRef = useRef<React.ComponentRef<typeof Text>>(null);

  useEffect(() => {
    if (titleRef.current) {
      AccessibilityInfo.sendAccessibilityEvent(titleRef.current, 'focus');
    }
  }, [term]);

  return (
    <View
      style={styles.overlay}
      accessibilityViewIsModal
      onAccessibilityEscape={onClose}
    >
      <Pressable
        style={styles.scrim}
        onPress={onClose}
        accessible={false}
        testID="glossary-overlay-scrim"
      />
      <View style={[styles.panel, elevation.overlay]}>
        <View style={styles.titleRow}>
          <Text ref={titleRef} style={styles.title} accessibilityRole="header">
            {term.term}
          </Text>
          <Pressable
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={space.xxs}
            accessibilityRole="button"
            accessibilityLabel={`Close ${term.term}`}
          >
            <Ionicons name="close" size={24} color={color.textPrimary} />
          </Pressable>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <GlossaryTermBody term={term} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: color.scrim,
  },
  panel: {
    backgroundColor: color.surface1,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '80%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE,
    paddingTop: space.sm,
    paddingHorizontal: space.md,
  },
  title: {
    ...typography.title2,
    color: color.textPrimary,
    flex: 1,
  },
  closeButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -space.xs,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: space.md,
    paddingBottom: space.lg,
  },
});
