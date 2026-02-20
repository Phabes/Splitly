import { useAuthenticatedApi, usePaging } from "@/app/hooks";
import { getFriendRequests } from "@/app/services/friend";
import {
  FriendRequestResult,
  FriendRequestsResponse,
  ResponseMessage,
} from "@/app/types";
import { useCallback, useEffect, useState } from "react";

export const useFriendRequestsData = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequestResult[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(true);

  const request = useAuthenticatedApi();
  const { isLoadingMore, setIsLoadingMore, hasMore, setHasMore } = usePaging();

  const fetchRequests = useCallback(
    async (friendRequestIDs: string[], isInitial: boolean = false) => {
      if (isInitial) {
        setIsSearching(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await request(getFriendRequests, friendRequestIDs);

        if (response.ok) {
          const result: FriendRequestsResponse = await response.json();

          if (result.requests.length > 0) {
            setFriendRequests((prev) =>
              isInitial ? result.requests : [...prev, ...result.requests],
            );
            setHasMore(result.hasMore);
          } else {
            setHasMore(false);
          }
        } else {
          const data: ResponseMessage = await response.json();
          console.error("Server error:", data.message);
        }
      } catch (error) {
        console.error("Friend requests search failed:", error);
      } finally {
        if (isInitial) {
          setIsSearching(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [request, setHasMore, setIsLoadingMore],
  );

  useEffect(() => {
    fetchRequests([], true);
  }, [fetchRequests]);

  const loadMoreFriendRequests = async () => {
    if (isLoadingMore || isSearching || !hasMore) {
      return;
    }

    const friendRequestIDs = friendRequests.map(
      (friendRequest) => friendRequest._id,
    );

    await fetchRequests(friendRequestIDs, false);
  };

  const forceLoadMore = useCallback(async () => {
    if (isLoadingMore || isSearching) {
      return;
    }

    const friendRequestIDs = friendRequests.map(
      (friendRequest) => friendRequest._id,
    );

    await fetchRequests(friendRequestIDs, false);
  }, [isLoadingMore, isSearching, friendRequests, fetchRequests]);

  return {
    friendRequests,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreFriendRequests,
    forceLoadMore,
  };
};

export default useFriendRequestsData;
