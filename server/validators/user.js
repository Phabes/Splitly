import User from "../models/user.js";

const signUpValidator = async (email, username) => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return { field: "email", error: "exist" };
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return { field: "username", error: "exist" };
  }

  return null;
};

export default signUpValidator;
