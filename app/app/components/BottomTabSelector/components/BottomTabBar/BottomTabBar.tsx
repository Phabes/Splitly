import { IconKeys } from "@/app/constants/iconKeys";
import { TranslationKeys } from "@/app/constants/translations";
import { useThemeContext, useTranslations } from "@/app/hooks";
import { BottomTabBarProps } from "expo-router/js-tabs";
import { FC } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon } from "../../../Icon";
import { Typography } from "../../../Typography";

type TabProps = BottomTabBarProps & {
  showTitle?: boolean;
};

export const BottomTabBar: FC<TabProps> = ({
  state,
  descriptors,
  navigation,
  showTitle = false,
}) => {
  const translations = useTranslations();
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const handlePlusPress = () => {
          navigation.navigate("CreateBill");
        };

        const handleStandardPress = () => {
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
        const iconColor = isFocused ? "text-success" : "text-secondary";

        const { options } = descriptors[route.key];
        const iconKey = options.tabBarAccessibilityLabel as IconKeys;
        const translationKey =
          options.tabBarAccessibilityLabel?.toLowerCase() as TranslationKeys;
        const isFloatingButton = iconKey === "Plus";

        if (isFloatingButton) {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.centerButtonWrapper}
              activeOpacity={0.8}
              onPress={handlePlusPress}
            >
              <View style={styles.centerButton}>
                <Icon
                  icon="Plus"
                  size="large"
                  color="background-primary"
                />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={handleStandardPress}
            activeOpacity={0.7}
            style={styles.tab}
          >
            <View style={styles.tabIcon}>
              <Icon
                icon={iconKey}
                size={iconSize}
                color={iconColor}
              />
            </View>
            {showTitle && (
              <View style={styles.tabDescription}>
                <Typography
                  text={translations[translationKey]}
                  variant="body-small"
                />
              </View>
            )}
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
    centerButtonWrapper: {
      top: -theme.spacing(5),
      justifyContent: "center",
      alignItems: "center",
    },
    centerButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors["text-notification"],
      justifyContent: "center",
      alignItems: "center",
    },
  });
};

export default BottomTabBar;
