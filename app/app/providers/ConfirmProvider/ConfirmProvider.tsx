import { Button, Typography } from "@/app/components";
import { ConfirmContext } from "@/app/contexts";
import { useThemeContext, useTranslations } from "@/app/hooks";
import { ConfirmConfig } from "@/app/types";
import { FC, PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

export const ConfirmProvider: FC<PropsWithChildren> = ({ children }) => {
  const translations = useTranslations();

  const [config, setConfig] = useState<ConfirmConfig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showConfirm = (newConfig: ConfirmConfig) => setConfig(newConfig);

  const hideConfirm = () => {
    setIsProcessing(false);
    setConfig(null);
  };

  const handleConfirm = async () => {
    if (!config?.onConfirm) {
      hideConfirm();
      return;
    }

    setIsProcessing(true);

    try {
      await config.onConfirm();
    } catch (error) {
      // Error during confirm action
      console.error(error);
    } finally {
      hideConfirm();
    }
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
      {!!config && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.overlay,
            isProcessing && { backgroundColor: "transparent" },
          ]}
        >
          <TouchableWithoutFeedback
            onPress={isProcessing ? undefined : handleCancel}
          >
            <View style={[styles.container]}>
              {!isProcessing && (
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
                        variant={
                          config?.isDestructive ? "destructive" : "primary"
                        }
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
    </ConfirmContext.Provider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      zIndex: 9998,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
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
