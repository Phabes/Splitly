import { useThemeContext } from "@/app/hooks";
import { FC, JSX, PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type LayoutProviderProps = PropsWithChildren<{
  navbar?: JSX.Element;
  x?: number;
}>;

export const LayoutProvider: FC<LayoutProviderProps> = ({
  navbar,
  x = 1,
  children,
}) => {
  const styles = useStyles(x);

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

const useStyles = (x: number) => {
  const theme = useThemeContext();
  const color =
    x == 1 ? { backgroundColor: theme.colors["background-app"] } : {};

  return StyleSheet.create({
    container: {
      flex: 1,
      ...color,
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
