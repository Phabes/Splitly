import { AddMembersProvider } from "@/app/providers";
import { FC } from "react";
import { AddMembersContent } from "./AddMembersContent";
import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";
import { RouteProp, useRoute } from "expo-router/react-navigation";

export const AddMembers: FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, "AddMembers">>();
  const { groupID, initialSelectedUsers, returnEvent } = route.params;

  return (
    <AddMembersProvider
      groupID={groupID}
      initialSelectedUsers={initialSelectedUsers}
      returnEvent={returnEvent}
    >
      <AddMembersContent />
    </AddMembersProvider>
  );
};

export default AddMembers;
