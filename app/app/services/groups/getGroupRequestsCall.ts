import { PAGE_SIZE } from "@/app/constants/pagination";

export const getGroupRequestsCall = (
  token: string,
  groupRequestIDs: string[],
) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/groups/requests/search`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      limit: PAGE_SIZE,
      groupRequestIDs,
    }),
  });
};

export default getGroupRequestsCall;
