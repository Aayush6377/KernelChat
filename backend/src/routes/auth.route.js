import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { signupValidator, loginValidator } from "../middlewares/auth.middleware.js";
import handleFormError from "../utils/handleFormError.js";

const router = Router();

router.post("/local/signup", signupValidator, handleFormError, authController.signupLocally);
router.post("/local/login", loginValidator, handleFormError, authController.loginLocally);
router.post("/logout", authController.logout);

export default router;