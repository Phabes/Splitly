import useFriendRequestActions from "./useFriendRequestActions";
import useFriendRequestsData from "./useFriendRequestsData";

export const useFriendRequests = () => {
  const { setFriendRequests, ...friendRequestsData } = useFriendRequestsData();
  const friendRequestActions = useFriendRequestActions(setFriendRequests);

  return {
    ...friendRequestsData,
    ...friendRequestActions,
  };
};

export default useFriendRequests;
