import { useCallback } from "react";
import { useAuthContext } from "./useAuthContext";
import { ResponseMessage } from "../types";

type ApiFunction<T extends any[]> = (
  token: string,
  ...args: T
) => Promise<Response>;

export const useAuthenticatedApi = () => {
  const { userToken, refreshToken, performTokenRefresh } = useAuthContext();

  const request = useCallback(
    async <T extends any[]>(
      apiFunc: ApiFunction<T>,
      ...args: T
    ): Promise<Response> => {
      let response = await apiFunc(userToken!, ...args);

      if (response.status === 401) {
        try {
          const data: ResponseMessage = await response.clone().json();

          if (data.code === "authentication/tokenExpired") {
            const newToken = await performTokenRefresh(refreshToken!);

            if (newToken) {
              response = await apiFunc(newToken, ...args);
            }
          }
        } catch (err) {
          console.error("Error during auth retry logic:", err);
        }
      }

      return response;
    },
    [userToken, refreshToken, performTokenRefresh],
  );

  return request;
};

export default useAuthenticatedApi;
