import { useAuthenticatedApi, usePaging } from "@/app/hooks";
import { getFriendRequests } from "@/app/services/friend";
import { UserResult } from "@/app/types";
import { useEffect, useState } from "react";

export const useFriendRequests = () => {
  const [users, setUsers] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  const request = useAuthenticatedApi();
  const { isLoadingMore, setIsLoadingMore, hasMore, setHasMore } = usePaging();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await request(getFriendRequests, []);

        if (response.ok) {
          const result = await response.json();
          console.log("Friend Requests:", result);
          console.log(result.requests[0].requester);
        } else {
          console.warn("Failed to fetch friend requests:", response.status);
        }
      } catch (error) {
        console.error("Initial search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchRequests();
  }, [request]);

  return { users, isSearching };
};

export default useFriendRequests;
