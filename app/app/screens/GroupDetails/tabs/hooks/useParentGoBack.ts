import { useAppNavigation } from "@/app/hooks";

export const useParentGoBack = () => {
  const navigation = useAppNavigation();

  const handleBackPress = () => {
    const parentNavigator = navigation.getParent();
    if (parentNavigator) {
      parentNavigator.goBack();
    } else {
      navigation.goBack();
    }
  };

  return handleBackPress;
};
