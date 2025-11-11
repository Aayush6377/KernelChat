import express from "express";
import dotenv from "dotenv";
import createError from "./utils/createError.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const port = process.env.PORT || 3000;
const frontend = process.env.FRONTEND_URL;

const app = express();

app.use(express.json());

app.get("/", (req,res,next) => {
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

app.use((err,req,res,next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ success: false, status, message });
})

if (process.env.NODE_ENV !== "production"){
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

export default app;
