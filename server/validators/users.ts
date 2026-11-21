import bcrypt from "bcrypt";
import User from "@/models/user.ts";
import { getSafeUser } from "@/utils/getSafeUser.ts";
import {
  FieldValidationError,
  SignInValidationResult,
  UserDocument,
} from "@/types/index.ts";

export const signUpValidator = async (
  email: string,
  username: string,
): Promise<FieldValidationError[]> => {
  const validationErrors: FieldValidationError[] = [];

  const existingEmail: UserDocument | null = await User.findOne({ email });
  if (existingEmail) {
    validationErrors.push({
      field: "email",
      code: "emailTaken",
      message: "Email already registered.",
    });
  }

  const existingUsername: UserDocument | null = await User.findOne({
    username,
  });
  if (existingUsername) {
    validationErrors.push({
      field: "username",
      code: "usernameTaken",
      message: "Username taken.",
    });
  }

  return validationErrors;
};

export const signInValidator = async (
  username: string,
  password: string,
): Promise<SignInValidationResult> => {
  const validationErrors: FieldValidationError[] = [];

  const user: UserDocument | null = await User.findOne({ username });
  if (!user) {
    validationErrors.push({
      field: "username",
      code: "userNotFound",
      message: "No account found with this username.",
    });

    return { validationErrors, user: null };
  }

  const isMatch: boolean = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    validationErrors.push({
      field: "password",
      code: "invalidPassword",
      message: "Incorrect password.",
    });
  }

  const safeUser = getSafeUser(user);

  return { validationErrors, user: safeUser };
};

export default { signUpValidator, signInValidator };
