import {
  useAuthenticatedApi,
  useGroupContext,
  useLoadingContext,
  useTranslations,
} from "@/app/hooks";
import { updateMemberRoleCall } from "@/app/services";
import { UserGroupRole } from "@/app/types";

export const useUpdateMemberRole = () => {
  const translations = useTranslations();
  const { showLoading, hideLoading } = useLoadingContext();
  const request = useAuthenticatedApi();
  const { groupID, setGroupMembers } = useGroupContext();

  const handleUpdateMemberRole = async (
    memberID: string,
    newRole: Omit<UserGroupRole, "owner">,
  ) => {
    if (!groupID) {
      return;
    }

    showLoading(translations["updatingRole"]);

    try {
      const response = await request(
        updateMemberRoleCall,
        groupID,
        memberID,
        newRole,
      );
      const data = await response.json();

      if (response.ok) {
        setGroupMembers(data.members);
      } else if (
        response.status === 404 &&
        data.code === "updateRole/member-not-found"
      ) {
        setGroupMembers(data.members);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      // Error during updating member role
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  return { handleUpdateMemberRole };
};

export default useUpdateMemberRole;
