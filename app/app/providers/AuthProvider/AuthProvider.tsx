import { LoadingWrapper } from "@/app/components";
import { AuthContext } from "@/app/contexts";
import { useTranslations } from "@/app/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";

type AuthProviderProps = PropsWithChildren;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const translations = useTranslations();

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        token = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.error("Failed to restore token from storage:", e);
      } finally {
        setUserToken(token);
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      userToken,
      isLoading,
      signIn: async (token: string) => {
        await AsyncStorage.setItem("userToken", token);
        setUserToken(token);
      },
      signOut: async () => {
        await AsyncStorage.removeItem("userToken");
        setUserToken(null);
      },
      signUp: async (token: string) => {
        await AsyncStorage.setItem("userToken", token);
        setUserToken(token);
      },
    }),
    [userToken, isLoading]
  );

  return (
    <LoadingWrapper
      isLoading={isLoading}
      text={translations["loading"]}
    >
      <AuthContext.Provider value={authContext}>
        {children}
      </AuthContext.Provider>
    </LoadingWrapper>
  );
};

export default AuthProvider;
