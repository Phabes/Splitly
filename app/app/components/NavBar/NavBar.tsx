import { TypographyKeys } from "@/app/constants/theme";
import { FC, JSX } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "../Typography";
import { useThemeContext } from "@/app/hooks";
import { Icon } from "../Icon";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

export type NavBarProps = {
  text: string;
  variant?: TypographyKeys;
  onBackPress?: () => void;
  button?: JSX.Element;
};

export const NavBar: FC<NavBarProps> = ({
  text,
  variant = "header-medium",
  onBackPress,
  button,
}) => {
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
            icon={faAngleLeft}
            size="large"
          />
        )}
        <Typography
          variant={variant}
          text={text}
        />
      </TouchableOpacity>
      {button}
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
