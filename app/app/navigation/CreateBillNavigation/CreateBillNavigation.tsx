import { createNativeStackNavigator } from "expo-router/native-stack";
import { BasicInfo } from "@/app/screens/CreateBill/BasicInfo";
import { CreateBillParamList } from "./CreateBillNavigationProps";
import { CreateBillProvider } from "@/app/providers";
import { useRoute } from "expo-router";
import { RouteProp } from "expo-router/react-navigation";
import { AppStackParamList } from "../AppNavigation/AppNavigationProps";
import Step2 from "@/app/screens/CreateBill/forms/step2";
import Step3 from "@/app/screens/CreateBill/forms/step3";

const Stack = createNativeStackNavigator<CreateBillParamList>();

export const CreateBillNavigation = () => {
  const route = useRoute<RouteProp<AppStackParamList, "CreateBill">>();
  const { groupID } = route.params;

  return (
    <CreateBillProvider groupID={groupID}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="BasicInfo"
      >
        <Stack.Screen
          name="BasicInfo"
          component={BasicInfo}
        />
        <Stack.Screen
          name="Step2"
          component={Step2}
        />
        <Stack.Screen
          name="Step3"
          component={Step3}
        />
      </Stack.Navigator>
    </CreateBillProvider>
  );
};

export default CreateBillNavigation;
