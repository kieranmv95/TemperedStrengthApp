import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOffering as Offerings,
  PURCHASES_ERROR_CODE,
  PurchasesError,
  PurchasesPackage,
} from 'react-native-purchases';

// RevenueCat API Keys
// Get your production keys from: https://app.revenuecat.com/project/{your_project_id}/settings/api-keys
// Test keys start with "test_", Production keys start with "appl_" (iOS) or "goog_" (Android)
// For production/TestFlight builds, set EXPO_PUBLIC_REVENUECAT_API_KEY_IOS and EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID in EAS secrets
// WARNING: TestFlight builds are considered release builds and REQUIRE production keys, not test keys
const REVENUECAT_API_KEY = Platform.select({
  ios:
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ||
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ||
    'test_SnvzLVCMTIHpdvZxNJETTYDrEhL',
  android:
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ||
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ||
    'test_SnvzLVCMTIHpdvZxNJETTYDrEhL',
  default: 'test_SnvzLVCMTIHpdvZxNJETTYDrEhL',
})!;

// Validate API key format in development to catch misconfigurations early
if (__DEV__) {
  const isTestKey = REVENUECAT_API_KEY.startsWith('test_');
  const isProductionKey =
    REVENUECAT_API_KEY.startsWith('appl_') ||
    REVENUECAT_API_KEY.startsWith('goog_');

  if (!isTestKey && !isProductionKey) {
    console.warn(
      "⚠️ RevenueCat API key format may be invalid. Expected 'test_', 'appl_', or 'goog_' prefix."
    );
  }
}

// Entitlement identifier
export const PRO_ENTITLEMENT_ID = 'Tempered Strength Pro';

// Product identifiers
export const PRODUCT_IDENTIFIERS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime',
} as const;

/**
 * Initialize RevenueCat SDK
 * Call this once when the app starts
 */
export async function initializeRevenueCat(userId?: string): Promise<void> {
  try {
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY });

    // Set user ID if provided (for user-specific purchases)
    if (userId) {
      await Purchases.logIn(userId);
    }

    // Enable debug logs in development
    if (__DEV__) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('Error initializing RevenueCat:', error);
    throw error;
  }
}

// Request deduplication: track pending requests to prevent concurrent calls
let pendingCustomerInfoRequest: Promise<CustomerInfo> | null = null;

/**
 * Get current customer info
 * Uses request deduplication to prevent concurrent calls
 */
export async function getCustomerInfo(): Promise<CustomerInfo> {
  // If there's already a pending request, return it instead of creating a new one
  if (pendingCustomerInfoRequest) {
    return pendingCustomerInfoRequest;
  }

  // Create a new request
  pendingCustomerInfoRequest = (async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Error fetching customer info:', error);
      throw error;
    } finally {
      // Clear the pending request when done (success or error)
      pendingCustomerInfoRequest = null;
    }
  })();

  return pendingCustomerInfoRequest;
}

/**
 * Check if user has Pro entitlement
 */
export async function hasProEntitlement(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    console.error('Error checking entitlement:', error);
    return false;
  }
}

/**
 * Get current offerings (products available for purchase)
 */
export async function getOfferings(): Promise<Offerings | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return null;
  }
}

/**
 * Purchase a package
 */
export async function purchasePackage(
  packageToPurchase: PurchasesPackage
): Promise<CustomerInfo> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo;
  } catch (error) {
    const purchasesError = error as PurchasesError;

    // Handle user cancellation gracefully
    if (purchasesError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      throw new Error('Purchase was cancelled');
    }

    // Handle other errors
    console.error('Error purchasing package:', purchasesError);
    throw purchasesError;
  }
}

/**
 * Restore purchases
 */
export async function restorePurchases(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('Error restoring purchases:', error);
    throw error;
  }
}

/**
 * Check if user is subscribed (has active subscription)
 */
export async function isSubscribed(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID];

    if (!entitlement) {
      return false;
    }

    // Check if it's a subscription (not a one-time purchase like lifetime)
    const productId = entitlement.productIdentifier;
    return (
      productId === PRODUCT_IDENTIFIERS.MONTHLY ||
      productId === PRODUCT_IDENTIFIERS.YEARLY
    );
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}

/**
 * Get active subscription product identifier
 */
export async function getActiveProductIdentifier(): Promise<string | null> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[PRO_ENTITLEMENT_ID];
    return entitlement?.productIdentifier || null;
  } catch (error) {
    console.error('Error getting active product identifier:', error);
    return null;
  }
}

/**
 * Sync purchases (refresh customer info)
 */
export async function syncPurchases(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Error syncing purchases:', error);
    throw error;
  }
}

/**
 * Set user ID for RevenueCat
 */
export async function setUserId(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
  } catch (error) {
    console.error('Error setting user ID:', error);
    throw error;
  }
}

/**
 * Log out current user
 */
export async function logOutUser(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.logOut();
    return customerInfo;
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
}
