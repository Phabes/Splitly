import { TypographyKeys } from "@/app/constants/theme";
import { FC, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "../Typography";
import { useThemeContext } from "@/app/hooks";
import { Icon } from "../Icon";
import { getIcon } from "@/app/utils";
import { GlobalMenu, MenuAction } from "./components";

export type NavBarProps = {
  text: string;
  variant?: TypographyKeys;
  onBackPress?: () => void;
  showMenu?: boolean;
  menuActions?: MenuAction[];
};

export const NavBar: FC<NavBarProps> = ({
  text,
  variant = "header-medium",
  onBackPress,
  showMenu = true,
  menuActions = [],
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

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

      {showMenu && (
        <>
          <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
            <Icon
              icon={getIcon("Bars")}
              color="text-primary"
            />
          </TouchableOpacity>

          <GlobalMenu
            isVisible={isMenuVisible}
            onClose={() => setIsMenuVisible(false)}
            customActions={menuActions}
          />
        </>
      )}
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
  });
};

export default NavBar;
