export const getGroupCandidatesCall = (
  token: string,
  query: string,
  friendIDs: string[],
  groupID: string,
) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/groups/candidates`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      friendIDs,
      groupID,
    }),
  });
};

export default getGroupCandidatesCall;
