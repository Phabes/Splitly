import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type TabParamList = {
  Friends: { shouldRefresh?: boolean };
  Groups: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  AddFriend: undefined;
  FriendRequests: undefined;
};

export type AppNavigationProps = NativeStackNavigationProp<AppStackParamList>;

export default function Index() {
  return null;
}
