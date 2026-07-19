import {
  getCustomerInfo,
  getOfferings,
  invalidateCustomerInfoRequest,
  PRO_ENTITLEMENT_ID,
  purchasePackage,
  restorePurchases,
  syncRevenueCatIdentity,
} from '@/src/services/revenueCatService';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { getProgramById } from '@/src/utils/program';
import {
  getActiveProgramId,
  getDevProOverrideEnabled,
  getPromoProGrant,
  isPromoProGrantActive,
  setDevProOverrideEnabled,
  setPromoProGrant,
  type PromoProGrant,
} from '@/src/utils/storage';
import { router } from 'expo-router';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Alert, AppState, type AppStateStatus } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOffering as Offerings,
  PurchasesPackage,
} from 'react-native-purchases';

export type SubscriptionState = {
  isPro: boolean;
  isPromoPro: boolean;
  isRevenueCatPro: boolean;
  isDeveloperProOverrideEnabled: boolean;
  promoProGrant: PromoProGrant | null;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  offerings: Offerings | null;
  error: Error | null;
};

type SubscriptionContextType = SubscriptionState & {
  purchase: (packageToPurchase: PurchasesPackage) => Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: Error;
  }>;
  restore: () => Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    isPro?: boolean;
    error?: Error;
  }>;
  refresh: () => Promise<void>;
  refreshPromoPro: () => Promise<void>;
  applyPromoProGrant: (grant: PromoProGrant) => Promise<void>;
  loadOfferings: () => Promise<void>;
  setDeveloperProOverrideEnabled: (enabled: boolean) => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

const hasActiveProEntitlement = (customerInfo: CustomerInfo | null): boolean =>
  customerInfo?.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;

