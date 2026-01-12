import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Purchases, { CustomerInfo, PurchasesOffering as Offerings, PurchasesPackage } from 'react-native-purchases';
import {
  getCustomerInfo,
  getOfferings,
  purchasePackage,
  restorePurchases,
  PRO_ENTITLEMENT_ID,
} from '@/src/services/revenueCatService';

export interface SubscriptionState {
  isPro: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  offerings: Offerings | null;
  error: Error | null;
}

interface SubscriptionContextType extends SubscriptionState {
  purchase: (packageToPurchase: PurchasesPackage) => Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: Error }>;
  restore: () => Promise<{ success: boolean; customerInfo?: CustomerInfo; isPro?: boolean; error?: Error }>;
  refresh: () => Promise<void>;
  loadOfferings: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SubscriptionState>({
    isPro: false,
    isLoading: true,
    customerInfo: null,
    offerings: null,
    error: null,
  });

  // Track if we've initialized to prevent duplicate listeners
  const listenerRef = useRef<(() => void) | null>(null);

  /**
   * Update state based on customer info
   */
  const updateStateFromCustomerInfo = useCallback((customerInfo: CustomerInfo) => {
    const isPro = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
    setState((prev) => ({
      ...prev,
      customerInfo,
      isPro,
      isLoading: false,
      error: null,
    }));
  }, []);

  /**
   * Load customer info and check entitlement status
   */
  const loadCustomerInfo = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const customerInfo = await getCustomerInfo();
      updateStateFromCustomerInfo(customerInfo);
    } catch (error) {
      const purchasesError = error as any;
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

  /**
   * Purchase a package
   */
  const purchase = useCallback(async (packageToPurchase: PurchasesPackage) => {
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
  }, [updateStateFromCustomerInfo]);

  /**
   * Restore purchases
   */
  const restore = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const customerInfo = await restorePurchases();
      const isPro = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
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

  /**
   * Refresh customer info
   */
  const refresh = useCallback(async () => {
    await loadCustomerInfo();
  }, [loadCustomerInfo]);

  // Set up RevenueCat listener for customer info updates
  useEffect(() => {
    // Load initial data
    loadCustomerInfo();
    loadOfferings();

    // Set up listener for customer info changes (fires on purchases, restores, etc.)
    const removeListener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log('RevenueCat: Customer info updated via listener');
      updateStateFromCustomerInfo(customerInfo);
    });

    listenerRef.current = removeListener;

    // Cleanup listener on unmount
    return () => {
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
      }
    };
  }, [loadCustomerInfo, loadOfferings, updateStateFromCustomerInfo]);

  const value: SubscriptionContextType = {
    ...state,
    purchase,
    restore,
    refresh,
    loadOfferings,
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
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
}

