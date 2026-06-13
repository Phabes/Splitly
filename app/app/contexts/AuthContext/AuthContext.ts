import { UserResult } from "@/app/types";
import { createContext } from "react";

type AuthContextType = {
  userToken: string | null;
  refreshToken: string | null;
  userData: UserResult | null;
  isLoading: boolean;
  signIn: (token: string, refresh: string, user: UserResult) => Promise<void>;
  signUp: (token: string, refresh: string, user: UserResult) => Promise<void>;
  signOut: () => Promise<void>;
  performTokenRefresh: (currentRefreshToken: string) => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export default AuthContext;
