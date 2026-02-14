/**
 * Re-export subscription hook from context
 * This maintains backward compatibility with existing imports
 */
export {
  useSubscriptionContext as useSubscription,
  type SubscriptionState,
} from "./subscription-context";
