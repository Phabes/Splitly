import { FC } from "react";
import { useThemeContext, useTranslations } from "@/app/hooks";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "../Icon";
import { getIcon } from "@/app/utils";
import { IconKeys } from "@/app/constants/iconKeys";
import { Typography } from "../Typography";
import { TranslationKeys } from "@/app/constants/translations";

export const TabBar: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const translations = useTranslations();
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

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

        const iconSize = isFocused ? "large" : "small";
        const iconColor = isFocused ? "text-primary" : "text-secondary";

        const { options } = descriptors[route.key];
        const iconKey = options.tabBarAccessibilityLabel as IconKeys;
        const translationKey =
          options.tabBarAccessibilityLabel?.toLowerCase() as TranslationKeys;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tab}
          >
            <View style={styles.tabIcon}>
              <Icon
                icon={getIcon(iconKey)}
                size={iconSize}
                color={iconColor}
              />
            </View>
            <View style={styles.tabDescription}>
              <Typography
                text={translations[translationKey]}
                variant="body-small"
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: {
      height: theme.spacing(15),
      flexDirection: "row",
      backgroundColor: theme.colors["background-secondary"],
      // borderTopWidth: 1,
      // borderTopColor: theme.colors["text-primary"],
    },
    tab: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    tabIcon: {
      flex: 1,
      justifyContent: "center",
    },
    tabDescription: { paddingBottom: theme.spacing(1) },
  });
};

export default TabBar;
