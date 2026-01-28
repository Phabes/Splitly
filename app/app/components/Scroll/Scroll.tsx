import { useThemeContext } from "@/app/hooks";
import { FC, PropsWithChildren, useRef, useState } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  REFRESH_THRESHOLD,
  TOUCH_ADDITIONAL_REFRESH_THRESHOLD,
} from "@/app/constants/pagination";
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

  const [layoutHeight, setLayoutHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const touchStartY = useRef(0);

  const styles = useStyles(size);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    if (contentSize.height > layoutMeasurement.height) {
      const scrollBottom = layoutMeasurement.height + contentOffset.y;

      const overScroll = scrollBottom - contentSize.height + REFRESH_THRESHOLD;

      if (isAtEnd && onManualRefresh) {
        const currentPull = Math.min(overScroll, REFRESH_THRESHOLD);
        if (currentPull > 0) {
          setPullAmount(currentPull);
        }
      } else if (!isAtEnd && handleScrollEnd) {
        const isCloseToBottom =
          scrollBottom >= contentSize.height - layoutMeasurement.height;
        if (isCloseToBottom) {
          handleScrollEnd();
        }
      }
    }
  };

  const handleScrollEndDrag = () => {
    setIsTouched(false);

    if (contentHeight <= layoutHeight) {
      return;
    }

    if (isAtEnd && onManualRefresh && pullAmount >= REFRESH_THRESHOLD) {
      onManualRefresh();
    }

    setPullAmount(0);
  };

  const handleTouchStart = (e: GestureResponderEvent) => {
    setIsTouched(true);
    touchStartY.current = e.nativeEvent.pageY;
  };

  const handleTouchMove = (e: GestureResponderEvent) => {
    if (contentHeight < layoutHeight && isAtEnd && onManualRefresh) {
      const currentY = e.nativeEvent.pageY;
      const deltaY = touchStartY.current - currentY;
      const deltaYWithThreshold = deltaY - TOUCH_ADDITIONAL_REFRESH_THRESHOLD;

      if (deltaYWithThreshold > 0) {
        setPullAmount(Math.min(deltaYWithThreshold, REFRESH_THRESHOLD));
      } else {
        setPullAmount(0);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsTouched(false);

    if (contentHeight >= layoutHeight) {
      return;
    }

    if (isAtEnd && onManualRefresh && pullAmount >= REFRESH_THRESHOLD) {
      onManualRefresh();
    }

    setPullAmount(0);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    setLayoutHeight(e.nativeEvent.layout.height);
  };

  const onContentSizeChange = (w: number, h: number) => {
    setContentHeight(h);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      onScroll={handleScroll}
      onScrollBeginDrag={() => setIsTouched(true)}
      onScrollEndDrag={handleScrollEndDrag}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onLayout={onLayout}
      onContentSizeChange={onContentSizeChange}
      keyboardDismissMode="on-drag"
      scrollEventThrottle={16}
      keyboardShouldPersistTaps={keyboardPersist}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={true}
    >
      <View style={styles.content}>{children}</View>

      {isTouched && isAtEnd && pullAmount > 0 && onManualRefresh && (
        <View style={styles.pullUpContainer}>
          <View
            style={{
              transform: [
                {
                  rotateZ: `${(Math.round(pullAmount) / REFRESH_THRESHOLD) * 360}deg`,
                },
                {
                  scale: 0.5 + (pullAmount / REFRESH_THRESHOLD) * 0.5,
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
      // flexGrow: 1,
    },
    content: {
      flex: 1,
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
