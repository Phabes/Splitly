import { FC } from "react";
import { BackgroundProvider, CreateBillProvider } from "@/app/providers";
import { useRoute } from "expo-router";
import { RouteProp } from "expo-router/react-navigation";
import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";
import { CreateBillNavigation } from "@/app/navigation/CreateBillNavigation";

export const CreateBill: FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, "CreateBill">>();
  const { groupID } = route.params;

  return (
    <BackgroundProvider>
      <CreateBillProvider groupID={groupID}>
        <CreateBillNavigation />
      </CreateBillProvider>
    </BackgroundProvider>
  );
};

export default CreateBill;
