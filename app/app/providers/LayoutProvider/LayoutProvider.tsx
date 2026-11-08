import { useThemeContext } from "@/app/hooks";
import { FC, JSX, PropsWithChildren } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { BackgroundProvider } from "../BackgroundProvider";

type LayoutProviderProps = PropsWithChildren<{
  navbar?: JSX.Element;
}>;

export const LayoutProvider: FC<LayoutProviderProps> = ({
  navbar,
  children,
}) => {
  const styles = useStyles();

  return (
    <BackgroundProvider>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View style={styles.container}>
          {navbar}

          <View style={styles.content}>{children}</View>
        </View>
      </TouchableWithoutFeedback>
    </BackgroundProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      gap: theme.spacing(5),
      paddingHorizontal: theme.spacing(5),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(5),
    },
  });
};

export default LayoutProvider;
