import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { signupValidator } from "../middlewares/auth.middleware.js";
import handleFormError from "../utils/handleFormError.js";

const router = Router();

router.post("/local/signup", signupValidator, handleFormError, authController.signupLocally);

export default router;