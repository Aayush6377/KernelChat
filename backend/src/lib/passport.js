import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import USER from "../models/user.model.js";
import { createWelcomeEmailTemplate } from "../assets/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ["profile", "email"],
    proxy: true
}, 
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await USER.findOne({ googleAuthId: profile.id });

        if (user){
            return done(null, user);
        }

        user = await USER.findOne({ email: profile.emails[0].value });

        if (user){
            user.googleAuthId = profile.id;
            user.authProvider = "google";
            if (!user.profilePic){
                user.profilePic = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
        }

        const newUser = new USER({
            googleAuthId: profile.id,
            email: profile.emails[0].value,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value,
            authProvider: "google"
        });

        await newUser.save();

        try {
            const htmlContent = createWelcomeEmailTemplate(newUser.fullName);
            await sendEmail(newUser.email, "Welcome to KernelChat", htmlContent);
        } catch (emailError) {
            console.error(`Failed to send welcome email to ${email}:`, emailError);
        }

        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await USER.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});