import { useState, useCallback, useEffect } from "react";
import { ADD_MEMBERS_SEARCH_DELAY } from "@/app/constants/pagination";
import { useFriendsList } from "./useFriendsList";

export const useAddMembersData = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    friends,
    isSearching,
    setIsSearching,
    isLoadingMore,
    hasMore,
    fetchFriends,
  } = useFriendsList(searchQuery);

  useEffect(() => {
    setIsSearching(true);

    const delayDebounceFn = setTimeout(() => {
      fetchFriends(true, [], searchQuery);
    }, ADD_MEMBERS_SEARCH_DELAY);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchFriends, setIsSearching]);

  const loadMoreUsers = useCallback(() => {
    if (isLoadingMore || isSearching || !hasMore) {
      return;
    }

    const friendRecordIDs = friends.map((f) => f._id);
    fetchFriends(false, friendRecordIDs, searchQuery);
  }, [isLoadingMore, isSearching, hasMore, friends, searchQuery, fetchFriends]);

  const forceLoadMore = useCallback(() => {
    if (isLoadingMore || isSearching) {
      return;
    }

    const friendRecordIDs = friends.map((f) => f._id);
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
