import { useThemeContext } from "@/app/hooks";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FC, ReactNode } from "react";
import { TopTabBar } from "./components/TopTabBar";

const Tab = createMaterialTopTabNavigator();

export const TopTabScreen = Tab.Screen;

interface TopTabSelectorProps {
  children: ReactNode;
}

export const TopTabSelector: FC<TopTabSelectorProps> = ({ children }) => {
  const theme = useThemeContext();

  return (
    <Tab.Navigator
      tabBar={(props) => <TopTabBar {...props} />}
      style={{ backgroundColor: "transparent" }}
      screenOptions={{
        sceneStyle: {
          backgroundColor: "transparent",
          marginTop: theme.spacing(1),
        },
      }}
    >
      {children}
    </Tab.Navigator>
  );
};

export default { TopTabSelector, TopTabScreen };
