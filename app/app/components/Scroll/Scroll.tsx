import { useThemeContext } from "@/app/hooks";
import { FC, PropsWithChildren, useRef, useState } from "react";
import {
  GestureResponderEvent,
  Keyboard,
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
  centerContent?: boolean;
  hasMore?: boolean;
  handleScrollEnd?: () => void;
  onManualRefresh?: () => void;
};

export const Scroll: FC<PropsWithChildren<ScrollProps>> = ({
  children,
  gapSize = "large",
  keyboardPersist = "handled",
  centerContent = false,
  hasMore = false,
  handleScrollEnd,
  onManualRefresh,
}) => {
  const size = gapSize === "large" ? 5 : 2;

  const [pullAmount, setPullAmount] = useState(0);
  const [isTouched, setIsTouched] = useState(false);

  const [layoutHeight, setLayoutHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const touchStartY = useRef(0);

  const styles = useStyles(size, pullAmount);

  const handleScrollBeginDrag = () => {
    setIsTouched(true);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const scrollBottom = layoutMeasurement.height + contentOffset.y;

    const actualContentHeight = contentSize.height;
    const overScroll = scrollBottom - actualContentHeight + REFRESH_THRESHOLD;

    if (!hasMore && onManualRefresh) {
      if (overScroll > 0) {
        setPullAmount(Math.min(overScroll, REFRESH_THRESHOLD));
      } else {
        setPullAmount(0);
      }
    } else if (hasMore && handleScrollEnd) {
      const isCloseToBottom =
        scrollBottom >= actualContentHeight - layoutMeasurement.height;
      if (isCloseToBottom) {
        handleScrollEnd();
      }
    }
  };

  const touchEnd = () => {
    setIsTouched(false);

    if (
      onManualRefresh &&
      pullAmount >= REFRESH_THRESHOLD - TOUCH_ADDITIONAL_REFRESH_THRESHOLD
    ) {
      onManualRefresh();
    }

    setPullAmount(0);
  };

  const handleScrollEndDrag = () => {
    touchEnd();
  };

  const handleTouchStart = (e: GestureResponderEvent) => {
    Keyboard.dismiss();
    setIsTouched(true);
    touchStartY.current = e.nativeEvent.pageY;
  };

  const handleTouchMove = (e: GestureResponderEvent) => {
    if (onManualRefresh) {
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
    touchEnd();
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    setLayoutHeight(height);
  };

  const onContentSizeChange = (w: number, h: number) => {
    setContentHeight(h);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollView,
          centerContent && { justifyContent: "center" },
        ]}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
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
        <View
          style={styles.content}
          onStartShouldSetResponder={() => true}
        >
          {children}
        </View>
        {isTouched && onManualRefresh && contentHeight > layoutHeight && (
          <View style={{ height: REFRESH_THRESHOLD }}></View>
        )}
        {isTouched && onManualRefresh && (
          <View style={styles.pullUpContainer}>
            <View
              style={{
                transform: [
                  {
                    rotateZ: `${(pullAmount / REFRESH_THRESHOLD) * 360}deg`,
                  },
                  {
                    scale: 0.5 + (pullAmount / REFRESH_THRESHOLD) * 0.5,
                  },
                ],
                opacity: 0.5 + (pullAmount / REFRESH_THRESHOLD) * 0.5,
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
    </View>
  );
};

const useStyles = (gapSize: number, pullAmount: number) => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
    },
    content: {
      gap: theme.spacing(gapSize),
    },
    pullUpContainer: {
      height: REFRESH_THRESHOLD,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      width: "100%",
      bottom: -REFRESH_THRESHOLD,
      transform: [{ translateY: -pullAmount }],
    },
  });
};

export default Scroll;
