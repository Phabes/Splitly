import {
  useAuthenticatedApi,
  useGroupContext,
  useLoadingContext,
  useTranslations,
} from "@/app/hooks";
import { transferOwnershipCall } from "@/app/services";

export const useTransferOwnership = () => {
  const translations = useTranslations();
  const { showLoading, hideLoading } = useLoadingContext();
  const request = useAuthenticatedApi();
  const { groupID, setGroupMembers } = useGroupContext();

  const handleTransferOwnership = async (memberID: string) => {
    if (!groupID) return;

    showLoading(translations["changingOwner"]);

    try {
      const response = await request(transferOwnershipCall, groupID, memberID);
      const data = await response.json();

      if (response.ok) {
        setGroupMembers(data.members);
      } else if (
        response.status === 404 &&
        data.code === "transferOwnership/member-not-found"
      ) {
        setGroupMembers(data.members);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      // Error during changing owner of the group
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  return { handleTransferOwnership };
};

export default useTransferOwnership;
