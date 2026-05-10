import { useState, useCallback } from "react";
import { useAuthenticatedApi, usePaging } from "@/app/hooks";
import { FriendResult, ResponseMessage } from "@/app/types";
import { getFriendListCall } from "@/app/services";

export const useFriendsList = () => {
  const [friends, setFriends] = useState<FriendResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { isLoadingMore, setIsLoadingMore, hasMore, setHasMore } = usePaging();
  const request = useAuthenticatedApi();

  const fetchFriends = useCallback(
    async (
      isInitial: boolean = false,
      friendIDs: string[] = [],
      searchValue: string = "",
    ) => {
      if (isInitial) {
        setIsSearching(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await request(
          getFriendListCall,
          friendIDs,
          searchValue,
        );

        if (response.ok) {
          const result = await response.json();

          if (result.friends && result.friends.length > 0) {
            setFriends((prev) =>
              isInitial ? result.friends : [...prev, ...result.friends],
            );
            setHasMore(result.hasMore);
          } else {
            if (isInitial) setFriends([]);
            setHasMore(false);
          }
        } else {
          const data: ResponseMessage = await response.json();
          throw new Error(data.message);
        }
      } catch (error) {
        console.error(error);
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

  return {
    friends,
    isSearching,
    setIsSearching, // Exported so parent hooks can trigger the loader manually
    isLoadingMore,
    hasMore,
    fetchFriends,
  };
};

export default useFriendsList;
