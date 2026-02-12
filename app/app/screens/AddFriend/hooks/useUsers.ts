import { useUserSearch } from "./useUserSearch";
import { useFriendActions } from "./useFriendActions";

export const useUsers = () => {
  const { setUsers, ...searchData } = useUserSearch();

  const friendActions = useFriendActions(setUsers);

  return {
    ...searchData,
    ...friendActions,
  };
};

export default useUsers;
