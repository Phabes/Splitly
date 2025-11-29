import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./AuthNavigationProps";
import { SignIn, SignUp } from "@/app/screens";
import { FC } from "react";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigation: FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
