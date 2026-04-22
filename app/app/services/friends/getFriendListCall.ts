import { PAGE_SIZE } from "@/app/constants/pagination";

export const getFriendListCall = (
  token: string,
  friendIDs: string[] = [],
  query: string = "",
) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  return fetch(`${baseUrl}/friends/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, limit: PAGE_SIZE, friendIDs }),
  });
};

export default getFriendListCall;
