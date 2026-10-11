import { FC } from "react";
import { CreateBillProvider } from "@/app/providers";
import { useRoute } from "expo-router";
import { RouteProp } from "expo-router/react-navigation";
import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";
import { CreateBillNavigation } from "@/app/navigation/CreateBillNavigation";

export const CreateBill: FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, "CreateBill">>();
  const { groupID } = route.params;

  return (
    <CreateBillProvider groupID={groupID}>
      <CreateBillNavigation />
    </CreateBillProvider>
  );
};

export default CreateBill;
