import useChatStore from "../../../store/useChatStore";
import useAuthStore from "../../../store/useAuthStore";
import { images, audios } from "../../../assets/assets";
import { Link } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { logout } from "../../../services/authServices";
import { useMutation } from "@tanstack/react-query";
import { IoVolumeHighSharp, IoVolumeMuteSharp } from "react-icons/io5";
import toast from "react-hot-toast";

const ProfileHeader = () => {
    const { user, setLogout, disconnectSocket } = useAuthStore();
    const {isSoundEnabled, toggleSound} = useChatStore();

    const { mutate: logoutMutate } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            setLogout();
            toast.success("Logout Successful!");
            disconnectSocket();
        },
         onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || "Logout Failed. Please try again.");
        }
    });

    const handleLogout = () => {
        logoutMutate();
    }

    const handleToggleSound = () => {
        const newSoundState = !isSoundEnabled; 
        toggleSound(); 

        if (newSoundState) {
            const mouseClickAudio = audios.mouseClickSound;
            mouseClickAudio.currentTime = 0;
            mouseClickAudio.play().catch((err) => {
                console.error("Failed to play sound:", err);
            });
        }
    }

    return (
        <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="avatar online">
                        <Link to="/user/profile" className="size-14 rounded-full overflow-hidden relative group border-2 border-slate-500">
                            <img src={ user.profilePic ?? images.defaultProfile } alt={ user.fullName } />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs">Profile</span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-slate-200 font-medium text-base truncate">
                            {user.fullName}
                        </h3>
                        <p className="text-slate-400 text-xs">Online</p>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        onClick={handleLogout}
                    >
                        <LuLogOut className="size-5" />
                    </button>

                    <button
                        className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        onClick={handleToggleSound}
                    >
                        {isSoundEnabled ? (
                        <IoVolumeHighSharp className="size-5" />
                        ) : (
                        <IoVolumeMuteSharp className="size-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader;
