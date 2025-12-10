import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./AuthNavigationProps";
import { SignIn, SignUp } from "@/app/screens";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SignUp"
    >
      <Stack.Screen
        name={"SignIn"}
        component={SignIn}
      />
      <Stack.Screen
        name={"SignUp"}
        component={SignUp}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
