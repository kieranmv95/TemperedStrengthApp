import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOffering as Offerings,
  PURCHASES_ERROR_CODE,
  PurchasesError,
  PurchasesPackage,
} from 'react-native-purchases';

const REVENUECAT_TEST_KEY = 'test_SnvzLVCMTIHpdvZxNJETTYDrEhL';

// RevenueCat API Keys
// https://app.revenuecat.com → Project → API keys
// iOS production: appl_* | Android production: goog_* | Sandbox: test_*
// Set EXPO_PUBLIC_REVENUECAT_API_KEY_IOS / _ANDROID in EAS secrets for store builds.
const REVENUECAT_API_KEY =
  Platform.OS === 'android'
    ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ||
      process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ||
      REVENUECAT_TEST_KEY
    : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ||
      process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ||
      REVENUECAT_TEST_KEY;

if (__DEV__) {
  const isTestKey = REVENUECAT_API_KEY.startsWith('test_');
  const isIosProductionKey = REVENUECAT_API_KEY.startsWith('appl_');
  const isAndroidProductionKey = REVENUECAT_API_KEY.startsWith('goog_');
  const isValidProductionKey =
    Platform.OS === 'android' ? isAndroidProductionKey : isIosProductionKey;

  if (!isTestKey && !isValidProductionKey) {
    const expected =
      Platform.OS === 'android' ? "'test_' or 'goog_'" : "'test_' or 'appl_'";
    console.warn(
      `⚠️ RevenueCat API key format may be invalid. Expected ${expected} prefix.`
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

// Request deduplication + SDK serialization. RevenueCat returns 7638 when
// getCustomerInfo() is invoked while another request is still in flight.
let pendingCustomerInfoRequest: Promise<CustomerInfo> | null = null;
let sdkCustomerInfoMutex: Promise<void> = Promise.resolve();
/** Bumped on invalidate so callers after logIn never reuse a pre-login result. */
let customerInfoRequestGeneration = 0;

const REQUEST_IN_FLIGHT_ERROR_CODE = 7638;
const MAX_CUSTOMER_INFO_ATTEMPTS = 3;

function isRequestInFlightError(error: unknown): boolean {
  const purchasesError = error as {
    info?: { backendErrorCode?: number };
  };
  return purchasesError?.info?.backendErrorCode === REQUEST_IN_FLIGHT_ERROR_CODE;
}

async function fetchCustomerInfoFromSdk(): Promise<CustomerInfo> {
  const previous = sdkCustomerInfoMutex;
  let releaseMutex!: () => void;
  sdkCustomerInfoMutex = new Promise<void>((resolve) => {
    releaseMutex = resolve;
  });

  await previous;
  try {
    return await Purchases.getCustomerInfo();
  } finally {
    releaseMutex();
  }
}

/**
 * Drop any cached getCustomerInfo() result so a post-login fetch cannot reuse a
 * pre-login (anonymous) response. Does not interrupt an in-flight SDK request.
 */
export function invalidateCustomerInfoRequest(): void {
  customerInfoRequestGeneration += 1;
  pendingCustomerInfoRequest = null;
}

/**
 * Get current customer info
 * Uses request deduplication and SDK serialization to prevent concurrent calls
 */
export async function getCustomerInfo(): Promise<CustomerInfo> {
  if (pendingCustomerInfoRequest) {
    return pendingCustomerInfoRequest;
  }

  const generationAtStart = customerInfoRequestGeneration;
  pendingCustomerInfoRequest = (async () => {
    try {
      for (let attempt = 0; attempt < MAX_CUSTOMER_INFO_ATTEMPTS; attempt++) {
        try {
          const customerInfo = await fetchCustomerInfoFromSdk();
          if (generationAtStart !== customerInfoRequestGeneration) {
            pendingCustomerInfoRequest = null;
            return getCustomerInfo();
          }
          return customerInfo;
        } catch (error) {
          if (
            isRequestInFlightError(error) &&
            attempt < MAX_CUSTOMER_INFO_ATTEMPTS - 1
          ) {
            await new Promise((resolve) =>
              setTimeout(resolve, 250 * (attempt + 1))
            );
            continue;
          }
          if (!isRequestInFlightError(error)) {
            console.error('Error fetching customer info:', error);
          }
          throw error;
        }
      }
      throw new Error('Failed to fetch customer info');
    } finally {
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
    const customerInfo = await getCustomerInfo();
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
    const customerInfo = await getCustomerInfo();
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
    const customerInfo = await getCustomerInfo();
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
    return await getCustomerInfo();
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
export async function logOutUser(): Promise<CustomerInfo | null> {
  try {
    const anonymous = await Purchases.isAnonymous();
    if (anonymous) {
      return null;
    }
    const customerInfo = await Purchases.logOut();
    return customerInfo;
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
}

/**
 * Tie RevenueCat identity to the signed-in account (or return to anonymous).
 * Call whenever Supabase auth session appears or clears.
 */
export async function syncRevenueCatIdentity(
  userId: string | null
): Promise<CustomerInfo | null> {
  // Any getCustomerInfo() started as anonymous must not be reused after this.
  invalidateCustomerInfoRequest();
  if (userId) {
    const { customerInfo } = await Purchases.logIn(userId);
    invalidateCustomerInfoRequest();
    return customerInfo;
  }
  const customerInfo = await logOutUser();
  invalidateCustomerInfoRequest();
  return customerInfo;
}
