import { PAGE_SIZE } from "@/app/constants/pagination";

export const getAddFriendList = (
  token: string,
  query: string,
  userIDs: string[],
) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/friends/suggestions/search`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      limit: PAGE_SIZE,
      userIDs,
    }),
  });
};

export default getAddFriendList;
