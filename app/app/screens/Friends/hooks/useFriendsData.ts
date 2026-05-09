import { FRIENDS_SEARCH_DELAY } from "@/app/constants/pagination";
import { useAuthenticatedApi, usePaging } from "@/app/hooks";
import { getFriendListCall } from "@/app/services";
import { FriendsResponse, FriendResult, ResponseMessage } from "@/app/types";
import { useCallback, useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

export const useFriendsData = () => {
  const [searchValue, setSearchValue] = useState("");
  const [friends, setFriends] = useState<FriendResult[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  const request = useAuthenticatedApi();
  const { isLoadingMore, setIsLoadingMore, hasMore, setHasMore } = usePaging();

  const fetchFriends = useCallback(
    async (
      friendIDs: string[],
      isInitial: boolean = false,
      currentSearchValue: string = "",
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
          currentSearchValue,
        );

        if (response.ok) {
          const result: FriendsResponse = await response.json();

          if (result.friends.length > 0) {
            setFriends((prev) =>
              isInitial ? result.friends : [...prev, ...result.friends],
            );
            setHasMore(result.hasMore);
          } else {
            if (isInitial) {
              setFriends([]);
            }
            setHasMore(false);
          }
        } else {
          const data: ResponseMessage = await response.json();
          throw new Error(data.message);
        }
      } catch (error) {
        // Friends fetch failed
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

  useEffect(() => {
    setIsSearching(true);

    const delayDebounceFn = setTimeout(() => {
      fetchFriends([], true, searchValue);
    }, FRIENDS_SEARCH_DELAY || 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, fetchFriends]);

  const handleSearchChange = (text: string) => {
    setSearchValue(text);
  };

  const loadMoreFriends = async () => {
    if (isLoadingMore || isSearching || !hasMore) {
      return;
    }

    const friendRecordIDs = friends.map((f) => f._id);
    await fetchFriends(friendRecordIDs, false, searchValue);
  };

  const forceLoadMore = useCallback(async () => {
    if (isLoadingMore || isSearching) {
      return;
    }

    const friendRecordIDs = friends.map((f) => f._id);
    await fetchFriends(friendRecordIDs, false, searchValue);
  }, [isLoadingMore, isSearching, friends, fetchFriends, searchValue]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "refreshFriendList",
      () => {
        forceLoadMore();
      },
    );

    return () => {
      subscription.remove();
    };
  }, [forceLoadMore]);

  return {
    searchValue,
    handleSearchChange,
    friends,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreFriends,
    forceLoadMore,
  };
};

export default useFriendsData;
