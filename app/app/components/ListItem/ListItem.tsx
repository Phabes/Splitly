import { useThemeContext } from "@/app/hooks";
import { FC, PropsWithChildren } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type ListItemProps = PropsWithChildren<{
  onPress: () => void;
}>;

export const ListItem: FC<ListItemProps> = ({ onPress, children }) => {
  const styles = useStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      {children}
    </TouchableOpacity>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      minHeight: theme.spacing(16),
      alignItems: "center",
      borderWidth: 1,
      borderRadius: theme.spacing(3),
      borderColor: theme.colors["text-secondary"],
      paddingHorizontal: theme.spacing(4),
      paddingVertical: theme.spacing(3),
      backgroundColor: theme.colors["background-primary"],
      gap: theme.spacing(1),
    },
  });
};

export default ListItem;
