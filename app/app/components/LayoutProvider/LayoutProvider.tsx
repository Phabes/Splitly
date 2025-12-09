import { useTheme } from "@/app/hooks";
import { FC, JSX, PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type LayoutProviderProps = PropsWithChildren<{
  navbar?: JSX.Element;
}>;

export const LayoutProvider: FC<LayoutProviderProps> = ({
  navbar,
  children,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {navbar}
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </View>
  );
};

const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors["background-app"],
    },
    scrollView: { flexGrow: 1 },
    content: {
      flex: 1,
      gap: theme.spacing(5),
      paddingHorizontal: theme.spacing(5),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(5),
    },
  });
};

export default LayoutProvider;
