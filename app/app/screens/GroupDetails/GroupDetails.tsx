import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";
import { GroupProvider } from "@/app/providers";
import { RouteProp, useRoute } from "expo-router/react-navigation";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { BottomTabScreen, BottomTabSelector } from "@/app/components";
import { Information } from "./tabs";

export const GroupDetails: FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, "GroupDetails">>();
  const { groupID } = route.params;

  const styles = useStyles();

  return (
    <GroupProvider groupID={groupID}>
      <View style={styles.container}>
        <BottomTabSelector initialRouteName="Information">
          <BottomTabScreen
            name="Expenses"
            component={View}
            options={{ tabBarAccessibilityLabel: "Expences" }}
          />
          <BottomTabScreen
            name="Balances"
            component={View}
            options={{ tabBarAccessibilityLabel: "Balances" }}
          />
          <BottomTabScreen
            name="Plus"
            component={View}
            options={{
              tabBarAccessibilityLabel: "Plus",
            }}
          />
          <BottomTabScreen
            name="Statistics"
            component={View}
            options={{ tabBarAccessibilityLabel: "Statistics" }}
          />
          <BottomTabScreen
            name="Information"
            component={Information}
            options={{ tabBarAccessibilityLabel: "Cog" }}
          />
        </BottomTabSelector>
      </View>
    </GroupProvider>
  );
};

const useStyles = () => {
  return StyleSheet.create({
    container: { flex: 1 },
  });
};

export default GroupDetails;
