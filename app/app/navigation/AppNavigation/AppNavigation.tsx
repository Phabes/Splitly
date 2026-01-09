import { Friends, Groups } from "@/app/screens";
import { AppStackParamList } from "./AppNavigationProps";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabBar } from "@/app/components";

const Tab = createBottomTabNavigator<AppStackParamList>();

export const AppNavigation = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Friends"
    >
      <Tab.Screen
        name="Friends"
        component={Friends}
      />
      <Tab.Screen
        name="Groups"
        component={Groups}
      />
    </Tab.Navigator>
  );
};

export default AppNavigation;
