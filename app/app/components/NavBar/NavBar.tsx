import { TypographyKeys } from "@/app/constants/theme";
import { FC, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useThemeContext } from "@/app/hooks";
import { Typography } from "../Typography";
import { Icon } from "../Icon";
import { TouchableIcon } from "../TouchableIcon";
import { NotificationIndicator } from "../NotificationIndicator";
import { GlobalMenu, MenuAction } from "./components";
import { useRingingBell } from "./hooks/useRingingBell";

export type NavBarProps = {
  text: string;
  variant?: TypographyKeys;
  onBackPress?: () => void;
  notificationsPress?: () => void;
  notificationsExist?: boolean;
  showMenu?: boolean;
  menuActions?: MenuAction[];
};

export const NavBar: FC<NavBarProps> = ({
  text,
  variant = "header-medium",
  onBackPress,
  notificationsPress,
  notificationsExist = false,
  showMenu = true,
  menuActions = [],
}) => {
  const { spin } = useRingingBell();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const styles = useStyles();

  const bell = notificationsExist ? "Bell" : "EmptyBell";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.leftSide}
        disabled={!onBackPress}
      >
        {onBackPress && (
          <Icon
            icon="AngleLeft"
            size="large"
          />
        )}
        <Typography
          variant={variant}
          text={text}
        />
      </TouchableOpacity>

      <View style={styles.rightSide}>
        {notificationsPress && (
          <View>
            <Animated.View
              style={[
                notificationsExist && {
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              <TouchableIcon
                icon={bell}
                onPress={notificationsPress}
                color="text-notification"
                size="small"
                hitBox="large"
              />
            </Animated.View>
            {notificationsExist && <NotificationIndicator />}
          </View>
        )}
        {showMenu && (
          <>
            <TouchableIcon
              icon="Bars"
              onPress={() => setIsMenuVisible(true)}
              color="text-primary"
            />

            <GlobalMenu
              isVisible={isMenuVisible}
              onClose={() => setIsMenuVisible(false)}
              customActions={menuActions}
            />
          </>
        )}
      </View>
    </View>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: {
      height: theme.spacing(15),
      paddingHorizontal: theme.spacing(7),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors["background-secondary"],
    },
    leftSide: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing(2),
    },
    rightSide: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing(4),
    },
  });
};

export default NavBar;
