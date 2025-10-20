import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ThemedView } from "./themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";


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
  const tabActive = useThemeColor({}, 'tabActive');
  const tabTextActive = useThemeColor({}, 'tabTextActive');
  const tabInactive = useThemeColor({}, 'tabInactive');
  const tabTextInactive = useThemeColor({}, 'tabTextInactive');
  return (
    <ThemedView bgName="bgPrimary" style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, {borderColor: tabInactive}, isActive && {backgroundColor: tabActive, borderWidth: 0}]}
              onPress={() => onTabPress(tab)}
            >
              <Text style={[{color: tabTextInactive}, {borderColor: tabInactive}, isActive && {color: tabTextActive, borderWidth: 0} ]}>
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
    paddingLeft: 0, // Começa com o mesmo padding do header
    paddingVertical: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.tabInactive,
    marginRight: 12, // Espaçamento entre os botões
  },
  activeTab: {
    borderWidth: 0
  },
  tabText: {
    color: colors.tabInactiveText,
    fontWeight: "500",
  },
});
