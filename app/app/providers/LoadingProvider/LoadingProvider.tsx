import { Loading } from "@/app/components";
import { LoadingContext } from "@/app/contexts";
import { FC, PropsWithChildren, useState } from "react";
import { StyleSheet, View } from "react-native";
import { LayoutProvider } from "../LayoutProvider";

type LoadingProviderProps = PropsWithChildren;

export const LoadingProvider: FC<LoadingProviderProps> = ({ children }) => {
  const styles = useStyles();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Loading...");

  const showLoading = (msg: string = "Please wait...") => {
    setMessage(msg);
    setVisible(true);
  };

  const hideLoading = () => setVisible(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {visible && (
        <View style={[StyleSheet.absoluteFill, styles.overlay]}>
          {/* <View style={styles.loadingBox}> */}
          <LayoutProvider x={0}>
            <Loading
              text={message}
              color="text-success"
            />
          </LayoutProvider>
          {/* </View> */}
        </View>
      )}
    </LoadingContext.Provider>
  );
};

const useStyles = () => {
  return StyleSheet.create({
    overlay: {
      backgroundColor: "rgba(0,0,0,0.7)",
      // backgroundColor: "red",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999, // Blocks interaction with everything underneath
    },
    loadingBox: {
      backgroundColor: "white",
      padding: 32,
      borderRadius: 24,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
  });
};

export default LoadingProvider;
