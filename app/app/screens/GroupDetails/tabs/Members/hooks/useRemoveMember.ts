import {
  useAppNavigation,
  useAuthenticatedApi,
  useGroupContext,
  useLoadingContext,
  useTranslations,
} from "@/app/hooks";
import { removeGroupMemberCall } from "@/app/services";
import {
  GroupMembersResponse,
  RemoveMemberResponse,
  ResponseMessage,
} from "@/app/types";

export const useRemoveMember = () => {
  const translations = useTranslations();
  const { showLoading, hideLoading } = useLoadingContext();
  const request = useAuthenticatedApi();
  const navigation = useAppNavigation();

  const { groupID, setGroupMembers } = useGroupContext();

  const handleRemoveMember = async (memberID: string, isMe: boolean) => {
    const loadingTitle = isMe ? "leavingTheGroup" : "removingMember";
    showLoading(translations[loadingTitle]);

    try {
      const response = await request(removeGroupMemberCall, groupID, memberID);

      if (response.ok) {
        const data: RemoveMemberResponse = await response.json();

        if (data.isSelfLeave) {
          navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          });
        }

        setGroupMembers(data.members);
      } else if (response.status === 404) {
        const data: GroupMembersResponse = await response.json();

        if (data.code === "removeMember/member-not-found") {
          setGroupMembers(data.members);
        } else {
          throw new Error(data.message);
        }
      } else {
        const data: ResponseMessage = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      // Error during removing member
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  return { handleRemoveMember };
};

export default useRemoveMember;
