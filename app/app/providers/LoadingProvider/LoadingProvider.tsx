import { Loading } from "@/app/components";
import { LoadingContext } from "@/app/contexts";
import { useTranslations } from "@/app/hooks";
import { FC, PropsWithChildren, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";

type LoadingProviderProps = PropsWithChildren;

export const LoadingProvider: FC<LoadingProviderProps> = ({ children }) => {
  const translations = useTranslations();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(translations["loading"]);

  const styles = useStyles();

  const showLoading = (msg: string = translations["loading"]) => {
    Keyboard.dismiss();
    setMessage(msg);
    setVisible(true);
  };

  const hideLoading = () => setVisible(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {visible && (
        <View style={[StyleSheet.absoluteFill, styles.overlay]}>
          <Loading
            text={message}
            color="text-success"
          />
        </View>
      )}
    </LoadingContext.Provider>
  );
};

const useStyles = () => {
  return StyleSheet.create({
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      zIndex: 9999,
    },
  });
};

export default LoadingProvider;
