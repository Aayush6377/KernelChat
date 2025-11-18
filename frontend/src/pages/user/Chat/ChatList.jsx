import useChatStore from "../../../store/useChatStore";
import useAuthStore from "../../../store/useAuthStore";
import { images } from "../../../assets/assets";
import { MdStar } from "react-icons/md";
import { getChatList } from "../../../services/userServices";
import { useQuery } from "@tanstack/react-query";

import UserLoadingSkeleton from "../../../components/UsersLoadingSkeleton/UsersLoadingSkeleton";
import EmptyListView from "../../../components/EmptyListView/EmptyListView"; 

import { MessageCircleIcon } from "lucide-react";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineStarBorder } from "react-icons/md";


const ChatList = ({ listType }) => {
    const { searchTerm, setActiveTab } = useChatStore();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['chatList', listType, searchTerm],
        queryFn: () => getChatList({ search: searchTerm, listType }),
    });
    
    const chats = data?.data || [];

    if (isLoading) {
        return <UserLoadingSkeleton />;
    }

    if (isError) {
        return <div className="p-4 text-center text-red-400">Failed to load list.</div>;
    }

    if (chats.length === 0) {
        if (searchTerm) {
            return (
                <EmptyListView 
                    icon={<MessageCircleIcon className="w-8 h-8 text-cyan-400" />}
                    title="No Results Found"
                    text={`Your search for "${searchTerm}" returned no results.`}
                />
            );
        }
        switch (listType) {
            case 'contacts':
                return (
                    <EmptyListView 
                        icon={<FaRegUser className="w-8 h-8 text-cyan-400" />}
                        title="No Contacts"
                        text="You haven't added any contacts yet."
                    />
                );
            case 'favorites':
                return (
                    <EmptyListView 
                        icon={<MdOutlineStarBorder className="w-8 h-8 text-cyan-400" />}
                        title="No Favorites"
                        text="You haven't marked any chats as favorites yet."
                    />
                );
            case 'all':
            default:
                return (
                    <EmptyListView 
                        icon={<MessageCircleIcon className="w-8 h-8 text-cyan-400" />}
                        title="No conversations yet"
                        text="Start a new chat by selecting a contact from the contacts tab"
                        buttonText="Find contacts"
                        onButtonClick={() => setActiveTab("contacts")}
                    />
                );
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {chats.map((chat) => (
                <ChatListItem key={chat.userId} chat={chat} />
            ))}
        </div>
    )
}

const formatLastMessageTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const ChatListItem = ({ chat }) => {
    const { user } = useAuthStore();
    const { setSelectedUser } = useChatStore();

    const renderLastMessage = () => {
        if (!chat.lastMessage) {
            return <p className="text-slate-400 text-sm italic">No messages yet...</p>;
        }
        const prefix = chat.lastMessage.senderId === user.userId ? "You: " : "";
        if (chat.lastMessage.image) {
            return <span className="text-slate-400 text-sm">{prefix}📷 Photo</span>;
        }
        return <p className="text-slate-400 text-sm truncate">{prefix}{chat.lastMessage.text}</p>;
    }

    const handleChatClick = () => {
        setSelectedUser(chat);
    }

    return (
        <div 
            key={chat.userId} 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors" 
            onClick={handleChatClick} 
        >
            <div className="avatar online">
                <div className="size-12 rounded-full">
                    <img src={chat.profilePic || images.defaultProfile} alt={chat.name} />
                </div>
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                    {chat.isFavorite && <MdStar className="text-yellow-400 size-4 flex-shrink-0" />}
                    <h4 className="text-slate-200 font-medium truncate">{chat.name}</h4>
                </div>
                {renderLastMessage()}
            </div>
            
            <div className="flex flex-col items-end text-xs text-slate-500 gap-1.5">
                <span className="whitespace-nowrap">
                    {formatLastMessageTime(chat.lastMessage?.createdAt)}
                </span>
                {chat.unseenMessages > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 bg-cyan-500 text-white text-xs font-bold rounded-full">
                        {chat.unseenMessages}
                    </span>
                )}
            </div>
        </div>
    );
}

export default ChatList;