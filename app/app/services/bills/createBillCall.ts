import { BillPosition, Currency } from "@/app/types";

export const createBillCall = (
  token: string,
  groupID: string,
  name: string,
  totalAmount: number,
  currency: Currency["code"],
  payerID: string,
  involvedMembers: string[],
  positions: BillPosition[],
) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiPort = process.env.EXPO_PUBLIC_API_PORT;
  const baseUrl = `http://${apiUrl}:${apiPort}`;

  const url = `${baseUrl}/bills`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      groupID,
      name,
      totalAmount,
      currency,
      payerID,
      involvedMembers,
      positions,
    }),
  });
};

export default createBillCall;
