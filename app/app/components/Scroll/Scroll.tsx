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

  const isShortList = contentHeight <= layoutHeight;
  const moveY = isShortList ? -pullAmount : 0;

  const styles = useStyles(size, moveY);

  const handleScrollBeginDrag = () => {
    setIsTouched(true);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const scrollBottom = layoutMeasurement.height + contentOffset.y;

    const actualContentHeight =
      contentSize.height - (isAtEnd && onManualRefresh ? REFRESH_THRESHOLD : 0);
    const overScroll = scrollBottom - actualContentHeight;

    if (isAtEnd && onManualRefresh) {
      if (overScroll > 0) {
        setPullAmount(Math.min(overScroll, REFRESH_THRESHOLD));
      } else {
        setPullAmount(0);
      }
    } else if (!isAtEnd && handleScrollEnd) {
      const isCloseToBottom =
        scrollBottom >= actualContentHeight - layoutMeasurement.height;
      if (isCloseToBottom) {
        handleScrollEnd();
      }
    }
  };

  const handleScrollEndDrag = () => {
    if (
      isAtEnd &&
      onManualRefresh &&
      pullAmount >= REFRESH_THRESHOLD - TOUCH_ADDITIONAL_REFRESH_THRESHOLD
    ) {
      onManualRefresh();
    }
    setIsTouched(false);
    setPullAmount(0);
  };

  const handleTouchStart = (e: GestureResponderEvent) => {
    Keyboard.dismiss();
    setIsTouched(true);
    touchStartY.current = e.nativeEvent.pageY;
  };

  const handleTouchMove = (e: GestureResponderEvent) => {
    if (isAtEnd && onManualRefresh) {
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

    if (isAtEnd && onManualRefresh) {
      if (
        pullAmount >=
        REFRESH_THRESHOLD - TOUCH_ADDITIONAL_REFRESH_THRESHOLD
      ) {
        onManualRefresh();
      }
      setPullAmount(0);
    }
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const height = Math.floor(e.nativeEvent.layout.height);
    setLayoutHeight(height);
  };

  const onContentSizeChange = (w: number, h: number) => {
    const loaderHeight = pullAmount > 0 ? REFRESH_THRESHOLD : 0;
    const height = Math.floor(h - loaderHeight);
    setContentHeight(height);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
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
      <View style={styles.container}>
        <View style={styles.content}>{children}</View>

        {isTouched &&
          isAtEnd &&
          onManualRefresh &&
          (!isShortList || (isShortList && pullAmount > 0)) && (
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
      </View>
    </ScrollView>
  );
};

const useStyles = (gapSize: number, moveY: number) => {
  const theme = useThemeContext();

  return StyleSheet.create({
    scrollView: {
      // flexGrow: 1,
    },
    container: {
      flex: 1,
      transform: [{ translateY: moveY }],
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
