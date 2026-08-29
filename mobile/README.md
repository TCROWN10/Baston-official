/**
 * USSAP native mobile field client (Android / iOS)
 * ------------------------------------------------
 * Scaffold for Expo React Native. Install Expo in this folder, then share
 * geocoding logic with the web app via the copied modules below.
 *
 * Setup:
 *   cd mobile
 *   npx create-expo-app@latest . --template blank-typescript
 *   npx expo install expo-location expo-secure-store @react-native-async-storage/async-storage react-native-maps
 *
 * The App.tsx stub below shows the BRD offline pin-drop flow for field agents.
 */

export const MOBILE_BRD_SCOPE = {
  platforms: ["Android", "iOS"],
  features: [
    "Drop pins offline",
    "View cached map tiles / last known locations",
    "Retrieve digital addresses without connectivity",
    "Sync queue when reconnected",
    "RBAC via secure token storage",
  ],
} as const;
