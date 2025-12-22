import { LoadingWrapper } from "@/app/components";
import { AuthContext } from "@/app/contexts";
import { useTranslations } from "@/app/hooks";
import { refreshCall, verifyCall } from "@/app/services";
import { ResponseMessage } from "@/app/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";

type AuthProviderProps = PropsWithChildren;

type RefreshResponse = ResponseMessage & {
  userToken: string;
  refreshToken: string;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const translations = useTranslations();

  const [userToken, setUserToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = async () => {
    await AsyncStorage.multiRemove(["userToken", "refreshToken"]);
    setUserToken(null);
    setRefreshToken(null);
  };

  const performTokenRefresh = async (refreshToken: string) => {
    try {
      const response = await refreshCall(refreshToken);

      if (!response.ok) {
        throw new Error("Refresh failed");
      }

      const data: RefreshResponse = await response.json();

      await AsyncStorage.setItem("userToken", data.userToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
      setUserToken(data.userToken);
      setRefreshToken(data.refreshToken);
    } catch (error) {
      await clearSession();
    }
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // await clearSession();
        const [userToken, refreshToken] = await Promise.all([
          AsyncStorage.getItem("userToken"),
          AsyncStorage.getItem("refreshToken"),
        ]);
        if (userToken && refreshToken) {
          const response = await verifyCall(userToken);

          if (response.ok) {
            setUserToken(userToken);
            setRefreshToken(refreshToken);
          } else if (response.status === 401) {
            await performTokenRefresh(refreshToken);
          } else {
            await clearSession();
          }
        }
      } catch (error) {
        console.error("Auth bootstrap failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      userToken,
      refreshToken,
      isLoading,
      signIn: async (token: string, refresh: string) => {
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("refreshToken", refresh);
        setUserToken(token);
        setRefreshToken(refresh);
      },
      signOut: async () => {
        await clearSession();
      },
      signUp: async (token: string, refresh: string) => {
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("refreshToken", refresh);
        setUserToken(token);
        setRefreshToken(refresh);
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
