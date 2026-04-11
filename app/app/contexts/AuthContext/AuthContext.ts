import { createContext } from "react";

type AuthContextType = {
  userToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  signIn: (token: string, refresh: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (token: string, refresh: string) => Promise<void>;
  performTokenRefresh: (currentRefreshToken: string) => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export default AuthContext;
