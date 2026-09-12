import React from "react";
import { createNativeStackNavigator } from "expo-router/native-stack";
import { Step1 } from "@/app/screens/CreateBill/step1";
import { Step2 } from "@/app/screens/CreateBill/step2";
import { Step3 } from "@/app/screens/CreateBill/step3";
import { CreateBillParamList } from "./CreateBillNavigationProps";

const Stack = createNativeStackNavigator<CreateBillParamList>();

export const CreateBillNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Step1"
    >
      <Stack.Screen
        name="Step1"
        component={Step1}
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
