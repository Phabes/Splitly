import { useAuthContext, useAuthenticatedApi, useFormData } from "@/app/hooks";
import { getGroupBillDetailsCall } from "@/app/services";
import {
  BillPosition,
  CreateBillData,
  GroupBillDetailsResponse,
  ResponseMessage,
  UserResult,
} from "@/app/types";
import { useState, useEffect, useCallback } from "react";

export const useCreateBillDetails = (groupID: string) => {
  const request = useAuthenticatedApi();
  const { userData } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [members, setMember] = useState<UserResult[]>([]);
  const [billData, setBillData] = useState<CreateBillData>({
    name: "",
    totalAmount: 0,
    currency: "",
    payerID: "",
    involvedMembers: [],
    positions: [],
  });

  const billNameField = useFormData(billData.name);
  const totalAmountField = useFormData("");
  const currencyField = useFormData(billData.currency);
  const payerIDField = useFormData(userData?._id);

  const billForm = {
    billNameField,
    totalAmountField,
    currencyField,
    payerIDField,
  };

  const setBasicInfo = (
    name: CreateBillData["name"],
    totalAmount: CreateBillData["totalAmount"],
    currency: CreateBillData["currency"],
    payerID: CreateBillData["payerID"],
  ) => {
    setBillData((prevData) => ({
      ...prevData,
      name,
      totalAmount,
      currency,
      payerID,
    }));
  };

  const setInvolvedMembers = (
    newInvolvedMembers: CreateBillData["involvedMembers"],
  ) => {
    setBillData((prevData) => ({
      ...prevData,
      involvedMembers: newInvolvedMembers,
    }));
  };

  const addPositions = useCallback((newPositions: BillPosition[]) => {
    setBillData((prevData) => ({
      ...prevData,
      positions: [...prevData.positions, ...newPositions],
    }));
  }, []);

  const removePosition = useCallback((indexToRemove: number) => {
    setBillData((prevData) => ({
      ...prevData,
      positions: prevData.positions.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  }, []);

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
        currencyField.setValue(data.baseCurrency);

        setMember(data.members);
      } catch (error) {
        // Error during fetching create bill details
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupBillDetails();
  }, [groupID]);

  return {
    billData,
    billForm,
    members,
    isLoading,
    setBasicInfo,
    setInvolvedMembers,
    addPositions,
    removePosition,
  };
};

export default useCreateBillDetails;
