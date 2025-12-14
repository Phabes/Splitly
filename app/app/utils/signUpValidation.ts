import { TranslationKeys } from "../constants/translations";

type ValidationResult = TranslationKeys | undefined;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_PASSWORD_LENGTH = 6;
const REQUIREMENT_COUNT = 3;

const PASSWORD_CHARACTERISTICS = [
  { regex: /[a-z]/, message: "a lowercase letter" },
  { regex: /[A-Z]/, message: "an uppercase letter" },
  { regex: /[0-9]/, message: "a number" },
  {
    regex: /[^A-Za-z0-9]/,
    message: "a special character (e.g., !@#$%^&*)",
  },
];

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return "fieldRequired";
  }
  if (!EMAIL_REGEX.test(email.toLowerCase())) {
    return "notValidEmail";
  }
  return undefined;
};

export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return "fieldRequired";
  }
  return undefined;
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return "fieldRequired";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return "tooShortPassword";
  }

  let passedChecks = 0;
  let failedMessages: string[] = [];

  PASSWORD_CHARACTERISTICS.forEach((check) => {
    if (check.regex.test(password)) {
      passedChecks++;
    } else {
      failedMessages.push(check.message);
    }
  });

  if (passedChecks < REQUIREMENT_COUNT) {
    return "weakPassword";
  }

  return undefined;
};

export const validateRepeatedPassword = (
  password: string,
  repeatedPassword: string
): ValidationResult => {
  if (!repeatedPassword) {
    return "confirmPassword";
  }
  if (repeatedPassword !== password) {
    return "matchPasswords";
  }
  return undefined;
};

export default function Index() {
  return null;
}
