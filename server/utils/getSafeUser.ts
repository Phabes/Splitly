import { SafeUser, UserDocument } from "@/types/index.ts";

export const getSafeUser = (user: UserDocument): SafeUser => {
  const rawUser = user.toJSON();
  const { password: _password, __v: _version, ...rest } = rawUser;

  return rest as SafeUser;
};
