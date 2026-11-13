import useGroupRequestActions from "./useGroupRequestActions";
import useGroupRequestsData from "./useGroupRequestsData";

export const useGroupRequests = () => {
  const { setGroupRequests, ...groupRequestsData } = useGroupRequestsData();
  const groupRequestActions = useGroupRequestActions(setGroupRequests);

  return {
    ...groupRequestsData,
    ...groupRequestActions,
  };
};

export default useGroupRequests;
