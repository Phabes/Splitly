import { TypographyKeys } from "@/app/constants/theme";
import { FC, JSX, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "../Typography";
import { useAuthContext, useThemeContext } from "@/app/hooks";
import { Icon } from "../Icon";
import { getIcon } from "@/app/utils";
import { GlobalMenu, MenuAction } from "./components";

export type NavBarProps = {
  text: string;
  variant?: TypographyKeys;
  onBackPress?: () => void;
  button?: JSX.Element;
  showMenu?: boolean; // Toggle global menu
  menuActions?: MenuAction[]; // Custom actions for this specific screen
};

export const NavBar: FC<NavBarProps> = ({
  text,
  variant = "header-medium",
  onBackPress,
  button,
  showMenu = false,
  menuActions = [],
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { signOut } = useAuthContext();

  const renderRightElement = () => {
    if (showMenu) {
      return (
        <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
          <Icon
            icon={getIcon("Bars")}
            color="text-primary"
          />
        </TouchableOpacity>
      );
    }
    return <></>;
  };

  const styles = useStyles();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.leftSide}
        disabled={!onBackPress}
      >
        {onBackPress && (
          <Icon
            icon={getIcon("AngleLeft")}
            size="large"
          />
        )}
        <Typography
          variant={variant}
          text={text}
        />
      </TouchableOpacity>
      {renderRightElement()}
      {showMenu && (
        <GlobalMenu
          isVisible={isMenuVisible}
          onClose={() => setIsMenuVisible(false)}
          onSignOut={signOut}
          customActions={menuActions}
        />
      )}
    </View>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: {
      height: theme.spacing(15),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing(7),
      backgroundColor: theme.colors["background-secondary"],
    },
    leftSide: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing(2),
    },
  });
};

export default NavBar;
