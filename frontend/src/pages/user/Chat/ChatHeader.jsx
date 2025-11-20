import useChatStore from "../../../store/useChatStore";
import { images } from "../../../assets/assets";
import { MdOutlineClose } from "react-icons/md";
import { useEffect } from "react";
import useAuthStore from "../../../store/useAuthStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setSelectedUser(null);
            }
        }
        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('keydown', handleEscape);
        }
    }, [setSelectedUser]);

    return (
        <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
            <div className="flex items-center space-x-3">
                <div className={`avatar ${onlineUsers.includes(selectedUser.userId) ? 'avatar-online' : ''}`}>
                    <div className="w-12 rounded-full ">
                        <img src={selectedUser.profilePic || images.defaultProfile} alt={ selectedUser.name } />
                    </div>
                </div>

                <div>
                    <h3 className="text-slate-200 font-medium">{selectedUser.name}</h3>
                     <p className="text-slate-400 text-sm">{onlineUsers.includes(selectedUser.userId) ? "Online" : "Offline"}</p>
                </div>
            </div>

            <button onClick={() => setSelectedUser(null)}>
                <MdOutlineClose className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
            </button>
        </div>
    )
}

export default ChatHeader;
