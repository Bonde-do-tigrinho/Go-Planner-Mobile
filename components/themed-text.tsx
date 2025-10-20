import { StyleSheet, Text, type TextProps } from "react-native";
import { Colors, Fonts } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "subtitle" | "link" | "px" | "sm" | "lg";
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark;
  isSemiBold?: boolean;
  isBold?: boolean;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  colorName,
  type = "default",
  isSemiBold = false,
  isBold = false,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorName
  );
  
  // Determina a fonte baseada nas props
  let fontFamily = Fonts.sans;
  
  if (isBold || type === "title") {
    fontFamily = Fonts.sansBold;
  } else if (isSemiBold || type === "subtitle") {
    fontFamily = Fonts.sansSemiBold;
  }
  
  // Debug - remova depois de testar
  console.log('🔤', { type, isSemiBold, isBold, fontFamily });

  return (
    <Text
      style={[
        { color, fontFamily }, // Aplica a fonte diretamente
        type === "px" ? styles.px : undefined,
        type === "sm" ? styles.sm : undefined,
        type === "lg" ? styles.lg : undefined,
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  px: {
    fontSize: 12,
    lineHeight: 24,
  },
  sm: {
    fontSize: 14,
    lineHeight: 24,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  lg: {
    fontSize: 20,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 24,
    lineHeight: 32,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});