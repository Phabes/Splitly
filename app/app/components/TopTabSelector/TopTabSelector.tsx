import { useThemeContext } from "@/app/hooks";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FC, ReactNode } from "react";
import { TopTabBar } from "./components/TopTabBar";
import { StyleSheet } from "react-native";

const Tab = createMaterialTopTabNavigator();

export const TopTabScreen = Tab.Screen;

interface TopTabSelectorProps {
  children: ReactNode;
}

export const TopTabSelector: FC<TopTabSelectorProps> = ({ children }) => {
  const styles = useStyles();

  return (
    <Tab.Navigator
      tabBar={(props) => <TopTabBar {...props} />}
      style={styles.tabs}
      screenOptions={{
        sceneStyle: styles.tabContent,
        // swipeEnabled: false,
      }}
    >
      {children}
    </Tab.Navigator>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    tabs: { backgroundColor: "transparent" },
    tabContent: {
      backgroundColor: "transparent",
      marginTop: theme.spacing(1),
    },
  });
};

export default { TopTabSelector, TopTabScreen };
