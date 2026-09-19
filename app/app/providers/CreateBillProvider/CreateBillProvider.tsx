import { CreateBillContext } from "@/app/contexts";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useGroupDetailsData } from "../GroupProvider/hooks";
import { CreateBillBasicInfo, CreateBillData } from "@/app/types";

type CreateBillProviderProps = PropsWithChildren & {
  groupID: string;
};

export const CreateBillProvider: FC<CreateBillProviderProps> = ({
  children,
  groupID,
}) => {
  const { groupDetails, isLoading } = useGroupDetailsData(groupID);

  const [billData, setBillData] = useState<CreateBillData>({
    name: "",
    totalAmount: 0,
    currency: "",
    payerID: "",
    involvedMembers: [],
    positions: [],
  });

  useEffect(() => {
    if (groupDetails?.baseCurrency && billData.currency === "") {
      setBillData((prevData) => ({
        ...prevData,
        currency: groupDetails.baseCurrency,
      }));
    }
  }, [groupDetails?.baseCurrency]);

  const setBasicInfo = (basicInfo: CreateBillBasicInfo) => {
    setBillData((prevData) => ({
      ...prevData,
      ...basicInfo,
    }));
  };

  return (
    <CreateBillContext.Provider value={{ billData, setBasicInfo }}>
      {children}
    </CreateBillContext.Provider>
  );
};

export default CreateBillProvider;
