export const transferOwnershipCall = async (
  token: string,
  groupID: string,
  memberID: string,
): Promise<Response> => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/groups/${groupID}/members/${memberID}/transfer-ownership`;

  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export default transferOwnershipCall;
