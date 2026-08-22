export const editGroupCall = (
  token: string,
  groupID: string,
  name: string,
  description: string,
  currency: string,
  icon: string,
) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/groups/${groupID}`;

  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description, currency, icon }),
  });
};

export default editGroupCall;
