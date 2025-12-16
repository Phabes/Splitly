import { useAuthContext } from "@/app/hooks";
import { AuthNavigation } from "../AuthNavigation";

export const RootNavigation = () => {
  const { userToken } = useAuthContext();

  return userToken ? <></> : <AuthNavigation />;
};

export default RootNavigation;
