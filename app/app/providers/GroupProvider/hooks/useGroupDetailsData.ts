import { useAuthContext, useAuthenticatedApi } from "@/app/hooks";
import { getGroupDetailsCall } from "@/app/services";
import {
  GroupDetailsResponse,
  GroupDetailsResult,
  GroupMemberResult,
  ResponseMessage,
} from "@/app/types";
import { useEffect, useState } from "react";

export const useGroupDetailsData = (groupID: string) => {
  const request = useAuthenticatedApi();
  const { userData } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);
  const [groupDetails, setGroupDetails] = useState<GroupDetailsResult | null>(
    null,
  );

  const setGroupUpdates = (
    updatedDetails: Omit<GroupDetailsResult, "members">,
  ) => {
    setGroupDetails((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        ...updatedDetails,
      };
    });
  };

  const setGroupMembers = (newMembers: GroupMemberResult[]) => {
    setGroupDetails((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        members: newMembers,
      };
    });
  };

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
        // Error during fetching group details
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

  return {
    isLoading,
    userRole,
    groupDetails,
    setGroupUpdates,
    setGroupMembers,
  };
};

export default useGroupDetailsData;
