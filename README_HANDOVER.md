# Thryve Wellness - Handover Documentation

## 🌟 Project Overview
**Thryve** is a preventive healthcare and wellness application designed to help users build long-term healthy habits through fragmented data integration, AI coaching, and gamification.

### 🎯 Current Status
The project is currently a high-fidelity frontend prototype. It features a fully functional navigation system, interactive logging, data visualization, and a live AI coaching integration.

---

## 🛠 Tech Stack
- **Framework:** React 19 (ES6 Modules)
- **Styling:** Tailwind CSS (Clean, Utility-first)
- **Icons/Avatars:** Inline SVGs & DiceBear API
- **Charts:** Recharts (Area and Bar charts)
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Animations:** CSS3 3D Transforms & Tailwind `animate-in` transitions

---

## 🎨 Design System & UI/UX
The app follows a **"Calm Tech"** philosophy:
- **Background:** `#EEF2F6` (Soft off-white/blue tint) to reduce eye strain.
- **Cards:** Pure White (`#FFFFFF`) with soft elevation (`shadow-[0_16px_48px_rgba(0,0,0,0.05)]`) to create clear visual hierarchy.
- **Primary Color:** `#4CB8A4` (Thryve Teal) - representing health and balance.
- **Secondary Color:** `#6EC1E4` (Sky Blue) - representing hydration and calm.
- **Typography:** Inter (Sans-serif), focusing on readability and varying font weights for information density.

---

## 🚀 Key Features

### 1. Home Dashboard
- **Streak Tracker:** Gamified visual for consecutive days logged.
- **AI Highlight Card:** Dynamically surfaces the most important insight from user data.
- **Daily Summary:** Quick-view grid of core metrics.

### 2. Daily Logging (Track)
- **Mood Selector:** Emoji-based sentiment tracking with haptic-style feedback.
- **Sleep & Hydration:** Interactive sliders and increment buttons.
- **Flip Dice Challenge:** 
    - **Visual:** A 3D CSS-based cube with multi-color matte faces.
    - **Logic:** Uses random tumble physics and settling bounces.
    - **Audio:** Synthesized audio feedback for tactile feel.
    - **Purpose:** Gamifies "boring" habits (e.g., "Drink water").

### 3. AI Insights
- **Data Visualization:** Weekly trends for Mood and Steps.
- **Pattern Recognition:** Mock "AI Insights" that explain correlations (e.g., the link between sleep and mood).

### 4. Thryve AI Coach
- **Engine:** `gemini-3-pro-preview`.
- **Persona:** Empathetic, concise, and evidence-based.
- **Feature:** Includes "Thinking Budget" for high-reasoning wellness advice.
- **UI:** Chat-bubble interface with dark mode support and "thinking" state indicators.

---

## 📂 File Structure
- `App.tsx`: Navigation logic and theme management.
- `types.ts`: Centralized TypeScript interfaces.
- `services/geminiService.ts`: AI logic (requires `process.env.API_KEY`).
- `components/FlipDiceChallenge.tsx`: The standalone 3D dice game.
- `screens/`: Individual page layouts (Home, Track, Insights, Profile, Chat).

---

## 🔐 Security & API Setup (Action Required)
**IMPORTANT:** No API keys are hardcoded in this repository. 

To use the AI features, the partner must:
1. Obtain an API Key from [Google AI Studio](https://aistudio.google.com/).
2. Set an environment variable named `API_KEY` in their local development environment or hosting platform.
3. The code will automatically pick up this key via `process.env.API_KEY`. 

**Note:** If no key is provided, the AI Chat will return a connection error message.

---

## ⏭ Next Steps for Development
1. **Persistence:** Implement `localStorage` or a backend (Firebase/Supabase) to save logs.
2. **Apple Health / Google Fit Integration:** Replace mock step data with real sensor data.
3. **AI Personalization:** Pass real historical user logs to the Gemini system instruction for "true" personalization.
4. **Push Notifications:** Add local notification triggers for habit reminders.
5. **Real-time Audio:** Integrate Gemini Live API for voice-based coaching.
