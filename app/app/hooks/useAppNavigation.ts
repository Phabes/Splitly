import { useNavigation } from "@react-navigation/native";
import { AppNavigationProps } from "../navigation/AppNavigation/AppNavigationProps";

export const useAppNavigation = () => useNavigation<AppNavigationProps>();

export default useAppNavigation;
