import { useAuthenticatedApi, usePaging } from "@/app/hooks";
import { getGroupRequestsCall } from "@/app/services";
import {
  GroupRequestResult,
  GroupRequestsResponse,
  ResponseMessage,
} from "@/app/types";
import { useCallback, useEffect, useState } from "react";

export const useGroupRequestsData = () => {
  const [groupRequests, setGroupRequests] = useState<GroupRequestResult[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  const request = useAuthenticatedApi();
  const { isLoadingMore, setIsLoadingMore, hasMore, setHasMore } = usePaging();

  const fetchRequests = useCallback(
    async (groupRequestIDs: string[], isInitial: boolean = false) => {
      if (isInitial) {
        setIsSearching(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await request(getGroupRequestsCall, groupRequestIDs);

        if (response.ok) {
          const result: GroupRequestsResponse = await response.json();

          if (result.requests.length > 0) {
            setGroupRequests((prev) =>
              isInitial ? result.requests : [...prev, ...result.requests],
            );
            setHasMore(result.hasMore);
          } else {
            setHasMore(false);
          }
        } else {
          const data: ResponseMessage = await response.json();
          throw new Error(data.message);
        }
      } catch (error) {
        // Group requests search failed
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
    fetchRequests([], true);
  }, [fetchRequests]);

  const loadMoreGroupRequests = async () => {
    if (isLoadingMore || isSearching || !hasMore) {
      return;
    }

    const groupRequestIDs = groupRequests.map(
      (groupRequest) => groupRequest._id,
    );

    await fetchRequests(groupRequestIDs, false);
  };

  const forceLoadMore = useCallback(async () => {
    if (isLoadingMore || isSearching) {
      return;
    }

    const groupRequestIDs = groupRequests.map(
      (groupRequest) => groupRequest._id,
    );

    await fetchRequests(groupRequestIDs, false);
  }, [isLoadingMore, isSearching, groupRequests, fetchRequests]);

  return {
    groupRequests,
    setGroupRequests,
    hasMore,
    isSearching,
    isLoadingMore,
    loadMoreGroupRequests,
    forceLoadMore,
  };
};

export default useGroupRequestsData;
