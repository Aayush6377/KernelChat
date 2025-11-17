import { body } from "express-validator";
import USER from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signupValidator = [
  body("fullName").trim()
  .notEmpty().withMessage("Full Name is required"),

  body("email").trim()
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Email is not in proper format")
  .custom(async(value) => {
      const user = await USER.findOne({ email: value });

      if (user){
          return Promise.reject("Email already exists");
      }

      return true;
  }),

  body("password")
  .notEmpty().withMessage("Password is required")
  .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  .isStrongPassword().withMessage("Password must include uppercase, lowercase, number, and special character"),

  body("confirm")
  .notEmpty().withMessage("Confirm Password is required")
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password and Confirm Password do not match");
    }
    return true;
  })
];

export const loginValidator = [
  body("email").trim()
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Email is not in proper format")
  .custom(async(value, { req }) => {
      const user = await USER.findOne({ email: value });

      if (!user){
          return Promise.reject("Email not registered, please signup");
      }

      req.user = user;
      return true;
  }),

  body("password")
  .notEmpty().withMessage("Password is required")
  .custom(async (value, { req }) => {
    const user = req.user;
    if (!user){
        return Promise.reject("Email not registered, please signup");
    }

    const password = user.password;

    if (!password){
      return Promise.reject("No password set. Log in with Google");
    }

    const isMatch = await bcrypt.compare(value,password);
    if (!isMatch) {
      return Promise.reject("Incorrect password");
    }

    return true;
  }),
];

export const updateProfileValidator = [
  body("fullName").trim().optional()
  .notEmpty().withMessage("Full Name is required")
];

export const resetPasswordValidator = [
  body("password")
  .notEmpty().withMessage("Password is required")
  .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  .isStrongPassword().withMessage("Password must include uppercase, lowercase, number, and special character"),

  body("confirm")
  .notEmpty().withMessage("Confirm Password is required")
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password and Confirm Password do not match");
    }
    return true;
  })
];