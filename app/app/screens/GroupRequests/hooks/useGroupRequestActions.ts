import {
  useAuthenticatedApi,
  useLoadingContext,
  useTranslations,
} from "@/app/hooks";
import { respondToGroupRequestCall } from "@/app/services/groups/respondToGroupRequestCall";
import { GroupRequestResult, ResponseMessage } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export const useGroupRequestActions = (
  setGroupRequests: Dispatch<SetStateAction<GroupRequestResult[]>>,
) => {
  const request = useAuthenticatedApi();
  const { showLoading, hideLoading } = useLoadingContext();
  const translations = useTranslations();

  const handleAcceptGroupRequest = async (groupRequestID: string) => {
    showLoading(translations["acceptingGroupRequest"]);

    try {
      const response = await request(
        respondToGroupRequestCall,
        groupRequestID,
        "accepted",
      );

      if (response.ok) {
        setGroupRequests((prev) =>
          prev.filter((e) => e._id !== groupRequestID),
        );
      } else if (response.status >= 400 && response.status < 500) {
        setGroupRequests((prev) =>
          prev.filter((e) => e._id !== groupRequestID),
        );
      } else {
        const data: ResponseMessage = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      // Accepting group request failed
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const handleRejectGroupRequest = async (groupRequestID: string) => {
    showLoading(translations["acceptingGroupRequest"]);

    try {
      const response = await request(
        respondToGroupRequestCall,
        groupRequestID,
        "declined",
      );

      if (response.ok) {
        setGroupRequests((prev) =>
          prev.filter((e) => e._id !== groupRequestID),
        );
      } else if (response.status >= 400 && response.status < 500) {
        setGroupRequests((prev) =>
          prev.filter((e) => e._id !== groupRequestID),
        );
      } else {
        const data: ResponseMessage = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      // Rejecting group request failed
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  return {
    handleAcceptGroupRequest,
    handleRejectGroupRequest,
  };
};

export default useGroupRequestActions;
