import { RootNavigation } from "./navigation";
import {
  AuthProvider,
  ConfirmProvider,
  FloatingMenuProvider,
  LanguageProvider,
  LoadingProvider,
  ThemeProvider,
} from "./providers";

const App = () => {
  return (
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
  );
};

export default App;
