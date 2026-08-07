import { Typography } from "@/app/components";
import { FloatingMenuContext } from "@/app/contexts";
import { useThemeContext } from "@/app/hooks";
import { FloatingMenuConfig } from "@/app/types/floatingMenuConfig";
import { FC, PropsWithChildren, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const FloatingMenuProvider: FC<PropsWithChildren> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const [config, setConfig] = useState<FloatingMenuConfig | null>(null);

  // State to hold the exact measured height of the menu
  const [menuHeight, setMenuHeight] = useState<number>(0);

  const showMenu = (newConfig: FloatingMenuConfig) => {
    setMenuHeight(0); // Reset height for the new menu
    setConfig(newConfig);
  };

  const hideMenu = () => {
    setConfig(null);
    setMenuHeight(0);
  };

  // --- Smart Positioning Logic ---
  let finalTop: number | undefined;
  let finalBottom: number | undefined;
  let finalRight: number | undefined;

  if (config && menuHeight > 0) {
    const { height: screenHeight, width: screenWidth } =
      Dimensions.get("window");
    const { pageX, pageY, width, height } = config.trigger;

    const spaceBelow = screenHeight - pageY - height;
    finalRight = screenWidth - pageX - width;

    // Compare exact measured height against available space
    if (spaceBelow < menuHeight + insets.bottom) {
      // Draw UP
      finalBottom = screenHeight - pageY;
    } else {
      // Draw DOWN
      finalTop = pageY + height;
    }
  }

  const styles = useStyles();

  return (
    <FloatingMenuContext.Provider value={{ showMenu, hideMenu }}>
      {children}
      {!!config && (
        <View style={[StyleSheet.absoluteFill, styles.overlay]}>
          <TouchableWithoutFeedback onPress={hideMenu}>
            <View style={styles.container}>
              <TouchableWithoutFeedback>
                <View
                  onLayout={(e) => setMenuHeight(e.nativeEvent.layout.height)}
                  style={[
                    styles.menuContainer,
                    // 2. Keep invisible until height is measured, then apply position!
                    menuHeight === 0
                      ? { opacity: 0 }
                      : {
                          opacity: 1,
                          right: finalRight,
                          ...(finalTop !== undefined ? { top: finalTop } : {}),
                          ...(finalBottom !== undefined
                            ? { bottom: finalBottom }
                            : {}),
                        },
                  ]}
                >
                  {config.options.map((option, index) => (
                    <TouchableOpacity
                      key={`FloatingMenuOption/${index}`}
                      style={[
                        styles.optionButton,
                        index < config.options.length - 1 &&
                          styles.borderBottom,
                      ]}
                      onPress={() => {
                        hideMenu();
                        option.onPress();
                      }}
                    >
                      <Typography text={option.label} />
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
    </FloatingMenuContext.Provider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: 9997,
    },
    container: {
      flex: 1,
    },
    menuContainer: {
      minWidth: 150,
      position: "absolute",
      backgroundColor: theme.colors["background-primary"],
      borderRadius: theme.spacing(2),
    },
    optionButton: {
      paddingVertical: theme.spacing(2),
      paddingHorizontal: theme.spacing(3),
      justifyContent: "center",
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors["background-secondary"],
    },
  });
};

export default FloatingMenuProvider;
