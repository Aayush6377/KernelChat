import api from "./axios";

export const signupLocally = async ({ fullName, email, password, confirm, verifiedToken }) => {
    try {
        const res = await api.post("/api/auth/local/signup", { fullName, email, password, confirm, verifiedToken });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const sendVerificationOtp = async ({ email }) => {
    try {
        const res = await api.post("/api/auth/otp/send", { email });
        return res.data; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const verifyEmailOtp = async ({ email, otp, otpToken }) => {
    try {
        const res = await api.post("/api/auth/otp/verify", { email, otp, otpToken });
        return res.data; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const loginLocally = async ({ email, password }) => {
    try {
        const res = await api.post("/api/auth/local/login", { email, password });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const sendPasswordResetEmail = async ({ email }) => {
    try {
        const res = await api.post("/api/auth/forgot-password", { email });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const resetPassword = async ({ token, password, confirm }) => {
    try {
        const res = await api.post("/api/auth/reset-password", { token, password, confirm });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getProfileDetails = async () => {
    try {
        const res = await api.get("/api/auth/profile/details");
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}