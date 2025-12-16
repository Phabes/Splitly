import { createContext } from "react";

type AuthContextType = {
  userToken: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (token: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export default AuthContext;
