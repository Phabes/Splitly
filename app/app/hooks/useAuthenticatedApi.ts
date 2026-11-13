import { useCallback } from "react";
import { useAuthContext } from "./useAuthContext";
import { ResponseMessage } from "../types";
import { useAppNavigation } from "./useAppNavigation";

type ApiFunction<T extends any[]> = (
  token: string,
  ...args: T
) => Promise<Response>;

export const useAuthenticatedApi = () => {
  const { userToken, refreshToken, performTokenRefresh } = useAuthContext();
  const navigation = useAppNavigation();

  const request = useCallback(
    async <T extends any[]>(
      apiFunc: ApiFunction<T>,
      ...args: T
    ): Promise<Response> => {
      let response = await apiFunc(userToken!, ...args);

      if (response.status === 401) {
        let data: ResponseMessage | null = null;
        try {
          data = await response.clone().json();
        } catch (error) {
          console.error(error);
        }

        if (data && data.code === "authentication/tokenExpired") {
          const newToken = await performTokenRefresh(refreshToken!);
          if (newToken) {
            response = await apiFunc(newToken, ...args);
          }
        }
      }

      if (response.status === 403 || response.status === 404) {
        let data: any = null;
        try {
          data = await response.clone().json();
        } catch (error) {
          console.error(error);
        }

        if (
          data &&
          (data.code === "groupAuthentication/access-denied" ||
            data.code === "groupAuthentication/not-found")
        ) {
          navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          });
        }
      }

      return response;
    },
    [userToken, refreshToken, performTokenRefresh, navigation],
  );

  return request;
};

export default useAuthenticatedApi;
