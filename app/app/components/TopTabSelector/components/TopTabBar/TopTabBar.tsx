import { TranslationKeys } from "@/app/constants/translations";
import { useThemeContext, useTranslations } from "@/app/hooks";
import { MaterialTopTabBarProps } from "expo-router/js-top-tabs";
import { FC } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "../../../Typography";

export const TopTabBar: FC<MaterialTopTabBarProps> = ({
  state,
  navigation,
}) => {
  const translations = useTranslations();

  const styles = useStyles();

  return (
    <View style={styles.tabsRow}>
      {state.routes.map((route: any, index: any) => {
        const isFocused = state.index === index;

        const tabKey = route.name.toLowerCase() as TranslationKeys;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabButton, isFocused && styles.tabButtonActive]}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Typography
              text={translations[tabKey]}
              color={isFocused ? "text-primary" : "text-secondary"}
              variant="header-small"
            />
          </TouchableOpacity>
        );
      })}
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

export default TopTabBar;
