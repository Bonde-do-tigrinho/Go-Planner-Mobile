import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ThemedView } from "./themed-view";

const colors = {
  primary: "#FFE3DD",
  tabActiveText: "#FF5733",
  tabActive: "#FF5733",
  tabInactive: "#CCCCCC",
  tabInactiveText: "#888888",
  background: "#FFFFFF",
};
interface tabSelectorProps {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
}
export default function TabSelector({
  tabs,
  activeTab,
  onTabPress,
}: tabSelectorProps) {
  return (
    <ThemedView bgName="bgPrimary" style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onTabPress(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingLeft: 10, // Começa com o mesmo padding do header
    paddingVertical: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.tabInactive,
    marginRight: 10, // Espaçamento entre os botões
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderWidth: 0
  },
  tabText: {
    color: colors.tabInactiveText,
    fontWeight: "500",
  },
  activeTabText: {
    color: colors.tabActiveText,
  },
});
