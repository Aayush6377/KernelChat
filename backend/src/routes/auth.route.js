import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { signupValidator, loginValidator, updateProfileValidator } from "../middlewares/auth.middleware.js";
import handleFormError from "../utils/handleFormError.js";
import isLogin from "../middlewares/isLogin.js";
import uploader from "../middlewares/upload.js";

const router = Router();

router.post("/local/signup", signupValidator, handleFormError, authController.signupLocally);
router.post("/local/login", loginValidator, handleFormError, authController.loginLocally);

router.use(isLogin);

router.patch("/profile/update", uploader, updateProfileValidator, handleFormError, authController.updateProfile);
router.get("/profile/details", authController.getProfileDetails);

router.post("/logout", authController.logout);

export default router;