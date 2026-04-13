# Habit Counter

A minimal, modern habit tracking app built with React Native and Expo. Track your daily habits, build streaks, and visualize your progress.

## Features

- Create and manage daily habits
- Track daily progress with increment/decrement buttons
- Automatic streak calculation
- 7-day history view
- Dark mode support
- Local data persistence (no account required)
- Clean, modern UI

## Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Storage**: AsyncStorage (local persistence)
- **Styling**: React Native StyleSheet

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For Android development: Android Studio with an emulator or physical device
- For iOS development: Xcode (macOS only)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd habit-tracker-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create app icons (see Icons section below)

4. Start the development server:
   ```bash
   npm start
   ```

### Running on Android

```bash
npm run android
```

Or scan the QR code from the Expo Go app on your Android device.

### Running on iOS

```bash
npm run ios
```

Or scan the QR code from the Expo Go app on your iOS device.

## Building for Production

### Prerequisites for Building

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Configure the project:
   ```bash
   eas build:configure
   ```

### Build Android APK (for testing)

```bash
npm run build:android:preview
```

This creates an APK file that can be installed directly on Android devices.

### Build Android App Bundle (for Play Store)

```bash
npm run build:android
```

This creates an AAB file suitable for Google Play Store submission.

## Icons

Before building, you need to create the app icons. Place the following files in the `assets/` folder:

- `icon.png` - 1024x1024px app icon
- `adaptive-icon.png` - 1024x1024px (Android adaptive icon foreground)
- `splash-icon.png` - 200x200px or larger splash screen icon
- `favicon.png` - 48x48px web favicon

You can use tools like:
- [Figma](https://figma.com)
- [App Icon Generator](https://www.appicon.co/)
- [Expo's icon builder](https://buildicon.netlify.app/)

### Suggested Design

A simple design suggestion for the icon:
- Background: Indigo (#6366F1)
- Foreground: White checkmark or counter symbol
- Style: Minimal, modern, rounded

## Project Structure

```
src/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Home screen
│   ├── add-habit.tsx      # Add habit screen
│   ├── settings.tsx       # Settings screen
│   ├── habit/
│   │   └── [id].tsx       # Habit detail screen
│   └── edit-habit/
│       └── [id].tsx       # Edit habit screen
├── components/            # Reusable UI components
├── constants/             # Theme, colors, spacing
├── context/               # React contexts for state
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## Package Name

**Suggested Android package name**: `com.habitcounter.app`

You can change this in `app.json` under `expo.android.package`.

## Customization

### Changing Colors

Edit `src/constants/theme.ts` to customize the color palette.

### Adding More Emojis

Edit the `SuggestedEmojis` array in `src/constants/theme.ts`.

## License

MIT License - see LICENSE file for details.

---

## Play Store Information

### App Title
**Habit Counter - Daily Tracker**

### Short Description
Track your daily habits with a simple, beautiful counter app. Build streaks and stay consistent.

### Full Description
Habit Counter is a minimalist habit tracking app designed to help you build and maintain positive daily habits.

**Key Features:**
- Simple tap-to-count interface
- Track multiple habits with customizable daily targets
- Visual streak tracking to keep you motivated
- 7-day history view
- Dark mode for comfortable nighttime use
- 100% offline - your data stays on your device
- No account required
- No ads
- No tracking

**How It Works:**
1. Create a habit with a name, emoji, and daily target
2. Tap the + button each time you complete the habit
3. Watch your streak grow as you stay consistent
4. View your progress in the detailed habit view

Whether you want to drink more water, exercise regularly, read every day, or build any other positive habit, Habit Counter makes tracking simple and satisfying.

**Privacy Focused:**
All your data is stored locally on your device. We don't collect any personal information, and there are no accounts to create.

Start building better habits today with Habit Counter.

---

## Privacy Policy Summary

**Habit Counter Privacy Policy**

Habit Counter is committed to protecting your privacy.

**Data Collection**: Habit Counter does not collect, store, or transmit any personal data to external servers. All habit data, including habit names, progress, and settings, is stored locally on your device using AsyncStorage.

**No Account Required**: The app does not require any account creation or login. There is no server-side storage of your data.

**No Analytics**: We do not use any analytics or tracking tools.

**No Ads**: The app contains no advertisements.

**Data Deletion**: You can delete all your data at any time through the Settings screen by using the "Reset All Data" option. Uninstalling the app will also remove all stored data.

**Third-Party Services**: The app does not integrate with any third-party services that would access your data.

**Contact**: For questions about this privacy policy, please open an issue on the project repository.

Last updated: 2024
