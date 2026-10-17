import { Toast, type ToastAction } from '@/src/components/ds/Toast';
import { motion } from '@/src/constants/tokens';
import type { Ionicons } from '@expo/vector-icons';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AccessibilityInfo } from 'react-native';

export type ToastOptions = {
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** e.g. { label: 'Undo', onPress: undoLogSet }. Pressing it also dismisses the toast. */
  action?: ToastAction;
};

type ToastState = ToastOptions & {
  id: number;
  visible: boolean;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
};

const TOAST_DURATION_MS = 4000;
const TOAST_WITH_ACTION_DURATION_MS = 6000;

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * One toast at a time; a new toast replaces the current one. Each toast is
 * announced to screen readers, and its duration follows the OS accessibility
 * timeout preference where one exists (Android).
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const nextId = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (clearTimer.current) {
      clearTimeout(clearTimer.current);
      clearTimer.current = null;
    }
  }, []);

  const hideToast = useCallback(() => {
    clearTimers();
    setToast((current) => (current ? { ...current, visible: false } : null));
    clearTimer.current = setTimeout(() => {
      setToast(null);
    }, motion.duration.fast);
  }, [clearTimers]);

  const showToast = useCallback(
    (options: ToastOptions) => {
      clearTimers();
      nextId.current += 1;
      const id = nextId.current;
      setToast({ ...options, id, visible: true });

      AccessibilityInfo.announceForAccessibility(
        options.action
          ? `${options.message}. ${options.action.label} available`
          : options.message
      );

      const baseDuration = options.action
        ? TOAST_WITH_ACTION_DURATION_MS
        : TOAST_DURATION_MS;
      AccessibilityInfo.getRecommendedTimeoutMillis(baseDuration)
        .catch(() => baseDuration)
        .then((duration) => {
          if (nextId.current === id) {
            hideTimer.current = setTimeout(hideToast, duration);
          }
        });
    },
    [clearTimers, hideToast]
  );

  useEffect(() => clearTimers, [clearTimers]);

  const handleAction = useCallback(() => {
    toast?.action?.onPress();
    hideToast();
  }, [toast, hideToast]);

  const value = useMemo(
    () => ({ showToast, hideToast }),
    [showToast, hideToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Toast
          key={toast.id}
          message={toast.message}
          icon={toast.icon}
          visible={toast.visible}
          action={
            toast.action
              ? { label: toast.action.label, onPress: handleAction }
              : undefined
          }
          onDismiss={hideToast}
        />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
