import { NativeStackNavigationProp } from "expo-router";

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
