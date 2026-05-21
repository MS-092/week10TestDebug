/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const neonCyan = '#00f5ff';
const neonPink = '#ff00ff';
const neonPurple = '#bf00ff';
const darkBg = '#0a0a0f';
const darkCard = '#12121a';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: neonCyan,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: neonCyan,
  },
  dark: {
    text: '#ECEDEE',
    background: darkBg,
    tint: neonCyan,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: neonCyan,
  },
};

export const NeonColors = {
  cyan: neonCyan,
  pink: neonPink,
  purple: neonPurple,
  darkBg: darkBg,
  darkCard: darkCard,
  darkBorder: '#1a1a25',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
