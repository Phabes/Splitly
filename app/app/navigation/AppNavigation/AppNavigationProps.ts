import { GroupDetailsResult, SimpleUser } from "@/app/types";
import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type TabParamList = {
  Friends: undefined;
  Groups: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  AddFriend: undefined;
  FriendRequests: undefined;
  CreateGroup: undefined;
  AddMembers: {
    groupID?: string;
    initialSelectedUsers?: SimpleUser[];
    returnEvent: string;
  };
  GroupRequests: undefined;
  GroupDetails: { groupID: string };
  EditGroup: GroupDetailsResult;
};

export type AppNavigationProps = NativeStackNavigationProp<AppStackParamList>;

export default function Index() {
  return null;
}
