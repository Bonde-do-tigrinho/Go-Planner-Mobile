import { StyleSheet } from "react-native";

import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

export default function TabTwoScreen() {
  // Protege a rota verificando autenticação
  const { isLoading } = useAuth();

  // Enquanto carrega, não renderiza nada
  if (isLoading) {
    return null;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          colorName="textPrimary"
          type="title"
          style={{
            fontFamily: Fonts.sansSemiBold,
          }}
        >
          Explore
        </ThemedText>
      </ThemedView>
      <ThemedText colorName="textPrimary">
        This app includes example code to help you get started.
      </ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText colorName="textPrimary">
          This app has two screens:{" "}
          <ThemedText colorName="textPrimary">app/(tabs)/index.tsx</ThemedText>{" "}
          and{" "}
          <ThemedText colorName="textPrimary">
            app/(tabs)/explore.tsx
          </ThemedText>
        </ThemedText>
        <ThemedText colorName="textPrimary">
          The layout file in{" "}
          <ThemedText colorName="textPrimary">
            app/(tabs)/_layout.tsx
          </ThemedText>{" "}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText colorName="textPrimary">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
