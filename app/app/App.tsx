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
      <LanguageProvider>
        <AuthProvider>
          <LoadingProvider>
            <RootNavigation />
          </LoadingProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
