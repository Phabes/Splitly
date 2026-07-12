import { BottomTabScreen, BottomTabSelector } from "@/app/components";
import { Friends, Groups } from "@/app/screens";

export const TabNavigation = () => {
  return (
    <BottomTabSelector>
      <BottomTabScreen
        name="Friends"
        component={Friends}
        options={{ tabBarAccessibilityLabel: "Friends" }}
      />
      <BottomTabScreen
        name="Groups"
        component={Groups}
        options={{ tabBarAccessibilityLabel: "Groups" }}
      />
    </BottomTabSelector>
  );
};

export default TabNavigation;
