import useFriendRequestActions from "./useFriendRequestActions";
import useFriendRequestsData from "./useFriendRequestsData";

export const useFriendRequests = () => {
  const friendRequestsData = useFriendRequestsData();
  const friendRequestActions = useFriendRequestActions();

  return {
    ...friendRequestsData,
    ...friendRequestActions,
  };
};

export default useFriendRequests;
