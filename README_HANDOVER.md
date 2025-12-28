# Thryve Wellness - Mobile Handover

## 📱 Platform Shift: Web to Native
**IMPORTANT:** Thryve has been architected as a native mobile application. Web-only technologies (Tailwind Web, Recharts, Web Audio) have been deprecated in favor of native equivalents.

## 🛠 Updated Mobile Stack

### 🔹 Core Framework
- **React Native (v0.76+):** True native components, no DOM overhead.
- **Expo SDK:** Industry-standard toolchain for cross-platform hardware access.

### 🔹 UI & Interaction
- **Styling:** NativeWind (v4). Use `className` with mobile-optimized utility classes.
- **Animations:** React Native Reanimated. All animations run on the native UI thread to prevent JS-bottlenecks.
- **Charts:** Victory Native XL (Skia-based). Much higher performance than web-based SVGs.

### 🔹 Hardware Integration
- **Haptics:** `expo-haptics` for tactile engagement during the Dice Roll.
- **Audio:** `expo-av` for spatial sound effects.
- **Haptics Logic:**
  - `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)` on dice collision.
  - `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)` on task completion.

### 🔹 Logic & Data
- **AI:** `@google/genai` (Gemini 3 Pro).
- **Networking:** Native `fetch` API.
- **Storage:** `expo-sqlite` (Relational storage for logs) + `AsyncStorage` (Settings).

## 🚀 Running the App
1. Install the **Expo Go** app on your iOS/Android device.
2. Run `npx expo start` in the terminal.
3. Scan the QR code to load the app directly on your handset.

## ⏭ Mobile-Specific Roadmap
1. **HealthKit / Google Fit:** Integrate `react-native-health` to pull real step data.
2. **Biometrics:** Add FaceID/TouchID login using `expo-local-authentication`.
3. **Background Tasks:** Use `expo-task-manager` for hydration reminders even when the app is closed.
