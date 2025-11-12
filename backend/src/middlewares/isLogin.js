import USER from "../models/user.model.js";
import createError from "../utils/createError.js";
import jwt from "jsonwebtoken";

const isLogin = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;

        if (!token){
            throw createError(401, "Unauthorized: No token provided");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRETE);

        const user = await USER.findById(decoded.userId).select("-password");

        if (!user){
            throw createError(404, "User Not Found");
        }

        req.userId = decoded.userId;
        req.email = decoded.email;

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return next(createError(401, "Invalid token"));
        }
        if (error.name === "TokenExpiredError") {
            return next(createError(401, "Token expired"));
        }
        next(error);
    }
}

export default isLogin;