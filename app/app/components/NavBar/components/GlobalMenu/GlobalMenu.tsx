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
import { useAuthContext, useThemeContext, useTranslations } from "@/app/hooks";
import { Icon } from "@/app/components/Icon";
import { Typography } from "@/app/components/Typography";
import { Button } from "@/app/components/Button";
import { Scroll } from "@/app/components/Scroll";
import { TranslationKeys } from "@/app/constants/translations";
import { IconKeys } from "@/app/constants/iconKeys";
import {
  GLOBAL_MENU_WIDTH_RATIO,
  GLOBAL_MENU_WIDTH_ENTRY_ANIMATION_DURATION,
  GLOBAL_MENU_WIDTH_CLOSE_ANIMATION_DURATION,
} from "@/app/constants/globalMenu";
import { getIcon } from "@/app/utils";
import { TouchableIcon } from "@/app/components/TouchableIcon";

export interface MenuAction {
  labelKey: TranslationKeys;
  icon: IconKeys;
  onPress: () => void;
}

interface GlobalMenuProps {
  isVisible: boolean;
  onClose: () => void;
  customActions?: MenuAction[];
}

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * GLOBAL_MENU_WIDTH_RATIO;

export const GlobalMenu: FC<GlobalMenuProps> = ({
  isVisible,
  onClose,
  customActions = [],
}) => {
  const { userData, signOut } = useAuthContext();
  const translations = useTranslations();

  const [renderModal, setRenderModal] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(MENU_WIDTH)).current;

  useEffect(() => {
    if (isVisible) {
      setRenderModal(true);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: GLOBAL_MENU_WIDTH_ENTRY_ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: MENU_WIDTH,
        duration: GLOBAL_MENU_WIDTH_CLOSE_ANIMATION_DURATION,
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
            <View style={styles.profileIcon}>
              <Icon
                icon={getIcon("UserCircle")}
                color="text-secondary"
                size="large"
              />
            </View>
            <TouchableIcon
              icon={getIcon("X")}
              onPress={onClose}
              color="text-primary"
            />
          </View>

          <View style={styles.profileSection}>
            <Typography
              text={userData!.username}
              variant="header-medium"
            />
            <Typography
              text={userData!.email}
              variant="body-small"
              color="text-secondary"
            />
          </View>

          <View style={styles.navSection}>
            <Scroll gapSize="small">
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => {
                  onClose();
                }}
              >
                <Icon
                  icon={getIcon("Cog")}
                  color="text-primary"
                />
                <Typography text={translations["settings"]} />
              </TouchableOpacity>

              {customActions.map((action, i) => (
                <TouchableOpacity
                  key={`GlobalMenuCustomActions/${i}`}
                  style={styles.navItem}
                  onPress={() => {
                    onClose();
                    action.onPress();
                  }}
                >
                  <Icon
                    icon={getIcon(action.icon)}
                    color="text-primary"
                  />
                  <Typography text={translations[action.labelKey]} />
                </TouchableOpacity>
              ))}
            </Scroll>
          </View>

          <View style={styles.footerSection}>
            <Button
              text={translations["signOut"]}
              onPress={signOut}
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
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors["background-primary"],
    },
    profileIcon: {
      justifyContent: "center",
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
      height: theme.spacing(15),
      paddingHorizontal: theme.spacing(3),
      justifyContent: "center",
      borderTopWidth: 1,
      borderTopColor: theme.colors["background-primary"],
    },
  });
};

export default GlobalMenu;
