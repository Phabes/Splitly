export const useFriendActions = () => {
  const handleShowUserProfile = (userID: string) => {
    console.log("Show user profile:", userID);
  };

  return {
    handleShowUserProfile,
  };
};

export default useFriendActions;
