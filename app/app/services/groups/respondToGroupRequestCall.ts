export const respondToGroupRequestCall = (
  token: string,
  groupRequestID: string,
  decision: "accepted" | "declined",
) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/groups/requests/${groupRequestID}`;

  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ decision }),
  });
};

export default respondToGroupRequestCall;
