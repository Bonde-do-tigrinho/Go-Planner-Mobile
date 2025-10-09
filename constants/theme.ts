/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#FF5733';
const tintColorDark = '#fff';
const notification = "#C70039"
//troquei as cores para poder visualizar como ficariaa ver lightmode, pois sempre começa com a dark
export const Colors = {
  light: {
    primary: '#FF5733',
    secondary: "#C70039",
    textTitle: '#09090B', 
    textPrimary: '#3F3F46', 
    textSecondary: '#71717A',  
    textTerciary: '#A1A1AA',  
    bgPrimary: '#fff',
    bgSecondary: '#fff ',
    bgTerciary: '#fff',
    borderPrimary: "#999",
    tint: tintColorLight,
    icon: '#aaa',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    notification: notification

  },
  dark: {
    primary: '#FF5733',
    secondary: "#C70039",
    textTitle:   '#FAFAFA',    
    textPrimary: '#E4E4E7',   
    textSecondary: '#A1A1AA',  
    textTerciary:  '#71717A', 
    bgPrimary: '#151718',
    borderPrimary: "#999",
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    notification: notification
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    sansSemiBold: 'Inter-SemiBold',
    sansBold: 'Inter-Bold',
    serif: 'ui-serif',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter',
    sansSemiBold: 'Inter-SemiBold',
    sansBold: 'Inter-Bold',
    serif: 'ui-serif',
    mono: 'ui-monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
