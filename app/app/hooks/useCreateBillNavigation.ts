import { useNavigation } from "expo-router/react-navigation";
import { CreateBillNavigationProps } from "../navigation/CreateBillNavigation/CreateBillNavigationProps";

export const useCreateBillNavigation = () =>
  useNavigation<CreateBillNavigationProps>();

export default useCreateBillNavigation;
