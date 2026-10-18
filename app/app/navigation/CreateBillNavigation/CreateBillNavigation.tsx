import { createNativeStackNavigator } from "expo-router/native-stack";
import { CreateBillParamList } from "./CreateBillNavigationProps";
import {
  BasicInfo,
  Positions,
  SharedPositions,
  Squad,
  Summary,
} from "@/app/screens/CreateBill/steps";

const Stack = createNativeStackNavigator<CreateBillParamList>();

export const CreateBillNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "transparent" },
      }}
      initialRouteName="BasicInfo"
    >
      <Stack.Screen
        name="BasicInfo"
        component={BasicInfo}
      />
      <Stack.Screen
        name="Squad"
        component={Squad}
      />
      <Stack.Screen
        name="Positions"
        component={Positions}
      />
      <Stack.Screen
        name="SharedPositions"
        component={SharedPositions}
      />
      <Stack.Screen
        name="Summary"
        component={Summary}
      />
    </Stack.Navigator>
  );
};

export default CreateBillNavigation;
