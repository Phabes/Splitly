import { RINGING_BELL_DELAY } from "@/app/constants/ringingBell";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const useRingingBell = () => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shakeSequence = Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.delay(RINGING_BELL_DELAY),
    ]);

    Animated.loop(shakeSequence).start();
  }, [shakeAnim]);

  const spin = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  return { spin };
};

export default useRingingBell;
