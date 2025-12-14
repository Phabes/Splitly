import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthNavigation } from "./navigation";
import { useAuth, useTheme } from "./hooks";
import { LoadingWrapper } from "./components";
import { LanguageProvider } from "./providers";

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
      <LanguageProvider>
        <LoadingWrapper isLoading={isLoading}>
          {userToken ? <></> : <AuthNavigation />}
        </LoadingWrapper>
      </LanguageProvider>
    </View>
  );
};

export default App;
