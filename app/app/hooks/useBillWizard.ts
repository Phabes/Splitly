import { useRoute } from "expo-router/react-navigation";
import { CreateBillParamList } from "../navigation/CreateBillNavigation/CreateBillNavigationProps";
import { useCreateBillNavigation } from "./useCreateBillNavigation";

export const useBillWizard = () => {
  const route = useRoute();
  const navigation = useCreateBillNavigation();

  const state = navigation.getState();

  const dynamicFlow = state
    ? (state.routeNames as (keyof CreateBillParamList)[])
    : [route.name as keyof CreateBillParamList];

  const currentScreen = route.name as keyof CreateBillParamList;

  const currentIndex = dynamicFlow.indexOf(currentScreen);
  const stepNumber = currentIndex + 1;
  const totalSteps = dynamicFlow.length;

  const headerTitle = `${stepNumber}/${totalSteps}`;

  const goNext = () => {
    if (currentIndex < totalSteps - 1) {
      navigation.navigate(dynamicFlow[currentIndex + 1]);
    }
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      exitWizard();
    }
  };

  const exitWizard = () => {
    navigation.getParent()?.goBack();
  };

  return {
    headerTitle,
    goNext,
    goBack,
    exitWizard,
    isLastStep: currentIndex === totalSteps - 1,
  };
};

export default useBillWizard;
