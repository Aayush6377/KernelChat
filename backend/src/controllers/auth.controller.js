import { createOtpEmailTemplate, createPasswordResetTemplate, createWelcomeEmailTemplate } from "../assets/emailTemplates.js";
import USER from "../models/user.model.js";
import createError from "../utils/createError.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "../lib/cloudinary.js";
import fs from 'fs';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const signupLocally = async (req,res,next) => {
    try {
        const { fullName, email, password, verifiedToken } = req.body;

        const decoded = jwt.verify(verifiedToken, process.env.JWT_SECRETE);

        if (!decoded.isVerified || decoded.email !== email) {
            throw createError(400, "Email verification failed.");
        }

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

export const authByGoogle = (req,res) => {
    const user = req.user;

    generateToken({ userId: user._id, email: user.email }, res);

    res.redirect(process.env.FRONTEND_URL);
}

export const sendVerificationOtp = async (req,res,next) => {
    try {
        const { email } = req.body;

        const existingUser = await USER.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered. Please login.",
                errors: { email: "Email already exists" }
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp,12);

        const otpToken = jwt.sign({ email, hashedOtp }, process.env.JWT_SECRETE, { expiresIn: "5m" });

        try {
            const htmlContent = createOtpEmailTemplate(otp);
            await sendEmail(email, "Your Verification Code", htmlContent);
        } catch (emailError) {
            console.error(`Failed to send OTP email to ${email}:`, emailError);
            return next(createError(500, "Failed to send OTP email."));
        }

        res.status(200).json({ 
            success: true, 
            message: "OTP sent to your email. It will expire in 10 minutes.",
            otpToken: otpToken 
        });
    } catch (error) {
        next(error);
    }
}

export const verifyEmailOtp = async (req,res,next) => {
    try {
        const { otp, otpToken } = req.body;
        
        const decoded = jwt.verify(otpToken, process.env.JWT_SECRETE);

        const { email, hashedOtp } = decoded;
        const isMatch = await bcrypt.compare(otp, hashedOtp);

        if (!isMatch) {
            throw createError(400, "Invalid OTP. Please try again.");
        }

        const verifiedToken = jwt.sign( { email, isVerified: true }, process.env.JWT_SECRETE, { expiresIn: '5m' } );

        res.status(200).json({ 
            success: true, 
            message: "Email verified successfully.",
            verifiedToken: verifiedToken 
        });

    } catch (error) {
        next(error);
    }
}

export const sendPasswordResetEmail = async (req,res,next) => {
    try {
        const { email } = req.body;

        const user = await USER.findOne({ email });
        if (!user){
            res.status(200).json({ success: true, message: "If an account with this email exists, a password reset link has been sent." });
        }

        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRETE, { expiresIn: "5m" });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        try {
            const htmlContent = createPasswordResetTemplate(user.fullName, resetUrl);
            await sendEmail(email, "Reset Your KernelChat Password", htmlContent);
        } catch (emailError) {
            console.error(`Failed to send reset email to ${email}:`, emailError);
            return next(createError(500, "Failed to send email."));
        }

        res.status(200).json({ success: true, message: "If an account with this email exists, a password reset link has been sent." });
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req,res,next) => {
    try {
        const { token, password } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRETE);

        const user = await USER.findById(decoded.userId);
        if (!user){
            throw createError(404, "User not found");
        }

        user.password = password;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully!" });

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

export const updateProfile = async (req,res,next) => {
    try {
        const { fullName } = req.body;
        const userId = req.userId;

        const user = await USER.findById(userId);

        if (fullName) user.fullName = fullName;

        if (req.file){
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, { folder: "KernelChat", resource_type: "image" });

            if (user.profilePic_public_id){
                await cloudinary.uploader.destroy(user.profilePic_public_id);
            }

            user.profilePic = uploadResponse.secure_url;
            user.profilePic_public_id = uploadResponse.public_id;

            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting temp file:", err);
            });
        }

        await user.save();
        res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        next(error);
    }
}

export const getProfileDetails = async (req,res,next) => {
    try {
        const userId = req.userId;

        const user = await USER.findById(userId).select("-password");

        res.status(200).json({ success: true, data: { userId: user._id, email: user.email, fullName: user.fullName, profilePic: user.profilePic } });
    } catch (error) {
        next(error);
    }
}