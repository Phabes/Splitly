import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigation } from "./app/navigation";
import {
  AuthProvider,
  ConfirmProvider,
  FloatingMenuProvider,
  LanguageProvider,
  LoadingProvider,
  ThemeProvider,
} from "./app/providers";

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <FloatingMenuProvider>
              <ConfirmProvider>
                <LoadingProvider>
                  <RootNavigation />
                </LoadingProvider>
              </ConfirmProvider>
            </FloatingMenuProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
