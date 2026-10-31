import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type CreateBillParamList = {
  BasicInfo: undefined;
  Squad: undefined;
  Positions: undefined;
  SharedPositions: undefined;
  Summary: undefined;
};

export type CreateBillNavigationProps =
  NativeStackNavigationProp<CreateBillParamList>;

export default function Index() {
  return null;
}
