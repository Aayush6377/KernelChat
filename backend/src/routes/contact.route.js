import { Router } from "express";
import arcjetProtection from "../middlewares/arcjet.middleware.js";
import isLogin from "../middlewares/isLogin.js";
import * as contactController from "../controllers/contact.controller.js";
import { addContactByEmailValidator } from "../middlewares/contact.middleware.js";
import handleFormError from "../utils/handleFormError.js";

const router = Router();
router.use(arcjetProtection);
router.use(isLogin);

router.get("/:contactId", contactController.getContactDetails);
router.post("/add/email", addContactByEmailValidator, handleFormError, contactController.addContactByEmail);
router.post("/add/id", contactController.addContactById);
router.put("/update/:contactId", contactController.updateContactDetails);
router.delete("/delete/:contactId", contactController.deleteContact);

router.put("/favorite/:userToAddId", contactController.toggleFavorite);
router.put("/block/:userToAddId", contactController.toggleBlock);

export default router;