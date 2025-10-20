// components/ui/themed-view.tsx
import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';


export type ThemedViewProps = ViewProps & {
  // Overrides específicos
  lightBg?: string;
  darkBg?: string;
  lightBorder?: string;
  darkBorder?: string;

  // Nomes das cores padrão do seu tema
  bgName?: keyof typeof Colors.light & keyof typeof Colors.dark;
  borderName?: keyof typeof Colors.light & keyof typeof Colors.dark;
  
  // Prop para a largura da borda
  borderWidth?: number;
  children?: React.ReactNode
};

export function ThemedView({
  style,
  lightBg,
  darkBg,
  lightBorder,
  darkBorder,
  bgName = 'bgPrimary', // Valor padrão: 'background'
  borderName = "bgPrimary",
  borderWidth,
  children,
  ...otherProps
}: ThemedViewProps) {
  // Lógica separada para cada cor
  const backgroundColor = useThemeColor({ light: lightBg, dark: darkBg }, bgName);
  const borderColor = useThemeColor({ light: lightBorder, dark: darkBorder }, borderName);

  return (
    <View 
      style={[{ backgroundColor, borderColor, borderWidth }, style]} 
      {...otherProps} 
    >
      {children}
    </View>
  );
}