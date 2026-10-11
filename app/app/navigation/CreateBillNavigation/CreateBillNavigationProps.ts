import { NativeStackNavigationProp } from "expo-router";

export type CreateBillParamList = {
  BasicInfo: undefined;
  Squad: undefined;
  Positions: undefined;
  Step2: undefined;
  Step3: undefined;
};

export type CreateBillNavigationProps =
  NativeStackNavigationProp<CreateBillParamList>;

export default function Index() {
  return null;
}
