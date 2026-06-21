import { FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useThemeContext } from "@/app/hooks";
import { Icon } from "../Icon";

type FabProps = {
  onPress: () => void;
};

export const Fab: FC<FabProps> = ({ onPress }) => {
  const styles = useStyles();

  return (
    <TouchableOpacity
      style={styles.fab}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Icon
        icon="Plus"
        size="large"
        color="background-secondary"
      />
    </TouchableOpacity>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    fab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      width: theme.spacing(16),
      aspectRatio: 1,
      borderRadius: theme.spacing(8),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors["text-secondary"],
    },
  });
};

export default Fab;
