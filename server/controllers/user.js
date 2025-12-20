import jwt from "jsonwebtoken";
import User from "../models/user.js";
import signUpValidator from "../validators/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const signUp = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const validationError = await signUpValidator(email, username);

    if (validationError) {
      return res.status(400).json(validationError);
    }

    const newUser = new User({ email, username, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1m",
    });

    return res.status(201).json({
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default signUp;
