import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import USER from "../models/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie?.split("; ").find(row => row.startsWith("jwt=")).split("=")[1];

        if (!token){
            throw createError(401, "Unauthorized: No token provided");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await USER.findById(decoded.userId).select("-password");

        if (!user){
            throw createError(404, "User Not Found");
        }

        socket.user = user;
        socket.userId = user._id;

        next();
    } catch (error) {
        next(error);
    }
}