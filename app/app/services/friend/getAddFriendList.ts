import { ADD_FRIENDS_PAGE_SIZE } from "@/app/constants/pagination";

export const getAddFriendList = (
  token: string,
  query: string,
  // pageNum: number,
  userIDs: string[],
) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/friend/possible`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      limit: ADD_FRIENDS_PAGE_SIZE,
      userIDs,
    }),
  });
};

export default getAddFriendList;
