import { createNativeStackNavigator } from "expo-router/native-stack";
import { CreateBillParamList } from "./CreateBillNavigationProps";
import Step2 from "@/app/screens/CreateBill/steps/step2";
import Step3 from "@/app/screens/CreateBill/steps/step3";
import { BasicInfo } from "@/app/screens/CreateBill/steps";

const Stack = createNativeStackNavigator<CreateBillParamList>();

export const CreateBillNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
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
  );
};

export default CreateBillNavigation;
