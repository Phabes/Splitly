import { GroupDetailsResult, SimpleUser } from "@/app/types";
import { NativeStackNavigationProp } from "expo-router";
import { NavigatorScreenParams } from "expo-router/react-navigation";

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
  CreateBill: { groupID: string };
};

export type AppNavigationProps = NativeStackNavigationProp<AppStackParamList>;

export default function Index() {
  return null;
}
