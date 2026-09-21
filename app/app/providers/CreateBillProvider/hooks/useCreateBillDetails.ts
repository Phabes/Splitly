import { useAuthenticatedApi } from "@/app/hooks";
import { getGroupBillDetailsCall } from "@/app/services";
import {
  CreateBillBasicInfo,
  CreateBillData,
  GroupBillDetailsResponse,
  ResponseMessage,
} from "@/app/types";
import { useState, useEffect } from "react";

export const useCreateBillDetails = (groupID: string) => {
  const request = useAuthenticatedApi();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [billData, setBillData] = useState<CreateBillData>({
    name: "",
    totalAmount: 0,
    currency: "",
    payerID: "",
    involvedMembers: [],
    positions: [],
  });

  useEffect(() => {
    const fetchGroupBillDetails = async () => {
      try {
        setIsLoading(true);
        const response = await request(getGroupBillDetailsCall, groupID);

        if (!response.ok) {
          const data: ResponseMessage = await response.json();
          throw new Error(data.message);
        }

        const data: GroupBillDetailsResponse = await response.json();
        setBillData((prevData) => ({
          ...prevData,
          currency: data.baseCurrency,
          involvedMembers: data.members.map((member) => ({
            userID: member._id,
            status: "picking",
          })),
        }));
      } catch (error) {
        // Error during fetching create bill details
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupBillDetails();
  }, [groupID]);

  const setBasicInfo = (basicInfo: CreateBillBasicInfo) => {
    setBillData((prevData) => ({
      ...prevData,
      ...basicInfo,
    }));
  };

  return { billData, setBasicInfo, isLoading };
};

export default useCreateBillDetails;
