import bcrypt from "bcrypt";
import User from "models/user";

export const signUpValidator = async (email: string, username: string) => {
  const validationErrors = [];
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    validationErrors.push({
      field: "email",
      code: "emailTaken",
      message: "Email already registered.",
    });
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    validationErrors.push({
      field: "username",
      code: "usernameTaken",
      message: "Username taken.",
    });
  }

  return validationErrors;
};

export const signInValidator = async (username: string, password: string) => {
  const validationErrors = [];
  const user = await User.findOne({ username });

  if (!user) {
    validationErrors.push({
      field: "username",
      code: "userNotFound",
      message: "No account found with this username.",
    });
    return { validationErrors, user };
  }

  const isMatch = await bcrypt.compare(password, user.password as string);
  if (!isMatch) {
    validationErrors.push({
      field: "password",
      code: "invalidPassword",
      message: "Incorrect password.",
    });
  }

  return { validationErrors, user };
};

export default { signUpValidator, signInValidator };
