import { createOtpEmailTemplate, createPasswordResetTemplate, createWelcomeEmailTemplate } from "../assets/emailTemplates.js";
import USER from "../models/user.model.js";
import MESSAGE from "../models/message.model.js";
import CONTACT from "../models/contact.model.js";
import CONVERSATION from "../models/conversation.model.js";
import createError from "../utils/createError.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "../lib/cloudinary.js";
import fs from 'fs';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

function generateAvatarUrl(name) {
    const colors = [ "3B82F6", "10B981", "EF4444", "F59E0B", "8B5CF6", "EC4899", "14B8A6", "F97316", "6366F1", 
        "84CC16", "D946EF", "0EA5E9", "A855F7", "06B6D4", "F43F5E"
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const encodedName = encodeURIComponent(name.trim());

    return `https://ui-avatars.com/api/?name=${encodedName}&background=${randomColor}&color=fff&size=256`;
}


export const signupLocally = async (req,res,next) => {
    try {
        const { fullName, email, password, verifiedToken } = req.body;

        const decoded = jwt.verify(verifiedToken, process.env.JWT_SECRET);

        if (!decoded.isVerified || decoded.email !== email) {
            throw createError(400, "Email verification failed.");
        }

        const profilePic = generateAvatarUrl(fullName);
        const user = new USER({ fullName, email, password, profilePic });

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

        const otpToken = jwt.sign({ email, hashedOtp }, process.env.JWT_SECRET, { expiresIn: "5m" });

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
        
        const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

        const { email, hashedOtp } = decoded;
        const isMatch = await bcrypt.compare(otp, hashedOtp);

        if (!isMatch) {
            throw createError(400, "Invalid OTP. Please try again.");
        }

        const verifiedToken = jwt.sign( { email, isVerified: true }, process.env.JWT_SECRET, { expiresIn: '5m' } );

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

        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "5m" });
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

export const updatePassword = async (req,res,next) => {
    try {
        const { password } = req.body;
        const userId = req.userId;

        const user = await USER.findById(userId);
        if (!user){
            throw createError(404, "User not found");
        }

        user.password = password; 
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
}

export const updateProfile = async (req,res,next) => {
    try {
        const { fullName } = req.body;
        const userId = req.userId;

        const user = await USER.findById(userId);

        if (fullName){
            user.fullName = fullName;
            if (!user.profilePic_public_id){
                user.profilePic = generateAvatarUrl(fullName);
            }
        }

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
        res.status(200).json({ success: true, message: "Profile updated successfully", data: { userId: user._id, email: user.email, fullName: user.fullName, profilePic: user.profilePic } });
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

export const deleteAccount = async (req, res, next) => {
    try {
        const userId = req.userId;

        const user = await USER.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const deletePromises = [];

        if (user.profilePic_public_id) {
            deletePromises.push(cloudinary.uploader.destroy(user.profilePic_public_id));
        }

        const userMessages = await MESSAGE.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        });

        const messageImageIds = userMessages.map((msg) => msg.imagePublicId).filter((id) => id); 

        messageImageIds.forEach((publicId) => {
            deletePromises.push(cloudinary.uploader.destroy(publicId));
        });

        if (deletePromises.length > 0) {
            await Promise.all(deletePromises);
        }

        await Promise.all([
            USER.findByIdAndDelete(userId),

            MESSAGE.deleteMany({ 
                $or: [{ senderId: userId }, { receiverId: userId }] 
            }),

            CONVERSATION.deleteMany({ 
                participants: userId 
            }),

            CONTACT.deleteMany({ 
                $or: [{ owner: userId }, { contact: userId }] 
            })
        ]);

        res.status(200).json({ success: true, message: "Account and all data deleted successfully" });

    } catch (error) {
        console.error("Error deleting account:", error);
        next(error);
    }
};