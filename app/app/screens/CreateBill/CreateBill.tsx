import { FC } from "react";
import { CreateBillProvider } from "@/app/providers";
import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";
import { CreateBillNavigation } from "@/app/navigation/CreateBillNavigation";
import { RouteProp, useRoute } from "@react-navigation/native";

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
