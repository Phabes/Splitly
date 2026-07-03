import { useAuthenticatedApi } from "@/app/hooks";
import { getGroupDetailsCall } from "@/app/services";
import {
  GroupDetailsResponse,
  GroupDetailsResult,
  ResponseMessage,
} from "@/app/types";
import { useEffect, useState } from "react";

export const useGroupDetailsData = (groupID: string) => {
  const request = useAuthenticatedApi();

  const [isAdmin, setIsAdmin] = useState(false);
  const [groupDetails, setGroupDetails] = useState<GroupDetailsResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await request(getGroupDetailsCall, groupID);

        if (response.ok) {
          const data: GroupDetailsResponse = await response.json();
          setIsAdmin(data.isAdmin);
          setGroupDetails(data.group);
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
