import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resetPassword } from '../../../services/authServices'; 
import BorderAnimatedContainer from '../../../components/BorderAnimatedContainer/BorderAnimatedContainer';
import { images } from '../../../assets/assets.js';
import { LoaderIcon } from "lucide-react";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";

const ResetPassword = () => {
    const [formData, setFormData] = useState({ password: "", confirm: "" });
    const [formErrors, setFormErrors] = useState({ password: "", confirm: "" });
    const [successMessage, setSuccessMessage] = useState("");

    const { token } = useParams();
    const navigate = useNavigate();

    const { mutate: doReset, isPending } = useMutation({
        mutationFn: resetPassword,
        onSuccess: (res) => {
            toast.success(res.message);
            setSuccessMessage(res.message);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        },
        onError: (err) => {
            if (err.response?.data?.errors) {
                setFormErrors(err.response.data.errors);
            } else {
                toast.error(err?.response?.data?.message || err.message || "Something went wrong.");
            }
        }
    });

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setFormErrors({ password: "", confirm: "" });
        doReset({ ...formData, token });
    }

    return (
        <div className='w-full flex items-center justify-center p-4 bg-slate-900'>
            <div className='relative w-full max-w-6xl md:min-h-[700px]'>
                <BorderAnimatedContainer>
                    <div className='w-full flex flex-col md:flex-row'>
                        <div className='md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30'>
                            <div className='w-full max-w-md'>
                                <div className="text-center mb-8">
                                    <div className='w-20 h-12 mx-auto text-slate-400 mb-4'>
                                        <img src={images.logo} alt='KernelChat' title='KernelChat' />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Create New Password</h2>
                                    <p className="text-slate-400">Enter your new password below.</p>
                                </div>

                                {!successMessage ? (
                                    <form onSubmit={handleFormSubmit} className='space-y-6'>
                                        <div>
                                            <label className='auth-input-label'>New Password</label>
                                            <div className='relative'>
                                                <RiLockPasswordLine className='auth-input-icon'/>
                                                <input type="password" name="password" value={formData.password} onChange={handleFormChange} required placeholder='Create a password' className='input' />
                                            </div>
                                            { formErrors.password && <p className='auth-input-error'>{ formErrors.password }</p>}
                                        </div>
                                        <div>
                                            <label className='auth-input-label'>Confirm New Password</label>
                                            <div className='relative'>
                                                <RiLockPasswordFill className='auth-input-icon'/>
                                                <input type="password" name="confirm" value={formData.confirm} onChange={handleFormChange} required placeholder='Confirm your password' className='input' />
                                            </div>
                                            { formErrors.confirm && <p className='auth-input-error'>{ formErrors.confirm }</p>}
                                        </div>

                                        <button type="submit" className='auth-btn' disabled={isPending}>
                                            { isPending ? (
                                                <LoaderIcon className="w-full h-5 animate-spin text-center" />
                                            ) : "Set New Password" }
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                        <p className="text-green-400">{successMessage}</p>
                                        <p className="text-slate-300 mt-2">Redirecting you to login...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
                            <div>
                                <img
                                    src={images.resetPassword} 
                                    alt="Reset password"
                                    className="w-full h-auto object-contain"
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

export default ResetPassword;