import { Button, Typography } from "@/app/components";
import { ConfirmContext } from "@/app/contexts";
import { useThemeContext, useTranslations } from "@/app/hooks";
import { ConfirmConfig } from "@/app/types";
import { FC, PropsWithChildren, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export const ConfirmProvider: FC<PropsWithChildren> = ({ children }) => {
  const translations = useTranslations();

  const [config, setConfig] = useState<ConfirmConfig | null>(null);

  const showConfirm = (newConfig: ConfirmConfig) => setConfig(newConfig);
  const hideConfirm = () => setConfig(null);

  const handleConfirm = async () => {
    if (config?.onConfirm) {
      await config.onConfirm();
    }
    hideConfirm();
  };

  const handleCancel = () => {
    if (config?.onCancel) {
      config.onCancel();
    }
    hideConfirm();
  };

  const styles = useStyles();

  return (
    <ConfirmContext.Provider value={{ showConfirm, hideConfirm }}>
      {children}
      <Modal
        visible={!!config}
        transparent
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={handleCancel}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.card}>
                <View style={styles.textContainer}>
                  <Typography
                    text={config?.title || ""}
                    variant="header-medium"
                  />
                  <Typography
                    text={config?.message || ""}
                    color="text-secondary"
                  />
                </View>

                <View style={styles.buttonRow}>
                  <Button
                    text={config?.cancelText || translations["cancel"]}
                    onPress={handleCancel}
                    variant="secondary"
                  />
                  <Button
                    text={config?.confirmText || translations["confirm"]}
                    onPress={handleConfirm}
                    variant={config?.isDestructive ? "destructive" : "primary"}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ConfirmContext.Provider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing(3),
    },
    card: {
      width: "90%",
      backgroundColor: theme.colors["background-app"],
      borderRadius: theme.spacing(2),
      padding: theme.spacing(3),
      gap: theme.spacing(4),
    },
    textContainer: {
      gap: theme.spacing(1),
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      flexWrap: "wrap",
      gap: theme.spacing(2),
    },
  });
};

export default ConfirmProvider;
