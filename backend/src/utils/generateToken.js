import jwt from "jsonwebtoken";

const generateToken = (payload, res) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie('jwt', token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
}

export default generateToken;