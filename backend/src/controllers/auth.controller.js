import USER from "../models/user.model.js";
import createError from "../utils/createError.js";
import generateToken from "../utils/generateToken.js";

export const signupLocally = async (req,res,next) => {
    try {
        const { fullName, email, password } = req.body;

        const user = new USER({ fullName, email, password });

        await user.save();
        generateToken({ userId: user._id, email }, res);

        //Email to user

        res.status(201).json({ success: true, message: "New User created successfully", data: { userId: user._id, email, fullName, profilePic: user.profilePic } });
    } catch (error) {
        next(error);
    }
}