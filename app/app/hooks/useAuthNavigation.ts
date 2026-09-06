import { useNavigation } from "expo-router/react-navigation";
import { AuthNavigationProps } from "../navigation/AuthNavigation/AuthNavigationProps";

export const useAuthNavigation = () => useNavigation<AuthNavigationProps>();

export default useAuthNavigation;
