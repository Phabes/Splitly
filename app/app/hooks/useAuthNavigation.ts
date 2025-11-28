import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProps } from "../navigation/AuthNavigation/AuthNavigationProps";

export const useAuthNavigation = () => useNavigation<AuthNavigationProps>();

export default useAuthNavigation;
