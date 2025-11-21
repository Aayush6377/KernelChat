import { useState, useRef } from 'react';
import { MdOutlineClose, MdEdit, MdSave, MdCameraAlt, MdDelete, MdLock, MdVolumeUp } from "react-icons/md";
import { LoaderIcon } from "lucide-react";
import { images } from "../../../assets/assets";
import useAuthStore from "../../../store/useAuthStore";
import useChatStore from "../../../store/useChatStore";
import { useMutation } from "@tanstack/react-query";
import { updateProfile, changePassword, deleteMyAccount } from "../../../services/userServices";
import { logout } from '../../../services/authServices';
import toast from 'react-hot-toast';

const OwnUserProfile = ({ onClose }) => {
    const { user, setUser, setLogout, disconnectSocket } = useAuthStore();
    const { isSoundEnabled, toggleSound } = useChatStore();
    
    const [activeTab, setActiveTab] = useState('profile'); 
    const [isEditingName, setIsEditingName] = useState(false);
    const [name, setName] = useState(user.fullName);
    const [passwords, setPasswords] = useState({ password: "", confirm: "" });
    const fileInputRef = useRef(null);
    const [ formErrors, setFormErrors ] = useState({ password: "", confirm: "" });


    const { mutate: updateProfileMutation, isPending: isUpdating } = useMutation({
        mutationFn: updateProfile,
        onSuccess: (res) => {
            setUser(res.data); 
            toast.success("Profile updated!");
            setIsEditingName(false);
        },
        onError: (err) => toast.error(err?.response?.data?.message || "Failed to update")
    });

    const { mutate: updatePassMutation, isPending: isUpdatingPass } = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            toast.success("Password changed!");
            setPasswords({ password: "", confirm: "" });
        },
        onError: (err) => {
            if (err.response?.data?.errors) {
                setFormErrors(err.response.data.errors);
                toast.error(err.response.data.message);
            }
            else{
                toast.error(err?.response?.data?.message || "Failed to change password")
            }
        }
    });

    const { mutate: deleteAccountMutation, isPending: isDeleting } = useMutation({
        mutationFn: deleteMyAccount,
        onSuccess: () => {
            toast.success("Account deleted.");
            setLogout(); 
            disconnectSocket();
            onClose();
        },
        onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete account")
    });
    

    const { mutate: logoutMutate } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            setLogout();
            toast.success("Logged out");
            disconnectSocket();
            onClose();
        }
    });

    const handleSaveName = () => {
        if (!name.trim()) return;
        updateProfileMutation({ fullName: name });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        updatePassMutation(passwords);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    }

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB");
            return;
        }

        updateProfileMutation({ profilePic: file });
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border-l border-slate-700 h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
                
                <div className="p-4 flex items-center gap-3 border-b border-slate-700 bg-slate-800/50 sticky top-0 z-10">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer">
                        <MdOutlineClose size={24} />
                    </button>
                    <h2 className="text-lg font-semibold text-slate-200">My Profile</h2>
                </div>

                <div className="p-6 space-y-8 flex-1">
                    
                    <div className="flex bg-slate-800/50 p-1 rounded-lg mb-6">
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'profile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'} cursor-pointer`}
                        >
                            Profile Info
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'settings' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'} cursor-pointer`}
                        >
                            Settings
                        </button>
                    </div>

                    {activeTab === 'profile' ? (
                        <>
                            <div className="flex flex-col items-center relative">
                                <div className="relative group cursor-pointer" onClick={handleImageClick}>
                                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-slate-800">
                                        <img 
                                            src={user.profilePic || images.defaultProfile} 
                                            alt="Profile" 
                                            className={`w-full h-full object-cover transition-opacity ${isUpdating ? "opacity-50" : ""}`} 
                                        />
                                    </div>
                                    
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isUpdating ? (
                                            <LoaderIcon className="text-white animate-spin size-8" />
                                        ) : (
                                            <MdCameraAlt className="text-white size-8" />
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Click to change photo</p>
                                
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isUpdating}
                                />
                            </div>

                            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Name</label>
                                    <button 
                                        onClick={() => isEditingName ? handleSaveName() : setIsEditingName(true)}
                                        className="text-cyan-400 hover:text-cyan-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
                                        disabled={isUpdating}
                                    >
                                        {isUpdating && isEditingName ? <LoaderIcon className="animate-spin size-3"/> : (isEditingName ? <><MdSave size={14}/> Save</> : <><MdEdit size={14}/> Edit</>)}
                                    </button>
                                </div>
                                {isEditingName ? (
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                                        autoFocus
                                    />
                                ) : (
                                    <p className="text-slate-200 font-medium">{user.fullName}</p>
                                )}
                            </div>

                            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 opacity-75">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 block">Email Address</label>
                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                    {user.email}
                                </p>
                            </div>
                        </>
                    ) : (

                        <div className="space-y-6">
                            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-700 rounded-lg">
                                        <MdVolumeUp className="text-slate-300 size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-200 font-medium text-sm">Sound Effects</h4>
                                        <p className="text-slate-500 text-xs">Play sounds</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={toggleSound}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${isSoundEnabled ? 'bg-cyan-600' : 'bg-slate-600'} cursor-pointer`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isSoundEnabled ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <MdLock className="text-cyan-400" />
                                    <h4 className="text-slate-200 font-medium text-sm">Change Password</h4>
                                </div>
                                <input 
                                    type="password" 
                                    placeholder="New Password"
                                    name="password"
                                    value={passwords.password}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                                />
                                { formErrors.password && <p className='auth-input-error'>{ formErrors.password }</p>}
                                <input 
                                    type="password" 
                                    placeholder="Confirm New Password"
                                    name="confirm"
                                    value={passwords.confirm}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                                />
                                { formErrors.confirm && <p className='auth-input-error'>{ formErrors.confirm }</p>}
                                <button 
                                    type="submit" 
                                    disabled={isUpdatingPass || !passwords.password || !passwords.confirm}
                                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {isUpdatingPass ? "Updating..." : "Update Password"}
                                </button>
                            </form>

                            <div className="pt-4 border-t border-slate-700/50">
                                <h4 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-3">Danger Zone</h4>
                                
                                <button 
                                    onClick={() => logoutMutate()}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors mb-3 font-medium cursor-pointer"
                                >
                                    Log Out
                                </button>

                                <button 
                                    onClick={() => {
                                        if(window.confirm("Are you sure? This action cannot be undone.")) deleteAccountMutation();
                                    }}
                                    disabled={isDeleting}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors font-medium cursor-pointer"
                                >
                                    {isDeleting ? <LoaderIcon className="animate-spin size-4" /> : <><MdDelete /> Delete Account</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnUserProfile;