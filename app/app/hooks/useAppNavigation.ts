import { useNavigation } from "expo-router/react-navigation";
import { AppNavigationProps } from "../navigation/AppNavigation/AppNavigationProps";

export const useAppNavigation = () => useNavigation<AppNavigationProps>();

export default useAppNavigation;