const computeIsPro = (input: {
  customerInfo: CustomerInfo | null;
  promoProGrant: PromoProGrant | null;
  isDeveloperProOverrideEnabled: boolean;
}): boolean =>
  hasActiveProEntitlement(input.customerInfo) ||
  isPromoProGrantActive(input.promoProGrant) ||
  input.isDeveloperProOverrideEnabled;

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dataRevision, user, isSessionReady } = useSyncManager();
  const [state, setState] = useState<SubscriptionState>({
    isPro: false,
    isPromoPro: false,
    isRevenueCatPro: false,
    isDeveloperProOverrideEnabled: false,
    promoProGrant: null,
    isLoading: true,
    customerInfo: null,
    offerings: null,
    error: null,
  });

  const listenerRef = useRef<((customerInfo: CustomerInfo) => void) | null>(
    null
  );
  const previousIsProRef = useRef<boolean | null>(null);
  /** True only after auth-ready identity sync has produced a trusted Pro state. */
  const identitySettledRef = useRef(false);
  const promoProGrantRef = useRef<PromoProGrant | null>(null);
  const isDeveloperProOverrideEnabledRef = useRef(false);
  /** Bumped on every identity change so in-flight CustomerInfo fetches are ignored. */
  const identityEpochRef = useRef(0);
  const boundRevenueCatUserIdRef = useRef<string | null | undefined>(undefined);
  const identitySyncInFlightRef = useRef(false);
  const identityRetryCountRef = useRef(0);
  const userIdRef = useRef<string | null>(user?.id ?? null);
  const isSessionReadyRef = useRef(isSessionReady);
  const reconcileRevenueCatIdentityRef = useRef<
    ((nextUserId: string | null) => Promise<void>) | null
  >(null);
  userIdRef.current = user?.id ?? null;
  isSessionReadyRef.current = isSessionReady;

  const handleSubscriptionExpiry = useCallback(async () => {
    try {
      const programId = await getActiveProgramId();
      if (!programId) return;

      const program = getProgramById(programId);
      if (!program?.isPro) return;

      console.log(
        'Subscription expired while on Pro program, locking access...'
      );
      Alert.alert(
        'Subscription Expired',
        'Your Pro subscription has expired. Your current program and progress are still saved, but you’ll need to re-enable Pro to continue this program.',
        [
          {
            text: 'Not now',
            style: 'cancel',
          },
          {
            text: 'Manage Subscription',
            onPress: () => {
              router.push('/records');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error handling subscription expiry:', error);
    }
  }, []);

  const applyEffectiveProState = useCallback(
    (input: {
      customerInfo: CustomerInfo | null;
      promoProGrant: PromoProGrant | null;
      isDeveloperProOverrideEnabled: boolean;
      preserveLoading?: boolean;
      /**
       * When false, Pro→free transitions do not show the expiry alert.
       * Used during anonymous→identified identity switches.
       */
      detectExpiry?: boolean;
    }) => {
      const isRevenueCatPro = hasActiveProEntitlement(input.customerInfo);
      const isPromoPro = isPromoProGrantActive(input.promoProGrant);
      const isPro = computeIsPro(input);
      const detectExpiry = input.detectExpiry !== false;

      if (
        detectExpiry &&
        identitySettledRef.current &&
        previousIsProRef.current === true &&
        !isPro
      ) {
        void handleSubscriptionExpiry();
      }

      previousIsProRef.current = isPro;

      promoProGrantRef.current = input.promoProGrant;
      isDeveloperProOverrideEnabledRef.current =
        input.isDeveloperProOverrideEnabled;

      setState((prev) => ({
        ...prev,
        customerInfo: input.customerInfo,
        promoProGrant: input.promoProGrant,
        isDeveloperProOverrideEnabled: input.isDeveloperProOverrideEnabled,
        isRevenueCatPro,
        isPromoPro,
        isPro,
        isLoading: input.preserveLoading ? prev.isLoading : false,
        error: null,
      }));
    },
    [handleSubscriptionExpiry]
  );

  const updateStateFromCustomerInfo = useCallback(
    (
      customerInfo: CustomerInfo,
      options?: { detectExpiry?: boolean; preserveLoading?: boolean }
    ) => {
      applyEffectiveProState({
        customerInfo,
        promoProGrant: promoProGrantRef.current,
        isDeveloperProOverrideEnabled: isDeveloperProOverrideEnabledRef.current,
        detectExpiry: options?.detectExpiry,
        preserveLoading: options?.preserveLoading,
      });
    },
    [applyEffectiveProState]
  );

  const loadCustomerInfo = useCallback(
    async (options?: { detectExpiry?: boolean }) => {
      const epochAtStart = identityEpochRef.current;
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const customerInfo = await getCustomerInfo();
        if (epochAtStart !== identityEpochRef.current) {
          // Identity changed while we were fetching; the newer epoch owns loading.
          return;
        }
        updateStateFromCustomerInfo(customerInfo, {
          detectExpiry: options?.detectExpiry,
        });
      } catch (error) {
        if (epochAtStart !== identityEpochRef.current) {
          return;
        }
        const purchasesError = error as {
          info?: { backendErrorCode?: number };
        };
        if (purchasesError?.info?.backendErrorCode === 7638) {
          console.log('Customer info request already in flight, skipping...');
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }
        console.error('Error loading customer info:', error);
        setState((prev) => ({
          ...prev,
          error: error as Error,
          isLoading: false,
        }));
      }
    },
    [updateStateFromCustomerInfo]
  );

  const loadOfferings = useCallback(async () => {
    try {
      const offerings = await getOfferings();
      setState((prev) => ({ ...prev, offerings }));
    } catch (error) {
      console.error('Error loading offerings:', error);
      setState((prev) => ({ ...prev, error: error as Error }));
    }
  }, []);

  const refreshPromoPro = useCallback(async () => {
    const promoProGrant = await getPromoProGrant();
    promoProGrantRef.current = promoProGrant;

    setState((prev) => {
      const next = {
        customerInfo: prev.customerInfo,
        promoProGrant,
        isDeveloperProOverrideEnabled: prev.isDeveloperProOverrideEnabled,
      };
      const isRevenueCatPro = hasActiveProEntitlement(next.customerInfo);
      const isPromoPro = isPromoProGrantActive(next.promoProGrant);
      const isPro = computeIsPro(next);

      if (
        identitySettledRef.current &&
        previousIsProRef.current === true &&
        !isPro
      ) {
        void handleSubscriptionExpiry();
      }
      previousIsProRef.current = isPro;

      return {
        ...prev,
        promoProGrant,
        isRevenueCatPro,
        isPromoPro,
        isPro,
      };
    });
  }, [handleSubscriptionExpiry]);

  const applyPromoProGrant = useCallback(async (grant: PromoProGrant) => {
    await setPromoProGrant(grant);
    promoProGrantRef.current = grant;

    setState((prev) => {
      const next = {
        customerInfo: prev.customerInfo,
        promoProGrant: grant,
        isDeveloperProOverrideEnabled: prev.isDeveloperProOverrideEnabled,
      };
      const isRevenueCatPro = hasActiveProEntitlement(next.customerInfo);
      const isPromoPro = isPromoProGrantActive(next.promoProGrant);
      const isPro = computeIsPro(next);
      previousIsProRef.current = isPro;
      return {
        ...prev,
        promoProGrant: grant,
        isRevenueCatPro,
        isPromoPro,
        isPro,
      };
    });
  }, []);

  const purchase = useCallback(
    async (packageToPurchase: PurchasesPackage) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const customerInfo = await purchasePackage(packageToPurchase);
        updateStateFromCustomerInfo(customerInfo);
        return { success: true, customerInfo };
      } catch (error) {
        const err = error as Error;
        setState((prev) => ({
          ...prev,
          error: err,
          isLoading: false,
        }));
        return { success: false, error: err };
      }
    },
    [updateStateFromCustomerInfo]
  );

  const restore = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const customerInfo = await restorePurchases();
      const isPro = computeIsPro({
        customerInfo,
        promoProGrant: promoProGrantRef.current,
        isDeveloperProOverrideEnabled: isDeveloperProOverrideEnabledRef.current,
      });
      updateStateFromCustomerInfo(customerInfo);
      return { success: true, customerInfo, isPro };
    } catch (error) {
      const err = error as Error;
      setState((prev) => ({
        ...prev,
        error: err,
        isLoading: false,
      }));
      return { success: false, error: err };
    }
  }, [updateStateFromCustomerInfo]);

  const setDeveloperProOverrideEnabled = useCallback(
    async (enabled: boolean) => {
      await setDevProOverrideEnabled(enabled);
      const nextEnabled = __DEV__ ? enabled : false;
      isDeveloperProOverrideEnabledRef.current = nextEnabled;

      setState((prev) => {
        const next = {
          customerInfo: prev.customerInfo,
          promoProGrant: prev.promoProGrant,
          isDeveloperProOverrideEnabled: nextEnabled,
        };
        return {
          ...prev,
          isDeveloperProOverrideEnabled: nextEnabled,
          isPro: computeIsPro(next),
          isRevenueCatPro: hasActiveProEntitlement(next.customerInfo),
          isPromoPro: isPromoProGrantActive(next.promoProGrant),
        };
      });
    },
    []
  );

  const refresh = useCallback(async () => {
    await Promise.all([loadCustomerInfo(), refreshPromoPro()]);
  }, [loadCustomerInfo, refreshPromoPro]);

  const reconcileRevenueCatIdentity = useCallback(
    async (nextUserId: string | null) => {
      if (boundRevenueCatUserIdRef.current === nextUserId) {
        return;
      }
      if (identitySyncInFlightRef.current) {
        return;
      }

      const epoch = ++identityEpochRef.current;
      identitySyncInFlightRef.current = true;
      identitySettledRef.current = false;
      previousIsProRef.current = null;
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const customerInfo = await syncRevenueCatIdentity(nextUserId);
        if (epoch !== identityEpochRef.current) return;

        boundRevenueCatUserIdRef.current = nextUserId;
        identitySettledRef.current = true;
        identityRetryCountRef.current = 0;

        if (customerInfo) {
          updateStateFromCustomerInfo(customerInfo, { detectExpiry: false });
        } else {
          await loadCustomerInfo({ detectExpiry: false });
        }
      } catch (error) {
        if (epoch !== identityEpochRef.current) return;
        console.error('Failed to sync RevenueCat identity:', error);
        // Leave unbound so foreground / delayed retry can call logIn again.
        // Do not apply anonymous CustomerInfo for a signed-in user.
        identitySettledRef.current = false;
        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: error as Error,
        }));
        if (identityRetryCountRef.current < 1) {
          identityRetryCountRef.current += 1;
          setTimeout(() => {
            if (
              epoch === identityEpochRef.current &&
              boundRevenueCatUserIdRef.current !== nextUserId
            ) {
              void reconcileRevenueCatIdentityRef.current?.(nextUserId);
            }
          }, 2_000);
        }
        setTimeout(() => {
          if (
            epoch === identityEpochRef.current &&
            boundRevenueCatUserIdRef.current !== nextUserId
          ) {
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        }, 8_000);
      } finally {
        if (epoch === identityEpochRef.current) {
          identitySyncInFlightRef.current = false;
        }
      }
    },
    [loadCustomerInfo, updateStateFromCustomerInfo]
  );
  reconcileRevenueCatIdentityRef.current = reconcileRevenueCatIdentity;

  useEffect(() => {
    if (dataRevision === 0) return;
    void refreshPromoPro();
  }, [dataRevision, refreshPromoPro]);

  // Wait for session resolution, then bind RevenueCat identity before trusting Pro.
  // Without this, an anonymous getCustomerInfo() can finish after logIn() and
  // overwrite Pro with free + fire a false "Subscription Expired" alert.
  // Uses isSessionReady (not full KV isReady) so Pro is not blocked on sync.
  useEffect(() => {
    if (!isSessionReady) return;
    identityRetryCountRef.current = 0;
    void reconcileRevenueCatIdentity(user?.id ?? null);
  }, [isSessionReady, user?.id, reconcileRevenueCatIdentity]);

  // Local flags, offerings, and RevenueCat listener. Do not finalize Pro here —
  // identity reconciliation owns the first trusted CustomerInfo apply.
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const [promoProGrant, isDeveloperProOverrideEnabled] = await Promise.all([
        getPromoProGrant(),
        getDevProOverrideEnabled(),
      ]);
      if (cancelled) return;

      promoProGrantRef.current = promoProGrant;
      isDeveloperProOverrideEnabledRef.current = isDeveloperProOverrideEnabled;

      setState((prev) => ({
        ...prev,
        promoProGrant,
        isDeveloperProOverrideEnabled,
        isPromoPro: isPromoProGrantActive(promoProGrant),
        isPro: computeIsPro({
          customerInfo: prev.customerInfo,
          promoProGrant,
          isDeveloperProOverrideEnabled,
        }),
      }));

      if (!cancelled) {
        await loadOfferings();
      }
    })();

    const listener = (_customerInfo: CustomerInfo) => {
      // Ignore listener updates until identity has settled once; otherwise an
      // anonymous CustomerInfo callback can clobber the post-login Pro state.
      if (!identitySettledRef.current) return;
      const epoch = identityEpochRef.current;
      console.log('RevenueCat: Customer info updated via listener');
      // Re-fetch instead of trusting the callback payload — a stale anonymous
      // update can arrive after Purchases.logIn() has already returned Pro.
      void (async () => {
        try {
          invalidateCustomerInfoRequest();
          const fresh = await getCustomerInfo();
          if (
            !identitySettledRef.current ||
            epoch !== identityEpochRef.current
          ) {
            return;
          }
          updateStateFromCustomerInfo(fresh);
        } catch (error) {
          console.error('Error refreshing customer info from listener:', error);
        }
      })();
    };
    Purchases.addCustomerInfoUpdateListener(listener);
    listenerRef.current = listener;

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState !== 'active') return;

      void refreshPromoPro();

      if (
        isSessionReadyRef.current &&
        boundRevenueCatUserIdRef.current !== userIdRef.current
      ) {
        void reconcileRevenueCatIdentityRef.current?.(userIdRef.current);
        return;
      }

      if (identitySettledRef.current) {
        void loadCustomerInfo();
      }
    };
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppState
    );

    return () => {
      cancelled = true;
      if (listenerRef.current) {
        Purchases.removeCustomerInfoUpdateListener(listenerRef.current);
        listenerRef.current = null;
      }
      appStateSubscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: SubscriptionContextType = {
    ...state,
    purchase,
    restore,
    refresh,
    refreshPromoPro,
    applyPromoProGrant,
    loadOfferings,
    setDeveloperProOverrideEnabled,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

/**
 * Hook to access subscription state and methods
 * Must be used within a SubscriptionProvider
 */
export function useSubscriptionContext(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      'useSubscriptionContext must be used within a SubscriptionProvider'
    );
  }
  return context;
}
