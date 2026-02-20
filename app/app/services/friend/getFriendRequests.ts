import { ADD_FRIENDS_PAGE_SIZE } from "@/app/constants/pagination";

export const getFriendRequests = (
  token: string,
  friendRequestIDs: string[],
) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/friend/requests`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      limit: ADD_FRIENDS_PAGE_SIZE,
      friendRequestIDs,
    }),
  });
};

export default getFriendRequests;
