import {
  ADD_FRIENDS_MIN_SEARCH_LENGTH,
  ADD_FRIENDS_SEARCH_DELAY,
} from "@/app/constants/pagination";
import { useAuthenticatedApi, usePaging } from "@/app/hooks";
import { getAddFriendListCall } from "@/app/services";
import { AddFriendResponse, ResponseMessage, UserResult } from "@/app/types";
import { useCallback, useEffect, useState, useRef } from "react";

export const useUserSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const request = useAuthenticatedApi();
  const { isLoadingMore, setIsLoadingMore, hasMore, setHasMore } = usePaging();

  const latestSearchValueRef = useRef(searchValue);

  const fetchUsers = useCallback(
    async (
      userIDs: string[],
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
          getAddFriendListCall,
          currentSearchValue,
          userIDs,
        );

        if (isInitial && currentSearchValue !== latestSearchValueRef.current) {
          return;
        }

        if (response.ok) {
          const result: AddFriendResponse = await response.json();

          if (result.users.length > 0) {
            setUsers((prev) =>
              isInitial ? result.users : [...prev, ...result.users],
            );
            setHasMore(result.hasMore);
          } else {
            if (isInitial) {
              setUsers([]);
            }
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
          if (currentSearchValue === latestSearchValueRef.current) {
            setIsSearching(false);
          }
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [request, setHasMore, setIsLoadingMore],
  );

  const handleSearchChange = (text: string) => {
    setSearchValue(text);
  };

  useEffect(() => {
    latestSearchValueRef.current = searchValue;

    if (searchValue.trim().length < ADD_FRIENDS_MIN_SEARCH_LENGTH) {
      setIsSearching(false);
      setUsers([]);
      setHasMore(false);
      return;
    }

    setIsSearching(true);

    const delayDebounceFn = setTimeout(() => {
      fetchUsers([], true, searchValue);
    }, ADD_FRIENDS_SEARCH_DELAY || 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, fetchUsers]);

  const loadMoreUsers = async () => {
    if (isLoadingMore || isSearching || !hasMore) {
      return;
    }

    const userIDs = users.map((user) => user._id);
    await fetchUsers(userIDs, false, searchValue);
  };

  const forceLoadMore = useCallback(async () => {
    if (
      isLoadingMore ||
      isSearching ||
      searchValue.trim().length < ADD_FRIENDS_MIN_SEARCH_LENGTH
    ) {
      return;
    }

    const userIDs = users.map((user) => user._id);
    await fetchUsers(userIDs, false, searchValue);
  }, [isLoadingMore, isSearching, searchValue, users, fetchUsers]);

  return {
    searchValue,
    users,
    setUsers,
    isSearching,
    isLoadingMore,
    hasMore,
    handleSearchChange,
    loadMoreUsers,
    forceLoadMore,
  };
};

export default useUserSearch;
