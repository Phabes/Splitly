import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type AppStackParamList = {
  MainTabs: undefined;
  Friends: { shouldRefresh: boolean };
  Groups: undefined;
  AddFriend: undefined;
  FriendRequests: undefined;
};

export type AppNavigationProps = NativeStackNavigationProp<AppStackParamList>;

export default function Index() {
  return null;
}
