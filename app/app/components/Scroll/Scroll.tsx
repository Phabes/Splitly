import { useThemeContext } from "@/app/hooks";
import { FC, PropsWithChildren, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { REFRESH_THRESHOLD } from "@/app/constants/pagination";
import { Icon } from "../Icon";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

type ScrollProps = {
  gapSize?: "small" | "large";
  keyboardPersist?: "never" | "handled";
  handleScrollEnd?: () => void;
  onManualRefresh?: () => void;
  isAtEnd?: boolean;
};

export const Scroll: FC<PropsWithChildren<ScrollProps>> = ({
  children,
  gapSize = "large",
  keyboardPersist = "handled",
  handleScrollEnd,
  onManualRefresh,
  isAtEnd = false,
}) => {
  const size = gapSize === "large" ? 5 : 2;

  const [pullAmount, setPullAmount] = useState(0);
  const [isTouched, setIsTouched] = useState(false);

  const styles = useStyles(size);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const scrollBottom = layoutMeasurement.height + contentOffset.y;

    const overScroll = scrollBottom - contentSize.height + REFRESH_THRESHOLD;

    if (isAtEnd && onManualRefresh) {
      setPullAmount(Math.min(overScroll, REFRESH_THRESHOLD));
    } else if (!isAtEnd && handleScrollEnd) {
      const isCloseToBottom =
        scrollBottom >= contentSize.height - layoutMeasurement.height;
      if (isCloseToBottom) {
        handleScrollEnd();
      }
    }
  };

  const handleScrollEndDrag = () => {
    if (isAtEnd && onManualRefresh && pullAmount >= REFRESH_THRESHOLD) {
      onManualRefresh();
    }

    setIsTouched(false);
  };

  const handleTouchStart = () => {
    setIsTouched(true);
  };

  const handleTouchEnd = () => {
    setIsTouched(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      onScroll={handleScroll}
      onScrollBeginDrag={handleTouchStart}
      onScrollEndDrag={handleScrollEndDrag}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      keyboardDismissMode="on-drag"
      scrollEventThrottle={16}
      keyboardShouldPersistTaps={keyboardPersist}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={true}
    >
      <View style={styles.content}>{children}</View>

      {isTouched && onManualRefresh && (
        <View style={styles.pullUpContainer}>
          <View
            style={{
              transform: [
                {
                  rotateZ: `${(Math.round(pullAmount) / REFRESH_THRESHOLD) * 360}deg`,
                },
              ],
            }}
          >
            <Icon
              icon={faRotateRight}
              size="large"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const useStyles = (gapSize: number) => {
  const theme = useThemeContext();
  return StyleSheet.create({
    scrollView: {
      flexGrow: 1,
    },
    content: {
      // flex: 1,
      gap: theme.spacing(gapSize),
    },
    pullUpContainer: {
      height: REFRESH_THRESHOLD,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};

export default Scroll;
