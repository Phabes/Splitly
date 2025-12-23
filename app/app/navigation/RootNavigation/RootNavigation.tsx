import { useAuthContext } from "@/app/hooks";
import { AuthNavigation } from "../AuthNavigation";
import { AppNavigation } from "../AppNavigation";

export const RootNavigation = () => {
  const { userToken } = useAuthContext();

  return userToken ? <AppNavigation /> : <AuthNavigation />;
};

export default RootNavigation;
