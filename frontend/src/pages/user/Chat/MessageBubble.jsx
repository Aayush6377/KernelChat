import { useState, useRef, useEffect } from "react";
import useChatStore from "../../../store/useChatStore";
import { deleteMessage, editMessage } from "../../../services/userServices";
import { toast } from "react-hot-toast";
import { BsThreeDotsVertical, BsDownload, BsPencil, BsTrash } from "react-icons/bs";
import { MdCheck, MdClose } from "react-icons/md";

const formatTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    const now = new Date();
  
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
        return date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isYesterday) {
        return "Yesterday";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
};

const MessageBubble = ({ msg, isMe }) => {
    const { removeMessage, updateMessage } = useChatStore();
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(msg.text || "");
    
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

    const handleDelete = async () => {
        try {
            removeMessage(msg._id); 
            await deleteMessage(msg._id);
            toast.success("Message deleted");
        } catch (error) {
            toast.error("Failed to delete message");
            console.error("Delete message error:", error);
        }
        setShowMenu(false);
    };

    const handleEditSave = async () => {
        if (!editedText.trim() || editedText === msg.text) {
            setIsEditing(false);
            return;
        }
        try {
            updateMessage(msg._id, editedText); 
            await editMessage(msg._id, editedText);
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to edit message");
            console.error("Edit message error:", error);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(msg.image);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `image-${Date.now()}.jpg`; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            toast.error("Failed to download image");
        }
        setShowMenu(false);
    };

    return (
        <div className={`chat ${isMe ? "chat-end" : "chat-start"} group`}>
            
            <div className={`chat-bubble relative flex flex-col pr-10 ${ 
                isMe ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200 border border-slate-700"
            }`}>
                
                {msg.image && (
                    <img 
                        src={msg.image} 
                        alt="Attachment" 
                        className="rounded-lg max-w-[200px] sm:max-w-xs object-cover mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(msg.image, "_blank")}
                    />
                )}
                
                {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                        <input 
                            type="text" 
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="bg-black/20 text-white text-sm rounded px-2 py-1 outline-none border border-white/30 w-full"
                            autoFocus
                        />
                        <button onClick={handleEditSave} className="text-green-300 hover:text-green-100"><MdCheck size={18}/></button>
                        <button onClick={() => setIsEditing(false)} className="text-red-300 hover:text-red-100"><MdClose size={18}/></button>
                    </div>
                ) : (
                    msg.text && <p className="break-words">{msg.text}</p>
                )}

                {isMe && (
                    <div className="absolute top-2 right-2" ref={menuRef}>
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/20 rounded text-xs text-white/70"
                        >
                           
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-6 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col py-1">
                                {msg.text && (
                                    <button 
                                        onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                    >
                                        <BsPencil size={14} /> Edit
                                    </button>
                                )}

                                {msg.image && (
                                    <button 
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                    >
                                        <BsDownload size={14} /> Download
                                    </button>
                                )}

                                <button 
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <BsTrash size={14} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="chat-footer opacity-50 text-xs text-slate-400 mt-1 flex gap-1 items-center">
                {formatTime(msg.createdAt)}
            </div>
        </div>
    );
};

export default MessageBubble;