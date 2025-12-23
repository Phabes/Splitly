import { RootNavigation } from "./navigation";
import { AuthProvider, LanguageProvider, ThemeProvider } from "./providers";

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <RootNavigation />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
