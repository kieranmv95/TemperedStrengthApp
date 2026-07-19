import {
  getCustomerInfo,
  getOfferings,
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
  const { dataRevision, user } = useSyncManager();
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

  // Track listener reference for cleanup (RevenueCat requires passing the same function to remove)
  const listenerRef = useRef<((customerInfo: CustomerInfo) => void) | null>(
    null
  );
  // Track previous Pro status to detect subscription expiry
  const previousIsProRef = useRef<boolean | null>(null);
  // Track if initial load is complete to avoid false expiry detection
  const initialLoadCompleteRef = useRef<boolean>(false);
  const promoProGrantRef = useRef<PromoProGrant | null>(null);
  const isDeveloperProOverrideEnabledRef = useRef(false);
  const revenueCatIdentityUserIdRef = useRef<string | null | undefined>(
    undefined
  );

  /**
   * Handle subscription expiry - if the user is on a Pro program, preserve it
   * and prompt them to re-enable Pro instead of wiping progress.
   */
  const handleSubscriptionExpiry = useCallback(async () => {
    try {
      const programId = await getActiveProgramId();
      if (!programId) return;

      const program = getProgramById(programId);
      if (!program?.isPro) return;

      // User was on a Pro program but subscription expired.
      // Do NOT clear program/progress; keep it and prompt to renew.
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
    }) => {
      const isRevenueCatPro = hasActiveProEntitlement(input.customerInfo);
      const isPromoPro = isPromoProGrantActive(input.promoProGrant);
      const isPro = computeIsPro(input);

      if (
        initialLoadCompleteRef.current &&
        previousIsProRef.current === true &&
        !isPro
      ) {
        void handleSubscriptionExpiry();
      }

      previousIsProRef.current = isPro;
      if (!initialLoadCompleteRef.current) {
        initialLoadCompleteRef.current = true;
      }

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

  /**
   * Update state based on customer info
   */
  const updateStateFromCustomerInfo = useCallback(
    (customerInfo: CustomerInfo) => {
      applyEffectiveProState({
        customerInfo,
        promoProGrant: promoProGrantRef.current,
        isDeveloperProOverrideEnabled: isDeveloperProOverrideEnabledRef.current,
      });
    },
    [applyEffectiveProState]
  );

  /**
   * Load customer info and check entitlement status
   */
  const loadCustomerInfo = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const customerInfo = await getCustomerInfo();
      updateStateFromCustomerInfo(customerInfo);
    } catch (error) {
      const purchasesError = error as {
        info?: { backendErrorCode?: number };
      };
      // Handle 429 errors (concurrent request) gracefully
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
  }, [updateStateFromCustomerInfo]);

  /**
   * Load available offerings (products)
   */
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
        initialLoadCompleteRef.current &&
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

  /**
   * Purchase a package
   */
  const purchase = useCallback(
    async (packageToPurchase: PurchasesPackage) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const customerInfo = await purchasePackage(packageToPurchase);
        // The listener will also fire, but we update immediately for responsiveness
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

  /**
   * Restore purchases
   */
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

  /**
   * Refresh customer info
   */
  const refresh = useCallback(async () => {
    await Promise.all([loadCustomerInfo(), refreshPromoPro()]);
  }, [loadCustomerInfo, refreshPromoPro]);

  // Account sync writes AsyncStorage directly; re-read promo/pro flags after pull.
  useEffect(() => {
    if (dataRevision === 0) return;
    void refreshPromoPro();
  }, [dataRevision, refreshPromoPro]);

  // Keep RevenueCat App User ID aligned with the signed-in Supabase account so
  // Pro entitlements follow the account across iOS and Android.
  useEffect(() => {
    const nextUserId = user?.id ?? null;
    if (revenueCatIdentityUserIdRef.current === nextUserId) {
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const customerInfo = await syncRevenueCatIdentity(nextUserId);
        if (cancelled) return;
        revenueCatIdentityUserIdRef.current = nextUserId;
        if (customerInfo) {
          updateStateFromCustomerInfo(customerInfo);
        } else {
          await loadCustomerInfo();
        }
      } catch (error) {
        console.error('Failed to sync RevenueCat identity:', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, loadCustomerInfo, updateStateFromCustomerInfo]);

  // Set up RevenueCat listener for customer info updates
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const [promoProGrant, isDeveloperProOverrideEnabled] = await Promise.all([
        getPromoProGrant(),
        getDevProOverrideEnabled(),
      ]);
      if (cancelled) {
        return;
      }

      promoProGrantRef.current = promoProGrant;
      isDeveloperProOverrideEnabledRef.current = isDeveloperProOverrideEnabled;

      setState((prev) => {
        const next = {
          customerInfo: prev.customerInfo,
          promoProGrant,
          isDeveloperProOverrideEnabled,
        };
        return {
          ...prev,
          promoProGrant,
          isDeveloperProOverrideEnabled,
          isRevenueCatPro: hasActiveProEntitlement(next.customerInfo),
          isPromoPro: isPromoProGrantActive(next.promoProGrant),
          isPro: computeIsPro(next),
        };
      });

      await loadCustomerInfo();
      if (!cancelled) {
        await loadOfferings();
      }
    })();

    // Set up listener for customer info changes (fires on purchases, restores, etc.)
    const listener = (customerInfo: CustomerInfo) => {
      console.log('RevenueCat: Customer info updated via listener');
      updateStateFromCustomerInfo(customerInfo);
    };
    Purchases.addCustomerInfoUpdateListener(listener);
    listenerRef.current = listener;

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        void refreshPromoPro();
      }
    };
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppState
    );

    // Cleanup listener on unmount
    return () => {
      cancelled = true;
      if (listenerRef.current) {
        Purchases.removeCustomerInfoUpdateListener(listenerRef.current);
        listenerRef.current = null;
      }
      appStateSubscription.remove();
    };
    // Mount-only: listeners and initial load. Callbacks read latest refs/state.
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
