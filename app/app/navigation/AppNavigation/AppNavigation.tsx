import {
  AddFriend,
  AddMembers,
  CreateGroup,
  EditGroup,
  FriendRequests,
  GroupDetails,
  GroupRequests,
} from "@/app/screens";
import { createNativeStackNavigator } from "expo-router/native-stack";
import { AppStackParamList } from "./AppNavigationProps";
import { MainTabNavigation } from "../MainTabNavigation";
import { CreateBillNavigation } from "../CreateBillNavigation";

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MainTabs"
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigation}
      />
      <Stack.Screen
        name="AddFriend"
        component={AddFriend}
      />
      <Stack.Screen
        name="FriendRequests"
        component={FriendRequests}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroup}
      />
      <Stack.Screen
        name="AddMembers"
        component={AddMembers}
      />
      <Stack.Screen
        name="GroupRequests"
        component={GroupRequests}
      />
      <Stack.Screen
        name="GroupDetails"
        component={GroupDetails}
      />
      <Stack.Screen
        name="EditGroup"
        component={EditGroup}
      />
      <Stack.Screen
        name="CreateBill"
        component={CreateBillNavigation}
      />
    </Stack.Navigator>
  );
};

export default AppNavigation;
