import { useAuthContext, useAuthenticatedApi } from "@/app/hooks";
import { getGroupDetailsCall } from "@/app/services";
import {
  GroupDetailsResponse,
  GroupDetailsResult,
  ResponseMessage,
} from "@/app/types";
import { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

export const useGroupDetailsData = (groupID: string) => {
  const request = useAuthenticatedApi();
  const { userData } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);
  const [groupDetails, setGroupDetails] = useState<GroupDetailsResult | null>(
    null,
  );

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "refreshGroupDetails",
      (updatedDetails: Omit<GroupDetailsResult, "members">) => {
        setGroupDetails((prev) => {
          if (!prev) {
            return prev;
          }

          return {
            ...prev,
            ...updatedDetails,
          };
        });
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await request(getGroupDetailsCall, groupID);

        if (response.ok) {
          const data: GroupDetailsResponse = await response.json();
          setGroupDetails(data.groupDetails);
        } else {
          const data: ResponseMessage = await response.json();
          throw new Error(data.message);
        }
      } catch (error) {
        // Group details fetch failed
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [groupID, request]);

  const currentMember = groupDetails?.members.find(
    (member) => member._id === userData?._id || member._id === userData?._id,
  );

  const userRole = currentMember ? currentMember.role : "member";

  return { isLoading, userRole, groupDetails };
};

export default useGroupDetailsData;
