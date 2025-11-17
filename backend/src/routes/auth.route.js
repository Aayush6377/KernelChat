import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { signupValidator, loginValidator, updateProfileValidator, resetPasswordValidator } from "../middlewares/auth.middleware.js";
import handleFormError from "../utils/handleFormError.js";
import isLogin from "../middlewares/isLogin.js";
import uploader from "../middlewares/upload.js";
import arcjetProtection from "../middlewares/arcjet.middleware.js";
import passport from "passport";

const router = Router();
router.use(arcjetProtection);

//Authentication
router.post("/local/signup", signupValidator, handleFormError, authController.signupLocally);
router.post("/local/login", loginValidator, handleFormError, authController.loginLocally);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get('/google/callback', passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }), authController.authByGoogle);

//Otp System
router.post("/otp/send", authController.sendVerificationOtp);
router.post("/otp/verify", authController.verifyEmailOtp);

//Reset password
router.post("/forgot-password", authController.sendPasswordResetEmail);
router.post("/reset-password", resetPasswordValidator, handleFormError, authController.resetPassword);

router.use(isLogin);

router.patch("/profile/update", uploader.single("profilePic"), updateProfileValidator, handleFormError, authController.updateProfile);
router.get("/profile/details", authController.getProfileDetails);

router.post("/logout", authController.logout);

export default router;