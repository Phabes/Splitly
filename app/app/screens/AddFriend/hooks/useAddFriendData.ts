import {
  ADD_FRIENDS_MIN_SEARCH_LENGTH,
  ADD_FRIENDS_PAGE_SIZE,
  ADD_FRIENDS_SEARCH_DELAY,
} from "@/app/constants/pagination";
import { usePaging } from "@/app/hooks";
import { useEffect, useState } from "react";

interface UserResult {
  id: string;
  username: string;
  email: string;
}

const fetchUsersFromServer = async (query: string, pageNum: number) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const totalMockData: UserResult[] = Array.from({ length: 22 }, (_, i) => ({
    id: `${i + 1}`,
    username: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  })).filter(
    (user) =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()),
  );

  const startIndex = (pageNum - 1) * ADD_FRIENDS_PAGE_SIZE;
  const paginatedData = totalMockData.slice(
    startIndex,
    startIndex + ADD_FRIENDS_PAGE_SIZE,
  );

  return {
    data: paginatedData,
    total: totalMockData.length,
  };
};

export const useAddFriendData = () => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const {
    page,
    setPage,
    isLoadingMore,
    setIsLoadingMore,
    hasMore,
    setHasMore,
  } = usePaging();

  useEffect(() => {
    if (searchValue.trim().length < ADD_FRIENDS_MIN_SEARCH_LENGTH) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const result = await fetchUsersFromServer(searchValue, 1);
        setUsers(result.data);
        setHasMore(result.data.length < result.total);
      } catch (error) {
        console.error("Initial search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, ADD_FRIENDS_SEARCH_DELAY);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const loadMoreUsers = async () => {
    if (isLoadingMore || !hasMore || isSearching) {
      return;
    }

    setIsLoadingMore(true);

    const nextPage = page + 1;

    try {
      const result = await fetchUsersFromServer(searchValue, nextPage);
      if (result.data.length > 0) {
        setUsers((prev) => [...prev, ...result.data]);
        setPage(nextPage);
        setHasMore(users.length + result.data.length < result.total);
      } else {
        setHasMore(false);
      }
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
      setPage(1);
      setHasMore(true);
    } else {
      setIsSearching(false);
      setUsers([]);
    }
  };

  return {
    searchValue,
    users,
    isSearching,
    isLoadingMore,
    hasMore,
    handleSearchChange,
    loadMoreUsers,
  };
};

export default useAddFriendData;
