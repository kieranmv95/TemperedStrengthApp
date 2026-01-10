# RevenueCat Production Setup Guide

## Current Status

**⚠️ NOT PRODUCTION READY**

Currently using a **TEST key**: `test_SnvzLVCMTIHpdvZxNJETTYDrEhL`

## Steps to Go to Production

### 1. Get Your Production API Keys

1. Go to your RevenueCat Dashboard: https://app.revenuecat.com
2. Navigate to **Project Settings** → **API Keys**
3. You'll need:
   - **iOS Production Key** (starts with `appl_`)
   - **Android Production Key** (starts with `goog_`)

### 2. Set Up Environment Variables

#### Option A: Using EAS Secrets (Recommended for Production)

```bash
# Set iOS production key
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_API_KEY_IOS --value appl_YOUR_IOS_KEY

# Set Android production key  
eas secret:create --scope project --name EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID --value goog_YOUR_ANDROID_KEY
```

Then update `src/services/revenueCatService.ts` to use platform-specific keys:

```typescript
import { Platform } from 'react-native';

const REVENUECAT_API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || 'test_SnvzLVCMTIHpdvZxNJETTYDrEhL',
  android: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || 'test_SnvzLVCMTIHpdvZxNJETTYDrEhL',
  default: 'test_SnvzLVCMTIHpdvZxNJETTYDrEhL',
});
```

#### Option B: Using .env file (For Local Development)

Create a `.env` file (already in `.gitignore`):

```env
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_YOUR_IOS_KEY
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_YOUR_ANDROID_KEY
```

### 3. Update EAS Build Configuration

In `eas.json`, you can set different keys for different build profiles:

```json
{
  "build": {
    "development": {
      "env": {
        "EXPO_PUBLIC_REVENUECAT_API_KEY_IOS": "test_SnvzLVCMTIHpdvZxNJETTYDrEhL",
        "EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID": "test_SnvzLVCMTIHpdvZxNJETTYDrEhL"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_REVENUECAT_API_KEY_IOS": "${EXPO_PUBLIC_REVENUECAT_API_KEY_IOS}",
        "EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID": "${EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID}"
      }
    }
  }
}
```

### 4. Verify Configuration

Before building for production:

- [ ] Production API keys are set in RevenueCat dashboard
- [ ] Environment variables are configured (EAS secrets or .env)
- [ ] Products are configured in RevenueCat (monthly, yearly, lifetime)
- [ ] Entitlement "Tempered Strength Pro" is created
- [ ] Offerings are set up
- [ ] Paywall is configured in RevenueCat dashboard
- [ ] Test the paywall in a development build first

### 5. Build for Production

```bash
# Build iOS production
eas build --profile production --platform ios

# Build Android production
eas build --profile production --platform android
```

## Current Configuration

- **Entitlement ID**: `Tempered Strength Pro`
- **Product IDs**: 
  - `monthly` (monthly subscription)
  - `yearly` (yearly subscription)
  - `lifetime` (one-time purchase)

## Important Notes

1. **Never commit production keys to git** - Use environment variables or EAS secrets
2. **Test keys only work in sandbox** - Real purchases require production keys
3. **Separate keys for iOS and Android** - Use platform-specific keys for better security
4. **Test in development build first** - Paywalls don't work in Expo Go

