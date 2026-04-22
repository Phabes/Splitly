import { GROUPS_SEARCH_DELAY } from "@/app/constants/pagination";
import { useAuthenticatedApi, usePaging } from "@/app/hooks";
import { getGroupList } from "@/app/services";
import { GroupResult, GroupsResponse, ResponseMessage } from "@/app/types";
import { useCallback, useEffect, useState } from "react";

export const useGroupsData = () => {
  const [searchValue, setSearchValue] = useState("");
  const [groups, setGroups] = useState<GroupResult[]>([]);

  const [isSearching, setIsSearching] = useState(true);

  const request = useAuthenticatedApi();
  const { isLoadingMore, setIsLoadingMore, hasMore, setHasMore } = usePaging();

  const fetchGroups = useCallback(
    async (
      groupIDs: string[],
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
          getGroupList,
          groupIDs,
          currentSearchValue,
        );
        if (response.ok) {
          const result: GroupsResponse = await response.json();

          if (result.groups.length > 0) {
            setGroups((prev) =>
              isInitial ? result.groups : [...prev, ...result.groups],
            );
            setHasMore(result.hasMore);
          } else {
            if (isInitial) {
              setGroups([]);
            }
            setHasMore(false);
          }
        } else {
          const data: ResponseMessage = await response.json();
          throw new Error(data.message);
        }
      } catch (error) {
        // Groups fetch failed
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
      fetchGroups([], true, searchValue);
    }, GROUPS_SEARCH_DELAY || 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, fetchGroups]);

  const handleSearchChange = (text: string) => {
    setSearchValue(text);
  };

  const loadMoreGroups = async () => {
    if (isLoadingMore || isSearching || !hasMore) {
      return;
    }

    const groupRecordIDs = groups.map((f) => f._id);
    await fetchGroups(groupRecordIDs, false, searchValue);
  };

  const forceLoadMore = useCallback(async () => {
    if (isLoadingMore || isSearching) {
      return;
    }

    const friendRecordIDs = groups.map((f) => f._id);
    await fetchGroups(friendRecordIDs, false, searchValue);
  }, [isLoadingMore, isSearching, groups, fetchGroups, searchValue]);

  return {
    searchValue,
    handleSearchChange,
    groups,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreGroups,
    forceLoadMore,
  };
};

export default useGroupsData;
