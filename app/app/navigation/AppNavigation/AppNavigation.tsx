import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList } from "./AppNavigationProps";
import { TabNavigation } from "../TabNavigation";
import { AddFriend, FriendRequests } from "@/app/screens";

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
    </Stack.Navigator>
  );
};

export default AppNavigation;
