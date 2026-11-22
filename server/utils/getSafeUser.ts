import { SafeUser, UserDocument } from "@/types/index.ts";

export const getSafeUser = (user: UserDocument): SafeUser => {
  return user.toJSON() as SafeUser;
};
