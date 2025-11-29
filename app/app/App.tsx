import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthNavigation } from "./navigation";
import { useAuth, useTheme } from "./hooks";
import { LoadingWrapper } from "./components";

const App = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { isLoading, userToken } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors["background-app"],
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <LoadingWrapper
        isLoading={isLoading}
        text="Loading"
      >
        {userToken ? <></> : <AuthNavigation />}
      </LoadingWrapper>
    </View>
  );
};

export default App;
