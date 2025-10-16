import { StyleSheet, Text, type TextProps } from "react-native";

import { Colors, Fonts } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  // MUDANÇA 1: Adicionados os novos tipos de tamanho
  type?:
    | "default"
    | "title"
    | "subtitle"
    | "link"
    | "px"
    | "sm"
    | "lg";
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark;
  isSemiBold?: boolean;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  colorName,
  type = "default",
  isSemiBold = false,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorName
  );

  return (
    <>
      <Text
        style={[
          { color },
          // MUDANÇA 2: Adicionadas as condições para os novos tipos
          type === "px" ? styles.px : undefined,
          type === "sm" ? styles.sm : undefined,
          type === "lg" ? styles.lg : undefined,
          type === "default" ? styles.default : undefined,
          type === "title" ? styles.title : undefined,
          type === "subtitle" ? styles.subtitle : undefined,
          type === "link" ? styles.link : undefined,
          isSemiBold ? styles.semiBoldFont : undefined,
          style,
        ]}
        {...rest}
      />
    </>
  );
}

const styles = StyleSheet.create({
  px: {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: Fonts.sans,
  },
  sm: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: Fonts.sans,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.sans,
  },
  lg: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: Fonts.sans,
  },
  semiBoldFont: {
    fontFamily: Fonts.sansSemiBold,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.sansBold,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: Fonts.sans,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: Fonts.sans,
  },
});