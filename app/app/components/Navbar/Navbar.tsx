import { TypographyKeys } from "@/app/constants/theme";
import { FC, JSX } from "react";
import { StyleSheet, View } from "react-native";
import { Typography } from "../Typography";
import { useThemeContext } from "@/app/hooks";

export type NavbarProps = {
  text: string;
  variant?: TypographyKeys;
  button?: JSX.Element;
};

export const Navbar: FC<NavbarProps> = ({
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
    },
  });
};

export default Navbar;
