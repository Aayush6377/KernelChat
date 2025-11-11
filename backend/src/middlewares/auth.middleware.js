import { body } from "express-validator";
import USER from "../models/user.model.js";

export const signupValidator = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full Name is required"),

  body("email")
    .trim()
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
