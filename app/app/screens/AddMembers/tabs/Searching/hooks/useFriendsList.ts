import { useAuthenticatedApi, usePaging } from "@/app/hooks";
import { getGroupCandidatesCall } from "@/app/services";
import { AddMembersResponse, FriendResult, ResponseMessage } from "@/app/types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useFriendsList = (
  currentSearchValue: string = "",
  groupID?: string,
) => {
  const [friends, setFriends] = useState<FriendResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { isLoadingMore, setIsLoadingMore, hasMore, setHasMore } = usePaging();
  const request = useAuthenticatedApi();

  const latestSearchValueRef = useRef(currentSearchValue);

  useEffect(() => {
    latestSearchValueRef.current = currentSearchValue;
  }, [currentSearchValue]);

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
          getGroupCandidatesCall,
          searchValue,
          friendIDs,
          groupID,
        );
        if (isInitial && searchValue !== latestSearchValueRef.current) {
          return;
        }

        if (response.ok) {
          const result: AddMembersResponse = await response.json();

          if (result.friends && result.friends.length > 0) {
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
        console.error(error);
      } finally {
        if (isInitial) {
          if (searchValue === latestSearchValueRef.current) {
            setIsSearching(false);
          }
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
    setIsSearching,
    isLoadingMore,
    hasMore,
    fetchFriends,
  };
};

export default useFriendsList;
