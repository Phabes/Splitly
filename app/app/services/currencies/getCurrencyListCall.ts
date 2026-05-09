export const getCurrencyListCall = (token: string) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  return fetch(`${baseUrl}/currencies`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default getCurrencyListCall;
