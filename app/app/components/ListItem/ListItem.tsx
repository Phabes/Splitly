import { FC, Fragment, JSX, PropsWithChildren } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "../Typography";
import { useThemeContext } from "@/app/hooks";

type ListItemProps = PropsWithChildren<{
  text: string;
  onPress: () => void;
}>;

export const ListItem: FC<ListItemProps> = ({ text, onPress, children }) => {
  const styles = useStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={styles.text}>
        <Typography
          text={text}
          variant="body-small"
        />
      </View>
      {children && <View style={styles.buttons}>{children}</View>}
    </TouchableOpacity>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: theme.spacing(2),
      borderColor: theme.colors["text-secondary"],
      paddingHorizontal: theme.spacing(4),
      paddingVertical: theme.spacing(3),
    },
    text: { flex: 1 },
    buttons: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing(1),
    },
  });
};

export default ListItem;
