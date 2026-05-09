import { useState, useCallback, useEffect } from "react";
import { useAuthenticatedApi, usePaging } from "@/app/hooks";
import { FriendResult, ResponseMessage } from "@/app/types";
import { getFriendListCall } from "@/app/services";

export const useAddMembersData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<FriendResult[]>([]);
  const [isSearching, setIsSearching] = useState(true);

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
        // Fetching friends error
        console.error(error);
      } finally {
        if (isInitial) {
          setIsSearching(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [request],
  );
  useEffect(() => {
    setIsSearching(true);

    const delayDebounceFn = setTimeout(() => {
      fetchFriends(true, [], searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchFriends]);

  const loadMoreUsers = useCallback(() => {
    if (isLoadingMore || isSearching || !hasMore) {
      return;
    }

    const friendRecordIDs = friends.map((f) => f.user._id);
    fetchFriends(false, friendRecordIDs, searchQuery);
  }, [isLoadingMore, isSearching, hasMore, friends, searchQuery, fetchFriends]);

  const forceLoadMore = useCallback(() => {
    if (isLoadingMore || isSearching) {
      return;
    }

    const friendRecordIDs = friends.map((f) => f.user._id);
    fetchFriends(false, friendRecordIDs, searchQuery);
  }, [isLoadingMore, isSearching, friends, searchQuery, fetchFriends]);

  return {
    searchQuery,
    setSearchQuery,
    friends,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreUsers,
    forceLoadMore,
  };
};

export default useAddMembersData;
