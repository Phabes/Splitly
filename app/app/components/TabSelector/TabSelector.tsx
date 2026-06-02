import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Typography } from "../Typography";
import { useThemeContext, useTranslations } from "@/app/hooks";
import { TranslationKeys } from "@/app/constants/translations";

interface TabSelectorProps<T extends TranslationKeys> {
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export const TabSelector = <T extends TranslationKeys>({
  tabs,
  activeTab,
  onTabChange,
}: TabSelectorProps<T>) => {
  const translations = useTranslations();
  const styles = useStyles();

  return (
    <View style={styles.tabsRow}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tabButton,
            activeTab === tab && styles.tabButtonActive,
          ]}
          onPress={() => onTabChange(tab)}
          activeOpacity={0.7}
        >
          <Typography
            text={translations[tab]}
            color={activeTab === tab ? "text-primary" : "text-secondary"}
            variant="header-small"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    tabsRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors["background-secondary"],
    },
    tabButton: {
      flex: 1,
      alignItems: "center",
      paddingVertical: theme.spacing(3),
      borderBottomWidth: theme.spacing(0.5),
      borderBottomColor: "transparent",
    },
    tabButtonActive: {
      borderBottomColor: theme.colors["background-primary"],
    },
  });
};

export default TabSelector;
