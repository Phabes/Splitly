import { useNavigation } from "@react-navigation/native";
import { CreateBillNavigationProps } from "../navigation/CreateBillNavigation/CreateBillNavigationProps";

export const useCreateBillNavigation = () =>
  useNavigation<CreateBillNavigationProps>();

export default useCreateBillNavigation;
