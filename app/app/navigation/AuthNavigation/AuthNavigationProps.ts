import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type AuthStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
};

export type AuthNavigationProps = NativeStackNavigationProp<AuthStackParamList>;

export default function Index() {
  return null;
}
