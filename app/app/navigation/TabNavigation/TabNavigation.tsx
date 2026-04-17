import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../AppNavigation/AppNavigationProps";
import { TabBar } from "@/app/components";
import { Friends, Groups } from "@/app/screens";

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigation = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Groups"
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

export default TabNavigation;
