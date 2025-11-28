import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthNavigation } from "./navigation";
import { useTheme } from "./hooks";

const App = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors["background-app"],
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <AuthNavigation />
    </View>
  );
};

export default App;
