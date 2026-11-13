import { useAuthContext } from "@/app/hooks";
import { AuthNavigation } from "../AuthNavigation";
import { AppNavigation } from "../AppNavigation";
import { NavigationContainer } from "@react-navigation/native";

export const RootNavigation = () => {
  const { userToken } = useAuthContext();

  return (
    <NavigationContainer>
      {userToken ? <AppNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
};

export default RootNavigation;
