import { TypographyKeys } from "@/app/constants/theme";
import { FC, JSX } from "react";
import { StyleSheet, View } from "react-native";
import { Typography } from "../Typography";
import { useThemeContext } from "@/app/hooks";

export type NavBarProps = {
  text: string;
  variant?: TypographyKeys;
  button?: JSX.Element;
};

export const NavBar: FC<NavBarProps> = ({
  text,
  variant = "header-medium",
  button,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View>
        <Typography
          variant={variant}
          text={text}
        />
      </View>
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
      // borderBottomWidth: 1,
      // borderBottomColor: theme.colors["text-primary"],
    },
  });
};

export default NavBar;
