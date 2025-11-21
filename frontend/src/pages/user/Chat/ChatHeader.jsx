import useChatStore from "../../../store/useChatStore";
import { images } from "../../../assets/assets";
import { useEffect, useState, useRef } from "react";
import useAuthStore from "../../../store/useAuthStore";
import { MdOutlineClose, MdMoreVert, MdPersonAdd, MdBlock, MdStar, MdStarBorder, MdPerson } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CgUnblock } from "react-icons/cg";
import { addContactById, toggleBlock, toggleFavorite } from "../../../services/userServices";
import ContactProfile from "../ContactProfile/ContactProfile";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const [showProfile, setShowProfile] = useState(false);
    const { onlineUsers } = useAuthStore();
    const [ headerStates, setHeaderStates ] = useState({ 
        isContact: selectedUser.isContact,
        isFavorite: selectedUser.isFavorite,
        isBlocked: selectedUser.isBlocked
     });

    const queryClient = useQueryClient();

    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setSelectedUser(null);
        }
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [setSelectedUser]);


    const { mutate: toggleFav } = useMutation({
        mutationFn: () => toggleFavorite(selectedUser.userId),
        onSuccess: (res) => {
            toast.success(res.message || "Favorites updated");
            queryClient.invalidateQueries(['chatList']);
            setHeaderStates(prev => ({...prev, isFavorite: res.isFavorite}));
        },
        onError: () => toast.error("Failed to update favorite")
    });

    const { mutate: toggleBlk } = useMutation({
        mutationFn: () => toggleBlock(selectedUser.userId),
        onSuccess: (res) => {
            toast.success(res.message ||"Block status updated");
            queryClient.invalidateQueries(['chatList']);
            setHeaderStates(prev => ({...prev, isBlocked: res.isBlocked}));
        },
        onError: () => toast.error("Failed to update block status")
    });

    const { mutate: addToContacts } = useMutation({
        mutationFn: () => addContactById(selectedUser.userId),
        onSuccess: () => {
            toast.success("Added to contacts");
            queryClient.invalidateQueries(['chatList']);
            setHeaderStates(prev => ({...prev, isContact: true}));
        },
        onError: () => toast.error("Failed to add contact")
    });

    const handleAction = (action) => {
        setShowMenu(false);
        switch(action) {
            case 'view_profile':
                setShowProfile(true);
                break;
            case 'favorite':
                toggleFav();
                break;
            case 'block':
                toggleBlk();
                break;
            case 'add_contact':
                addToContacts();
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 h-20 px-6 flex-shrink-0 relative z-20">
            
            {/* Left: User Info */}
            <div className="flex items-center space-x-3">
                <button onClick={() => setShowProfile(true)} className={`avatar ${onlineUsers.includes(selectedUser.userId) ? 'avatar-online' : ''} cursor-pointer`}>
                    <div className="w-12 rounded-full border border-slate-600">
                        <img src={selectedUser.profilePic || images.defaultProfile} alt={ selectedUser.name } />
                    </div>
                </button>

                <div>
                    <h3 onClick={() => setShowProfile(true)} className="text-slate-200 font-medium text-lg cursor-pointer hover:text-cyan-400">{selectedUser.name}</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                        {onlineUsers.includes(selectedUser.userId) ? (
                            <span className="text-green-400">Online</span>
                        ) : "Offline"}
                        {selectedUser.isFavorite && <MdStar className="text-yellow-400" />}
                    </p>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
            
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors cursor-pointer"
                    >
                        <MdMoreVert className="w-6 h-6" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-10 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-100 origin-top-right">
                            
                            <button 
                                onClick={() => handleAction('view_profile')}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white text-left transition-colors cursor-pointer"
                            >
                                <MdPerson className="size-4" /> View Profile
                            </button>

                            {headerStates.isContact ? (
                                <>
                                    <button 
                                        onClick={() => handleAction('favorite')}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white text-left transition-colors cursor-pointer"
                                    >
                                        {headerStates.isFavorite ? (
                                            <><MdStarBorder className="size-4" /> Remove Favorite</>
                                        ) : (
                                            <><MdStar className="size-4" /> Add to Favorites</>
                                        )}
                                    </button>
                                    
                                    <div className="border-t border-slate-700/50 my-1"></div>
                                    
                                    <button 
                                        onClick={() => handleAction('block')}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 text-left transition-colors cursor-pointer"
                                    >
                                        {headerStates.isBlocked ? (
                                            <><CgUnblock className="size-4" /> Unblock Contact</>
                                        ) : (
                                            <><MdBlock className="size-4" /> Block Contact</>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="border-t border-slate-700/50 my-1"></div>
                                    <button 
                                        onClick={() => handleAction('add_contact')}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-cyan-400 hover:bg-cyan-500/10 text-left transition-colors cursor-pointer"
                                    >
                                        <MdPersonAdd className="size-4" /> Add to Contacts
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <button onClick={() => setSelectedUser(null)} className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <MdOutlineClose className="w-6 h-6" />
                </button>
            </div>

            {showProfile && (
                <ContactProfile onClose={() => setShowProfile(false)} />
            )}
        </div>
    )
}

export default ChatHeader;
