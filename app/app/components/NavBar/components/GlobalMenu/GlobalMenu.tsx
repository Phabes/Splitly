import { FC, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useThemeContext, useTranslations } from "@/app/hooks";
import { Icon } from "@/app/components/Icon";
import { Typography } from "@/app/components/Typography";
import { Button } from "@/app/components/Button";
import { Scroll } from "@/app/components/Scroll";
import {
  faCog,
  faTimes,
  faUserCircle,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { TranslationKeys } from "@/app/constants/translations";
import {
  GLOBAL_MENU_WIDTH_RATIO,
  GLOBAL_MENU_WIDTH_ANIMATION_DURATION,
} from "@/app/constants/globalMenu";

export interface MenuAction {
  labelKey: TranslationKeys;
  icon: IconDefinition;
  onPress: () => void;
}

interface GlobalMenuProps {
  isVisible: boolean;
  onClose: () => void;
  username?: string;
  email?: string;
  onSignOut: () => void;
  customActions?: MenuAction[];
}

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * GLOBAL_MENU_WIDTH_RATIO;

export const GlobalMenu: FC<GlobalMenuProps> = ({
  isVisible,
  onClose,
  username = "User",
  email = "user@example.com",
  onSignOut,
  customActions = [],
}) => {
  const translations = useTranslations();

  const [renderModal, setRenderModal] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(MENU_WIDTH)).current;

  useEffect(() => {
    if (isVisible) {
      setRenderModal(true);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: GLOBAL_MENU_WIDTH_ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: MENU_WIDTH,
        duration: GLOBAL_MENU_WIDTH_ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setRenderModal(false);
        }
      });
    }
  }, [isVisible, slideAnim]);

  const styles = useStyles();

  return (
    <Modal
      visible={renderModal}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.menuContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Icon
                icon={faTimes}
                size="large"
                color="text-secondary"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileSection}>
            <Icon
              icon={faUserCircle}
              color="text-secondary"
            />
            <Typography
              text={username}
              variant="header-medium"
            />
            <Typography
              text={email}
              variant="body-small"
              color="text-secondary"
            />
          </View>

          <View style={styles.navSection}>
            <Scroll>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => {
                  onClose();
                }}
              >
                <Icon
                  icon={faCog}
                  color="text-primary"
                />
                <Typography
                  text={"XXXXX"}
                  variant="body-large"
                />
              </TouchableOpacity>

              {customActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.navItem}
                  onPress={() => {
                    onClose();
                    action.onPress();
                  }}
                >
                  <Icon
                    icon={action.icon}
                    color="text-primary"
                  />
                  <Typography
                    text={"YYYY"}
                    variant="body-large"
                  />
                </TouchableOpacity>
              ))}
            </Scroll>
          </View>

          <View style={styles.footerSection}>
            <Button
              text={translations["signOut"]}
              onPress={onSignOut}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    overlay: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    menuContainer: {
      width: MENU_WIDTH,
      backgroundColor: theme.colors["background-secondary"],
    },
    header: {
      height: theme.spacing(15),
      paddingHorizontal: theme.spacing(7),
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: theme.colors["background-primary"],
    },
    closeButton: {
      padding: theme.spacing(1),
    },
    profileSection: {
      alignItems: "center",
      paddingHorizontal: theme.spacing(3),
      paddingVertical: theme.spacing(2),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors["background-primary"],
    },
    navSection: {
      flex: 1,
      padding: theme.spacing(3),
    },
    navItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors["background-primary"],
      borderRadius: theme.spacing(2),
      padding: theme.spacing(2),
      gap: theme.spacing(2),
    },
    footerSection: {
      padding: theme.spacing(3),
      borderTopWidth: 1,
      borderTopColor: theme.colors["background-primary"],
    },
  });
};

export default GlobalMenu;
