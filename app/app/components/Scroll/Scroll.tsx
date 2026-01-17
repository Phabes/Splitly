import { useThemeContext } from "@/app/hooks";
import { FC, PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type ScrollInputs = {
  gapSize?: "small" | "large";
};

export const Scroll: FC<PropsWithChildren<ScrollInputs>> = ({
  children,
  gapSize = "large",
}) => {
  const size = gapSize === "large" ? 5 : 2;
  const styles = useStyles(size);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
};

const useStyles = (gapSize: number) => {
  const theme = useThemeContext();

  return StyleSheet.create({
    scrollView: { flexGrow: 1 },
    content: {
      flex: 1,
      gap: theme.spacing(gapSize),
    },
  });
};

export default Scroll;
