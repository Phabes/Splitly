export const useGroupActions = () => {
  const handleShowGroupProfile = (groupID: string) => {
    console.log("Show group profile:", groupID);
  };

  return {
    handleShowGroupProfile,
  };
};

export default useGroupActions;
