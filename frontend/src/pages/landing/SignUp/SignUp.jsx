import { useEffect, useState } from 'react';
import useAuthStore from '../../../store/useAuthStore';
import { signupLocally, sendVerificationOtp, verifyEmailOtp  } from '../../../services/authServices';
import { useMutation } from '@tanstack/react-query';
import BorderAnimatedContainer from '../../../components/BorderAnimatedContainer/BorderAnimatedContainer';
import OtpInput from '../../../components/OtpInput/OtpInput'
import { images } from '../../../assets/assets.js';
import { FaCheckCircle, FaUser } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { LoaderIcon } from "lucide-react";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import {toast } from 'react-hot-toast';
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
    const [ formData, setFormData ] = useState({ fullName: "", email: "", password: "", confirm: "", verifiedToken: "" });
    const [ formErrors, setFormErrors ] = useState({ fullName: "", email: "", password: "", confirm: "" });
    const { setLogin } = useAuthStore();

    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [timer, setTimer] = useState(0);
    const [otpMessage, setOtpMessage] = useState({ type: '', text: '' });
    const [otpToken, setOtpToken] = useState(null);

    const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
        mutationFn: sendVerificationOtp,
        onSuccess: (res) => {
            toast.success(res.message || "OTP sent to your email!");
            setShowOtpInput(true);
            setTimer(120); 
            setOtpMessage({ type: 'success', text: 'OTP sent! Check your email.' });
            setOtpToken(res.otpToken);
            setIsEmailVerified(false);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to send OTP.');
            setOtpMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to send OTP.' });
        }
    });

    const { mutate: verifyOtp, isPending: isVerifyingOtp } = useMutation({
        mutationFn: verifyEmailOtp,
        onSuccess: (res) => {
            toast.success(res.message || "Email verified successfully!");
            setIsEmailVerified(true);
            setShowOtpInput(false); 
            setOtp("");
            setTimer(0);
            setFormData((prev) => ({ ...prev, verifiedToken: res.verifiedToken }));
            setOtpMessage({ type: 'success', text: 'Email verified! You can now create your account.' });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Invalid or expired OTP.');
            setOtpMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid or expired OTP.' });
            setIsEmailVerified(false);
        }
    });

    const { mutate: signupByForm, isPending: isSigningUpByForm } = useMutation({
        mutationFn: signupLocally,
        onSuccess: (res) => {
            setLogin(res.data);
            toast.success("Account created successfully!");
        },
        onError: (err) => {
            if (err.response?.data?.errors) {
                setFormErrors(err.response.data.errors);
                toast.error(err.response.data.message);
            } else {
                toast.error(err?.response?.data?.message || err.message || "Something went wrong. Please try again.");
            }
        }
    });

    useEffect(() => {
        let interval;
        if (showOtpInput && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [showOtpInput, timer]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });

        if (e.target.name === 'email') {
            setIsEmailVerified(false);
            setShowOtpInput(false);
            setOtp("");
            setTimer(0);
            setOtpMessage({ type: '', text: '' });
        }
    };

    const handleOtpChange = (value) => {
        setOtp(value);
        setOtpMessage({ type: '', text: '' });
    };

    const handleSendOtpClick = () => {
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email to verify.' }));
            return;
        }
        sendOtp({ email: formData.email });
    };

    const handleVerifyOtpClick = () => {
        if (otp.length !== 6) {
            setOtpMessage({ type: 'error', text: 'OTP must be 6 digits.' });
            return;
        }
        verifyOtp({ email: formData.email, otp, otpToken  });
    };

   const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!isEmailVerified) {
            toast.error("Please verify your email before creating an account.");
            return;
        }
        signupByForm(formData);
    };


    return (
        <div className='w-full flex items-center justify-center p-4 bg-slate-900'>
            <div className='relative w-full max-w-6xl md:min-h-[700px]'>
                <BorderAnimatedContainer>
                    <div className='w-full flex flex-col md:flex-row'>
                        { /* Left Section */ }
                        <div className='md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30'>
                            <div className='w-full max-w-md'>
                                <div className="text-center mb-8">
                                    <div className='w-20 h-12 mx-auto text-slate-400 mb-4'>
                                        <img src={images.logo} alt='KernelChat' title='KernelChat' />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Create Account</h2>
                                    <p className="text-slate-400">Sign up for a new account</p>
                                </div>

                                <form onSubmit={handleFormSubmit} className='space-y-6'>
                                    <div>
                                        <label className='auth-input-label'>Full Name</label>
                                        <div className='relative'>
                                            <FaUser className='auth-input-icon'/>
                                            <input type="text" name="fullName" value={formData.fullName} onChange={handleFormChange} required placeholder='Enter your full name' className='input' />
                                        </div>
                                        { formErrors.fullName && <p className='auth-input-error'>{ formErrors.fullName }</p>}
                                    </div>
                                    <div>
                                        <label className='auth-input-label'>Email</label>
                                        <div className='relative'>
                                            <BiLogoGmail className='auth-input-icon'/>
                                            <input 
                                                type="email" 
                                                name="email" 
                                                value={formData.email} 
                                                onChange={handleFormChange} 
                                                required 
                                                placeholder='Enter your email address' 
                                                className='input' 
                                                disabled={isEmailVerified || isSigningUpByForm} 
                                            />
                                        </div>
                                        { formErrors.email && <p className='auth-input-error'>{ formErrors.email }</p>}
                                    </div>

                                    <div className="space-y-3">
                                        {!isEmailVerified ? (
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-slate-400">
                                                    {timer > 0 ? `Resend in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : "Verify your email to continue."}
                                                </p>
                                                <button 
                                                    type="button"
                                                    onClick={handleSendOtpClick}
                                                    disabled={isSendingOtp || timer > 0 || !formData.email}
                                                    className={`text-sm font-medium text-cyan-400 hover:text-cyan-300 disabled:opacity-50 whitespace-nowrap ${(isSendingOtp || timer > 0 || !formData.email) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                >
                                                    {isSendingOtp ? "Sending..." : (showOtpInput ? "Resend OTP" : "Send OTP")}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 text-green-400 p-3 bg-green-500/10 border border-green-500/30 rounded-md">
                                                <FaCheckCircle />
                                                <span>Email Verified Successfully</span>
                                            </div>
                                        )}

                                        {showOtpInput && !isEmailVerified && (
                                            <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                                <label className='auth-input-label text-center block'>Enter Verification Code</label>
                                                <OtpInput value={otp} onChange={handleOtpChange} />
                                                <button 
                                                    type="button" 
                                                    onClick={handleVerifyOtpClick}
                                                    disabled={isVerifyingOtp || otp.length !== 6}
                                                    className="w-full h-11 flex items-center justify-center rounded-md bg-cyan-600 text-white font-medium hover:bg-cyan-500 disabled:opacity-50 disabled:bg-cyan-800 transition-colors cursor-pointer"
                                                >
                                                    {isVerifyingOtp ? <LoaderIcon className="w-5 h-5 animate-spin" /> : "Verify"}
                                                </button>
                                            </div>
                                        )}

                                        {otpMessage.text && !isEmailVerified && (
                                            <p className={`text-sm text-center ${otpMessage.type === 'error' ? 'text-red-500' : 'text-green-400'}`}>
                                                {otpMessage.text}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='auth-input-label'>Password</label>
                                        <div className='relative'>
                                            <RiLockPasswordLine className='auth-input-icon'/>
                                            <input type="password" name="password" value={formData.password} onChange={handleFormChange} required placeholder='Create a password' className='input' />
                                        </div>
                                        { formErrors.password && <p className='auth-input-error'>{ formErrors.password }</p>}
                                    </div>
                                    <div>
                                        <label className='auth-input-label'>Confirm Password</label>
                                        <div className='relative'>
                                            <RiLockPasswordFill className='auth-input-icon'/>
                                            <input type="password" name="confirm" value={formData.confirm} onChange={handleFormChange} required placeholder='Confirm your password' className='input' />
                                        </div>
                                        { formErrors.confirm && <p className='auth-input-error'>{ formErrors.confirm }</p>}
                                    </div>

                                    <button 
                                        type="submit" 
                                        className='auth-btn' 
                                        disabled={isSigningUpByForm || !isEmailVerified} 
                                    >
                                        { isSigningUpByForm ? (
                                            <LoaderIcon className="w-full h-5 animate-spin text-center" />
                                        ) : "Create Account" }
                                    </button>
                                </form>
                                <div className="my-6 flex items-center">
                                    <div className="flex-grow border-t border-slate-600/30"></div>
                                    <span className="mx-4 flex-shrink text-sm text-slate-400">OR</span>
                                    <div className="flex-grow border-t border-slate-600/30"></div>
                                </div>
                                <a 
                                    href={`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`} 
                                    className='w-full h-12 flex items-center justify-center gap-3 bg-slate-800 border border-slate-600/50 rounded-lg text-slate-200 font-medium hover:bg-slate-700 transition-colors duration-200'
                                    aria-label="Sign up with Google"
                                >
                                    <FcGoogle className="h-5 w-5" />
                                    <span>Continue with Google</span>
                                </a>
                                <div className="mt-6 text-center">
                                    <Link to="/login" className="auth-link">
                                        Already have an account? Login
                                    </Link>
                                </div>
                            </div>
                        </div>

                        { /* Right Section */ }
                        <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
                            <div>
                                <img
                                src={images.signup}
                                alt="People using mobile devices"
                                className="w-full h-auto object-contain"
                                />
                                <div className="mt-6 text-center">
                                <h3 className="text-xl font-medium text-cyan-400">Start Your Journey Today</h3>

                                <div className="mt-4 flex justify-center gap-4">
                                    <span className="auth-badge">Free</span>
                                    <span className="auth-badge">Easy Setup</span>
                                    <span className="auth-badge">Private</span>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BorderAnimatedContainer>
            </div>
        </div>
    )
}

export default SignUp;
