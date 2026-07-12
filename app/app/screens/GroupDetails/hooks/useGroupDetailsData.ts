import { useAuthenticatedApi } from "@/app/hooks";
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

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [groupDetails, setGroupDetails] = useState<GroupDetailsResult | null>(
    null,
  );

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "refreshGroupDetails",
      (groupDetails: GroupDetailsResult) => {
        setGroupDetails(groupDetails);
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
          setIsAdmin(data.isAdmin);
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

  return { isLoading, isAdmin, groupDetails };
};

export default useGroupDetailsData;
