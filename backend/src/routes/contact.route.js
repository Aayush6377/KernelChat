import { Router } from "express";
import arcjetProtection from "../middlewares/arcjet.middleware.js";
import isLogin from "../middlewares/isLogin.js";
import * as contactController from "../controllers/contact.controller.js";
import { addContactValidator } from "../middlewares/contact.middleware.js";
import handleFormError from "../utils/handleFormError.js";

const router = Router();
router.use(arcjetProtection);
router.use(isLogin);

router.post("/add", addContactValidator, handleFormError, contactController.addContact);
router.get("/list", contactController.getContactList);

export default router;