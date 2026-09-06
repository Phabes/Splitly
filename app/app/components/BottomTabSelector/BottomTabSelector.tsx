import { FC, ReactNode } from "react";
import { BottomTabBar } from "./components/BottomTabBar";
import { createBottomTabNavigator } from "expo-router/js-tabs";

const Tab = createBottomTabNavigator();

export const BottomTabScreen = Tab.Screen;

interface BottomTabSelectorProps {
  children: ReactNode;
}

export const BottomTabSelector: FC<BottomTabSelectorProps> = ({ children }) => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Groups"
    >
      {children}
    </Tab.Navigator>
  );
};

export default { BottomTabSelector, BottomTabScreen };
