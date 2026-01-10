import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppStackParamList } from "../AppNavigation/AppNavigationProps";
import { TabBar } from "@/app/components";
import { Friends, Groups } from "@/app/screens";

const Tab = createBottomTabNavigator<AppStackParamList>();

export const TabNavigation = () => {
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

export default TabNavigation;
