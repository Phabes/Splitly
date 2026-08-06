import { useThemeContext } from "@/app/hooks";
import { MenuOption } from "@/app/types";
import { FC, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TouchableIcon } from "../TouchableIcon";
import { Typography } from "../Typography";

interface FloatingMenuProps {
  options: MenuOption[];
}

export const FloatingMenu: FC<FloatingMenuProps> = ({ options }) => {
  const [isVisible, setIsVisible] = useState(false);

  const [position, setPosition] = useState({ top: 0, right: 0 });

  const triggerRef = useRef<View>(null);
  const styles = useStyles();

  const handleOpen = () => {
    triggerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      const screenWidth = Dimensions.get("window").width;

      setPosition({
        top: pageY,
        right: screenWidth - pageX - width,
      });

      setIsVisible(true);
    });
  };

  const handleClose = () => setIsVisible(false);

  return (
    <>
      <View ref={triggerRef}>
        <TouchableIcon
          icon="EllipsisVertical"
          color="text-secondary"
          onPress={handleOpen}
        />
      </View>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay}>
            <View
              style={[
                styles.menuContainer,
                { top: position.top, right: position.right },
              ]}
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={`MenuOption/${index}`}
                  style={[
                    styles.optionButton,
                    index < options.length - 1 && styles.borderBottom,
                  ]}
                  onPress={() => {
                    handleClose();
                    option.onPress();
                  }}
                >
                  <Typography text={option.label} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
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

export default FloatingMenu;
