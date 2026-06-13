import User from "@/models/user.ts";

// User model automatically deletes "password" and "__v" when "toJSON" method is called
export const getSafeUser = (user: InstanceType<typeof User>) => {
  return user.toJSON();
};
