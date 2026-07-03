import { GROUPS_SEARCH_DELAY } from "@/app/constants/pagination";
import { useAuthenticatedApi, usePaging } from "@/app/hooks";
import { getGroupListCall } from "@/app/services";
import { GroupResult, GroupsResponse, ResponseMessage } from "@/app/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter } from "react-native";

export const useGroupsData = () => {
  const [searchValue, setSearchValue] = useState("");
  const [groups, setGroups] = useState<GroupResult[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const request = useAuthenticatedApi();
  const { isLoadingMore, setIsLoadingMore, hasMore, setHasMore } = usePaging();

  const latestSearchValueRef = useRef(searchValue);

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
          getGroupListCall,
          groupIDs,
          currentSearchValue,
        );
        if (isInitial && currentSearchValue !== latestSearchValueRef.current) {
          return;
        }

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
          setPendingRequestsCount(result.pendingRequestsCount);
        } else {
          const data: ResponseMessage = await response.json();
          throw new Error(data.message);
        }
      } catch (error) {
        // Groups fetch failed
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

  useEffect(() => {
    latestSearchValueRef.current = searchValue;
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

    const groupsRecordIDs = groups.map((f) => f._id);
    await fetchGroups(groupsRecordIDs, false, searchValue);
  }, [isLoadingMore, isSearching, groups, fetchGroups, searchValue]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "refreshGroupList",
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
    groups,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreGroups,
    forceLoadMore,
    pendingRequestsCount,
  };
};

export default useGroupsData;
