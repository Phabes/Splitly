import { NativeStackNavigationProp } from "expo-router";

export type AuthStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
};

export type AuthNavigationProps = NativeStackNavigationProp<AuthStackParamList>;

export default function Index() {
  return null;
}
