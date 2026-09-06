import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";
import { GroupProvider } from "@/app/providers";
import { RouteProp, useRoute } from "expo-router/react-navigation";
import { FC } from "react";
import { GroupDetailsContent } from "./GroupDetailsContent";

export const GroupDetails: FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, "GroupDetails">>();
  const { groupID } = route.params;

  return (
    <GroupProvider groupID={groupID}>
      <GroupDetailsContent />
    </GroupProvider>
  );
};

export default GroupDetails;
