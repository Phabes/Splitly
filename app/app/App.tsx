import { RootNavigation } from "./navigation";
import {
  AuthProvider,
  LanguageProvider,
  LoadingProvider,
  ThemeProvider,
} from "./providers";

const App = () => {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <LanguageProvider>
          <AuthProvider>
            <RootNavigation />
          </AuthProvider>
        </LanguageProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
};

export default App;
