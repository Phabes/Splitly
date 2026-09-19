import { FC, PropsWithChildren } from "react";
import { BottomTabBar } from "./components/BottomTabBar";
import { createBottomTabNavigator } from "expo-router/js-tabs";

const Tab = createBottomTabNavigator();

export const BottomTabScreen = Tab.Screen;

type BottomTabSelectorProps = PropsWithChildren<{
  initialRouteName: string;
  showTitle?: boolean;
}>;

export const BottomTabSelector: FC<BottomTabSelectorProps> = ({
  children,
  initialRouteName,
  showTitle = false,
}) => {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <BottomTabBar
          {...props}
          showTitle={showTitle}
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRouteName}
    >
      {children}
    </Tab.Navigator>
  );
};

export default { BottomTabSelector, BottomTabScreen };
