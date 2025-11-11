import { createWelcomeEmailTemplate } from "../assets/emailTemplates.js";
import USER from "../models/user.model.js";
import createError from "../utils/createError.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

export const signupLocally = async (req,res,next) => {
    try {
        const { fullName, email, password } = req.body;

        const user = new USER({ fullName, email, password });

        await user.save();
        generateToken({ userId: user._id, email }, res);
        res.status(201).json({ success: true, message: "New User created successfully", data: { userId: user._id, email, fullName, profilePic: user.profilePic } });

        try {
            const htmlContent = createWelcomeEmailTemplate(user.fullName);
            await sendEmail(email, "Welcome to KernelChat", htmlContent);
        } catch (emailError) {
            console.error(`Failed to send welcome email to ${email}:`, emailError);
        }
    } catch (error) {
        next(error);
    }
}

export const loginLocally = (req,res,next) => {
    try {
        const user = req.user;

        if (!user){
            throw createError(404, "User Not Found");
        }

        generateToken({ userId: user._id, email: user.email }, res);
        res.status(200).json({ success: true, message: "Login successfully", data: { userId: user._id, email: user.email, fullName: user.fullName, profilePic: user.profilePic } });
    } catch (error) {
        next(error);
    }
}

export const logout = (_,res,next) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
}