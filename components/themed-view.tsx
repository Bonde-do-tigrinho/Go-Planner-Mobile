import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  bgColor: keyof typeof Colors.light & keyof typeof Colors.dark
};

export function ThemedView({ style, lightColor, darkColor, bgColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, bgColor);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
