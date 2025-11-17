import { useState } from 'react';
import useAuthStore from '../../../store/useAuthStore';
import { loginLocally } from '../../../services/authServices';
import { useMutation } from '@tanstack/react-query';
import BorderAnimatedContainer from '../../../components/BorderAnimatedContainer/BorderAnimatedContainer';
import { images } from '../../../assets/assets.js';
import { BiLogoGmail } from "react-icons/bi";
import { LoaderIcon } from "lucide-react";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const [ formData, setFormData ] = useState({ email: "", password: "" });
    const [ formErrors, setFormErrors ] = useState({ email: "", password: "" });
    const { setLogin } = useAuthStore();

    const { mutate: loginByForm, isPending: isLoggingUpByForm } = useMutation({
        mutationFn: loginLocally,
        onSuccess: (res) => {
            setLogin(res.data);
            toast.success("Login successfully!");
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

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        loginByForm(formData);
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
                                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome Back</h2>
                                    <p className="text-slate-400">Login to access to your account</p>
                                </div>

                                <form onSubmit={handleFormSubmit} className='space-y-6'>
                                    <div>
                                        <label className='auth-input-label'>Email</label>
                                        <div className='relative'>
                                            <BiLogoGmail className='auth-input-icon'/>
                                            <input type="email" name="email" value={formData.email} onChange={handleFormChange} required placeholder='Enter your email address' className='input' />
                                        </div>
                                        { formErrors.email && <p className='auth-input-error'>{ formErrors.email }</p>}
                                    </div>
                                    <div>
                                        <label className='auth-input-label'>Password</label>
                                        <div className='relative'>
                                            <RiLockPasswordLine className='auth-input-icon'/>
                                            <input type="password" name="password" value={formData.password} onChange={handleFormChange} required placeholder='Enter your password' className='input' />
                                        </div>
                                        { formErrors.password && <p className='auth-input-error'>{ formErrors.password }</p>}
                                    </div>

                                    <button type="submit" className='auth-btn' disabled={isLoggingUpByForm}>
                                        { isLoggingUpByForm ? (
                                            <LoaderIcon className="w-full h-5 animate-spin text-center" />
                                        ) : "Log In" }
                                    </button>
                                </form>
                                <div className='my-3 flex justify-end'>
                                    <Link to="/forgot-password" className="text-sm auth-link hover:text-cyan-300">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="my-6 mt-3 flex items-center">
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
                                    <Link to="/signup" className="auth-link">
                                        Don't have an account? Sign Up
                                    </Link>
                                </div>
                            </div>
                        </div>

                        { /* Right Section */ }
                        <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
                            <div>
                                <img
                                src={images.login}
                                alt="People using mobile devices"
                                className="w-full h-auto object-contain"
                                />
                                <div className="mt-6 text-center">
                                <h3 className="text-xl font-medium text-cyan-400">Connect anytime, anywhere</h3>

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

export default Login;
