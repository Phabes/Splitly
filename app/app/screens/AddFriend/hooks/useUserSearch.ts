import {
  ADD_FRIENDS_MIN_SEARCH_LENGTH,
  ADD_FRIENDS_SEARCH_DELAY,
} from "@/app/constants/pagination";
import { useAuthenticatedApi, usePaging } from "@/app/hooks";
import { getAddFriendList } from "@/app/services/friend";
import { AddFriendList, UserResult } from "@/app/types";
import { useCallback, useEffect, useState } from "react";

export const useUserSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const request = useAuthenticatedApi();
  const { isLoadingMore, setIsLoadingMore, hasMore, setHasMore } = usePaging();

  const retrieveData = async () => {
    const userIDs = users.map((user) => user._id);

    const response = await request(getAddFriendList, searchValue, userIDs);

    if (response.ok) {
      const result: AddFriendList = await response.json();

      if (result.users.length > 0) {
        setUsers((prev) => [...prev, ...result.users]);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    }
  };

  const forceLoadMore = useCallback(async () => {
    if (
      isLoadingMore ||
      isSearching ||
      searchValue.trim().length < ADD_FRIENDS_MIN_SEARCH_LENGTH
    ) {
      return;
    }

    setIsLoadingMore(true);

    try {
      await retrieveData();
    } catch (error) {
      console.error("Manual force load failed:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, isSearching, searchValue]);

  useEffect(() => {
    if (searchValue.trim().length < ADD_FRIENDS_MIN_SEARCH_LENGTH) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await request(getAddFriendList, searchValue, []);

        if (response.ok) {
          const result: AddFriendList = await response.json();
          setUsers(result.users);
          setHasMore(result.hasMore);
        } else {
          // TO DO - handle other responses
        }
      } catch (error) {
        console.error("Initial search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, ADD_FRIENDS_SEARCH_DELAY);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const loadMoreUsers = async () => {
    if (isLoadingMore || isSearching || !hasMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      await retrieveData();
    } catch (error) {
      console.error("Load more failed:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchValue(text);

    if (text.trim().length >= ADD_FRIENDS_MIN_SEARCH_LENGTH) {
      setIsSearching(true);
      setHasMore(true);
    } else {
      setIsSearching(false);
      setUsers([]);
    }
  };

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
