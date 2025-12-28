# 🌿 Thryve Wellness (Mobile)

**Thryve** is a native mobile application designed for preventive healthcare and wellness. Built for iOS and Android, it provides a seamless, high-performance experience for tracking mental and physical well-being.

## 📱 Mobile Architecture
Thryve utilizes the **Expo SDK** and **React Native** to deliver a "zero-lag" interface with deep hardware integration.

### 1. Frontend (Mobile App)
- **React Native:** Core framework for native UI components.
- **Expo SDK 52:** Managed workflow for rapid deployment and native module access.
- **React Navigation:** Native-driven Stack and Bottom Tab navigation.

### 2. Styling & UI (Mobile)
- **NativeWind (v4):** Tailwind-style utility classes compiled into native `StyleSheet` objects.
- **Lucide React Native:** Performance-optimized vector icons for mobile displays.
- **Safe Area Context:** Proper handling of notches and home indicators across all devices.

### 3. Animations & Dice Interaction
- **React Native Reanimated (v3):** UI-thread driven animations for the 3D Habit Dice.
- **React Native Gesture Handler:** High-fidelity touch interactions for "tap-to-roll" mechanics.
- **Native Transforms:** Using hardware-accelerated `perspective` and `rotate` matrices.

### 4. Sound & Haptics
- **Expo AV:** Low-latency audio playback for the dice tumble and achievement sounds.
- **Expo Haptics:** Real tactile feedback using the device's vibration motor (Impact/Success patterns).

### 5. AI Integration
- **Google Gemini API:** Native integration with `gemini-3-pro-preview`.
- **Expo Constants:** Secure environment variable management for the `API_KEY`.
- **Thinking Budget:** Configured for high-reasoning wellness coaching.

### 6. Data & Visualization
- **Victory Native XL:** Hardware-accelerated charting via **Shopify Skia** for smooth data rendering.
- **Offline Storage:** Using **Expo SQLite** for local-first health data persistence.

### 7. Development & Build
- **Expo Go:** Real-time testing on physical mobile handsets.
- **EAS (Expo Application Services):** Cloud-based pipeline for `.ipa` and `.apk` production builds.

---
*Thryve is a native experience built for performance and privacy.*