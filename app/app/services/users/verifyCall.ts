export const verifyCall = (token: string) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/users/verification`;

  return fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default verifyCall;
