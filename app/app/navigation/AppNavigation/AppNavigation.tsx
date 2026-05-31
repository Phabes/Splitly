import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList } from "./AppNavigationProps";
import { TabNavigation } from "../TabNavigation";
import {
  AddFriend,
  AddMembers,
  CreateGroup,
  FriendRequests,
} from "@/app/screens";
import { GroupRequests } from "@/app/screens/GroupRequests";

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MainTabs"
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigation}
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
    </Stack.Navigator>
  );
};

export default AppNavigation;
