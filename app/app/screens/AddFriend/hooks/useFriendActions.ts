import {
  useAuthenticatedApi,
  useLoadingContext,
  useTranslations,
} from "@/app/hooks";
import { sendFriendRequest } from "@/app/services";
import { ResponseMessage, UserResult } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export const useFriendActions = (
  setUsers: Dispatch<SetStateAction<UserResult[]>>,
) => {
  const request = useAuthenticatedApi();
  const { showLoading, hideLoading } = useLoadingContext();
  const translations = useTranslations();

  const handleAddFriend = async (userID: string) => {
    showLoading(translations["sendingFriendRequest"]);

    try {
      const response = await request(sendFriendRequest, userID);

      if (response.ok) {
        setUsers((prev) => prev.filter((e) => e._id !== userID));
      } else if (response.status === 409) {
        const data: ResponseMessage = await response.json();
        if (
          data.code === "postFriendRequest/friendshipAlreadyExists" ||
          data.code === "postFriendRequest/friendRequestPending"
        ) {
          setUsers((prev) => prev.filter((e) => e._id !== userID));
        }
      } else {
        // TO DO - handle other responses
        const data: ResponseMessage = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      // Sending friend request failed
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const handleShowUserProfile = (userID: string) => {
    console.log("Show user profile:", userID);
  };

  return {
    handleAddFriend,
    handleShowUserProfile,
  };
};

export default useFriendActions;
