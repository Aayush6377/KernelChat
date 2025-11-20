import { Router } from "express";
import arcjetProtection from "../middlewares/arcjet.middleware.js";
import isLogin from "../middlewares/isLogin.js";
import * as messageController from "../controllers/message.controller.js";
import uploader from "../middlewares/upload.js";

const router = Router();
router.use(arcjetProtection, isLogin);

router.get("/chat/:userToChatId", messageController.getMessagesByUserId);
router.get("/chats/list", messageController.getChatPartners);

router.post("/send/:receiverId", uploader.single("image"), messageController.sendMessage);
router.delete("/delete/:messageId", messageController.deleteMessage);
router.put("/edit/:messageId", messageController.editMessage);

export default router;