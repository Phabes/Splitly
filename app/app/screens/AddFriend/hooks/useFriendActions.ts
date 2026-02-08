import {
  useAuthenticatedApi,
  useLoadingContext,
  useTranslations,
} from "@/app/hooks";
import { sendFriendRequest } from "@/app/services/friend";
import { UserResult } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export const useFriendActions = (
  setUsers: Dispatch<SetStateAction<UserResult[]>>,
) => {
  const request = useAuthenticatedApi();
  const { showLoading, hideLoading } = useLoadingContext();
  const translations = useTranslations();

  const handleAddFriend = async (userId: string) => {
    showLoading(translations["sendingFriendRequest"]);

    try {
      const response = await request(sendFriendRequest, userId);

      if (response.ok) {
        setUsers((prev) => prev.filter((e) => e._id !== userId));
      } else {
        // TO DO - handle other responses
      }
    } catch (error) {
      console.log("Sending friend request failed:", error);
    } finally {
      hideLoading();
    }
  };

  const handleShowFriend = (userId: string) => {
    console.log("Show friend profile:", userId);
  };

  return {
    handleAddFriend,
    handleShowFriend,
  };
};

export default useFriendActions;
