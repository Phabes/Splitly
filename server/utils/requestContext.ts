import { RequestContextStore } from "@/types/index.ts";
import { AsyncLocalStorage } from "async_hooks";

export const requestContext = new AsyncLocalStorage<RequestContextStore>();

export const getCurrentUserID = (): string | undefined => {
  return requestContext.getStore()?.userID;
};
