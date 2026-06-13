import { LoadingWrapper } from "@/app/components";
import { AuthContext } from "@/app/contexts";
import { useTranslations } from "@/app/hooks";
import { refreshCall, verifyCall } from "@/app/services";
import {
  RefreshUserResponse,
  ResponseMessage,
  UserResult,
  VerifyUserResponse,
} from "@/app/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";

type AuthProviderProps = PropsWithChildren;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const translations = useTranslations();

  const [userToken, setUserToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = async () => {
    await AsyncStorage.multiRemove(["userToken", "refreshToken"]);
    setUserToken(null);
    setRefreshToken(null);
    setUserData(null);
  };

  const performTokenRefresh = async (currentRefreshToken: string) => {
    try {
      const response = await refreshCall(currentRefreshToken);

      if (!response.ok) {
        const data: ResponseMessage = await response.json();
        throw new Error(data.message);
      }

      const data: RefreshUserResponse = await response.json();

      await AsyncStorage.setItem("userToken", data.userToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
      setUserToken(data.userToken);
      setRefreshToken(data.refreshToken);
      setUserData(data.user);

      return data.userToken;
    } catch (error) {
      // Refresh token error
      console.error(error);
      await clearSession();
      return null;
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
            const data: VerifyUserResponse = await response.json();

            setUserToken(userToken);
            setRefreshToken(refreshToken);
            setUserData(data.user);
          } else if (response.status === 401) {
            await performTokenRefresh(refreshToken);
          } else {
            const data: ResponseMessage = await response.json();
            throw new Error(data.message);
          }
        }
      } catch (error) {
        // Auth bootstrap failed
        console.error(error);
        await clearSession();
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
      userData,
      isLoading,
      signIn: async (token: string, refresh: string, user: UserResult) => {
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("refreshToken", refresh);
        setUserToken(token);
        setRefreshToken(refresh);
        setUserData(user);
      },
      signOut: async () => {
        await clearSession();
      },
      signUp: async (token: string, refresh: string, user: UserResult) => {
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("refreshToken", refresh);
        setUserToken(token);
        setRefreshToken(refresh);
        setUserData(user);
      },
      performTokenRefresh,
    }),
    [userToken, isLoading],
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
