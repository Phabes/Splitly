import { UserGroupRole } from "@/app/types";

export const updateMemberRoleCall = (
  token: string,
  groupID: string,
  memberID: string,
  newRole: Omit<UserGroupRole, "owner">,
): Promise<Response> => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/groups/${groupID}/members/${memberID}/role`;

  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newRole }),
  });
};

export default updateMemberRoleCall;
