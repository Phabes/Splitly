export const useFriendRequestActions = () => {
  const handleAcceptFriendRequest = (friendRequestID: string) => {
    console.log("Accept:", friendRequestID);
  };

  const handleDeclineFriendRequest = (friendRequestID: string) => {
    console.log("Decline:", friendRequestID);
  };

  const handleShowUserProfile = (userID: string) => {
    console.log("Show user profile:", userID);
  };

  return {
    handleAcceptFriendRequest,
    handleDeclineFriendRequest,
    handleShowUserProfile,
  };
};

export default useFriendRequestActions;
