import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuth = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        token = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.error("Failed to restore token from storage:", e);
      } finally {
        // setTimeout(() => {
        setUserToken(token);
        setIsLoading(false);
        // }, 2000);
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

  return authContext;
};

export default useAuth;
