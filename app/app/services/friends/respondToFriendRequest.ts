export const respondToFriendRequest = (
  token: string,
  friendRequestID: string,
  decision: "accepted" | "rejected",
) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/friends/requests/${friendRequestID}`;

  return fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      decision,
    }),
  });
};

export default respondToFriendRequest;
