import { body } from "express-validator";
import USER from "../models/user.model.js";
import CONTACT from "../models/contact.model.js";

export const addContactValidator = [
    body("email").trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is not in proper format")
    .custom(async(value, { req }) => {
        const user = await USER.findOne({ email: value });

        if (!user){
            return Promise.reject("No user registered with that email");
        }

        const ownerId = req.userId;
        const userToContactId = user._id;
        req.userToContactId = user._id;

        const contact = await CONTACT.findOne({ owner: ownerId, contact: userToContactId });

        if (contact){
            return Promise.reject("This person is already in your contacts");
        }

        return true;
    }),

    body("nickname").trim()
    .notEmpty().withMessage("Nickname is required"),

    body("notes").optional().trim()
];