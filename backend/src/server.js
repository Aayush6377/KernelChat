import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import createError from "./utils/createError.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import contactRoutes from "./routes/contact.route.js";

dotenv.config();
const port = process.env.PORT || 3000;
const frontend = process.env.FRONTEND_URL;

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [ "http://localhost:5173" ];

if (frontend) {
    allowedOrigins.push(frontend);
}

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));


app.get("/", (_,res,next) => {
    try {
        if (!frontend){
            throw createError(500, "Frontend URL not specified");
        }
        res.status(200).redirect(frontend);
    } catch (error) {
        next(error);
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contact", contactRoutes);

app.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ success: false, status, message });
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

export default app;
