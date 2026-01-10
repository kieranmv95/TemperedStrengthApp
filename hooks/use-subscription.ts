import { useState, useEffect, useCallback } from 'react';
import {
  getCustomerInfo,
  getOfferings,
  purchasePackage,
  restorePurchases,
  syncPurchases,
  PRO_ENTITLEMENT_ID,
} from '@/src/services/revenueCatService';
import type { CustomerInfo, PurchasesPackage, PurchasesOffering as Offerings } from 'react-native-purchases';

export interface SubscriptionState {
  isPro: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  offerings: Offerings | null;
  error: Error | null;
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    isPro: false,
    isLoading: true,
    customerInfo: null,
    offerings: null,
    error: null,
  });

  /**
   * Load customer info and check entitlement status
   */
  const loadCustomerInfo = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Only call getCustomerInfo once - hasProEntitlement also calls it internally
      const customerInfo = await getCustomerInfo();
      const isPro = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;

      setState((prev) => ({
        ...prev,
        customerInfo,
        isPro,
        isLoading: false,
      }));
    } catch (error) {
      const purchasesError = error as any;
      // Handle 429 errors (concurrent request) gracefully - it's not a real error
      if (purchasesError?.info?.backendErrorCode === 7638) {
        // Another request is in flight, which is fine - just don't update state
        console.log('Customer info request already in flight, skipping...');
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
        return;
      }
      console.error('Error loading customer info:', error);
      setState((prev) => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }));
    }
  }, []);

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
      const isPro = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;

      setState((prev) => ({
        ...prev,
        customerInfo,
        isPro,
        isLoading: false,
      }));

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
  }, []);

  /**
   * Restore purchases
   */
  const restore = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const customerInfo = await restorePurchases();
      const isPro = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;

      setState((prev) => ({
        ...prev,
        customerInfo,
        isPro,
        isLoading: false,
      }));

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
  }, []);

  /**
   * Refresh customer info (sync purchases)
   */
  const refresh = useCallback(async () => {
    await loadCustomerInfo();
  }, [loadCustomerInfo]);

  // Load customer info on mount
  useEffect(() => {
    loadCustomerInfo();
    loadOfferings();
  }, [loadCustomerInfo, loadOfferings]);

  return {
    ...state,
    purchase,
    restore,
    refresh,
    loadOfferings,
  };
}

