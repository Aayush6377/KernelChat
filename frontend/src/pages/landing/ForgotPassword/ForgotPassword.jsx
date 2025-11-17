import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import BorderAnimatedContainer from '../../../components/BorderAnimatedContainer/BorderAnimatedContainer';
import { images } from '../../../assets/assets.js';
import { BiLogoGmail } from "react-icons/bi";
import { LoaderIcon } from "lucide-react";
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { sendPasswordResetEmail } from '../../../services/authServices'; 

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const { mutate: requestReset, isPending } = useMutation({
        mutationFn: sendPasswordResetEmail,
        onSuccess: (res) => {
            setSuccessMessage(res.message); 
            setFormError("");
            setEmail(""); 
        },
        onError: (err) => {
            if (err.response?.data?.errors) {
                setFormError(err.response.data.errors.email || "An error occurred.");
            } else {
                toast.error(err?.response?.data?.message || err.message || "Something went wrong.");
            }
            setSuccessMessage("");
        }
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setFormError("");
        setSuccessMessage("");
        requestReset({ email });
    }

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
                                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Forgot Password?</h2>
                                    <p className="text-slate-400">No problem. Enter your email and we'll send you a reset link.</p>
                                </div>

                                {!successMessage ? (
                                    <form onSubmit={handleFormSubmit} className='space-y-6'>
                                        <div>
                                            <label className='auth-input-label'>Email</label>
                                            <div className='relative'>
                                                <BiLogoGmail className='auth-input-icon'/>
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    value={email} 
                                                    onChange={(e) => setEmail(e.target.value)} 
                                                    required 
                                                    placeholder='Enter your email address' 
                                                    className='input' 
                                                />
                                            </div>
                                            { formError && <p className='auth-input-error'>{ formError }</p>}
                                        </div>

                                        <button type="submit" className='auth-btn' disabled={isPending}>
                                            { isPending ? (
                                                <LoaderIcon className="w-full h-5 animate-spin text-center" />
                                            ) : "Send Reset Link" }
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                        <p className="text-green-400">{successMessage}</p>
                                        <p className="text-slate-300 mt-2">Please check your inbox (and spam folder).</p>
                                    </div>
                                )}

                                <div className="mt-6 text-center">
                                    <Link to="/login" className="auth-link">
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
                            <div>
                                <img
                                    src={images.forgotPassword} 
                                    alt="Forgot password"
                                    className="w-100 h-auto object-contain"
                                />
                                <div className="mt-6 text-center">
                                    <h3 className="text-xl font-medium text-cyan-400">Find Your Account</h3>
                                    <p className="text-slate-400 mt-2">We'll help you get back in.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </BorderAnimatedContainer>
            </div>
        </div>
    )
}

export default ForgotPassword;