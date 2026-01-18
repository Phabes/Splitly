import { useThemeContext } from "@/app/hooks";
import { FC, PropsWithChildren } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

type ScrollProps = {
  gapSize?: "small" | "large";
  keyboardPersist?: "never" | "handled";
  handleScrollEnd?: () => void;
};

export const Scroll: FC<PropsWithChildren<ScrollProps>> = ({
  children,
  gapSize = "large",
  keyboardPersist = "handled",
  handleScrollEnd = () => {},
}) => {
  const size = gapSize === "large" ? 5 : 2;

  const styles = useStyles(size);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - layoutMeasurement.height;

    if (isCloseToBottom) {
      handleScrollEnd();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      onScroll={handleScroll}
      keyboardDismissMode="on-drag"
      scrollEventThrottle={16}
      keyboardShouldPersistTaps={keyboardPersist}
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
