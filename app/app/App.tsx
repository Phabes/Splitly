import { RootNavigation } from "./navigation";
import {
  AuthProvider,
  ConfirmProvider,
  LanguageProvider,
  LoadingProvider,
  ThemeProvider,
} from "./providers";

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ConfirmProvider>
          <AuthProvider>
            <LoadingProvider>
              <RootNavigation />
            </LoadingProvider>
          </AuthProvider>
        </ConfirmProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
