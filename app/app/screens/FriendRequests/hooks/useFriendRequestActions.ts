import {
  useAuthenticatedApi,
  useLoadingContext,
  useTranslations,
} from "@/app/hooks";
import { respondToFriendRequest } from "@/app/services";
import { FriendRequestResult } from "@/app/types";
import { Dispatch, SetStateAction } from "react";

export const useFriendRequestActions = (
  setFriendRequests: Dispatch<SetStateAction<FriendRequestResult[]>>,
) => {
  const request = useAuthenticatedApi();
  const { showLoading, hideLoading } = useLoadingContext();
  const translations = useTranslations();

  const handleAcceptFriendRequest = async (friendRequestID: string) => {
    showLoading(translations["acceptingFriendRequest"]);

    try {
      const response = await request(
        respondToFriendRequest,
        friendRequestID,
        "accepted",
      );

      if (response.ok) {
        setFriendRequests((prev) =>
          prev.filter((e) => e._id !== friendRequestID),
        );
      } else if (response.status >= 400 && response.status < 500) {
        setFriendRequests((prev) =>
          prev.filter((e) => e._id !== friendRequestID),
        );
      } else {
        // TO DO - handle other responses
      }
    } catch (error) {
      console.log("Accepting friend request failed:", error);
    } finally {
      hideLoading();
    }
  };

  const handleRejectFriendRequest = async (friendRequestID: string) => {
    showLoading(translations["rejectingFriendRequest"]);

    try {
      const response = await request(
        respondToFriendRequest,
        friendRequestID,
        "rejected",
      );

      if (response.ok) {
        setFriendRequests((prev) =>
          prev.filter((e) => e._id !== friendRequestID),
        );
      } else if (response.status >= 400 && response.status < 500) {
        setFriendRequests((prev) =>
          prev.filter((e) => e._id !== friendRequestID),
        );
      } else {
        // TO DO - handle other responses
      }
    } catch (error) {
      console.log("Rejecting friend request failed:", error);
    } finally {
      hideLoading();
    }
  };

  const handleShowUserProfile = (userID: string) => {
    console.log("Show user profile:", userID);
  };

  return {
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
    handleShowUserProfile,
  };
};

export default useFriendRequestActions;
