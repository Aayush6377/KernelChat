import useChatStore from "../../../store/useChatStore";
import { getMessagesByUserId } from "../../../services/userServices";
import { useQuery } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import NoChatMessagesPlaceholder from "./NoChatMessagesPlaceholder";
import MessagesLoadingSkeleton from "../../../components/MessagesLoadingSkeleton/MessagesLoadingSkeleton";
import { useEffect } from "react";

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


const ChatWindow = () => {
    const { selectedUser, messages, setMessages } = useChatStore();

    const { data, isLoading } = useQuery({
        queryKey: ['messages', selectedUser?.userId],
        queryFn: () => getMessagesByUserId(selectedUser.userId),
        enabled: !!selectedUser?.userId,
    });

    useEffect(() => {
        if (data?.data) {
            setMessages(data.data);
        }
    }, [data, setMessages]);

    return (
        <>
            <ChatHeader />
            <div className="flex-1 px-6 overflow-y-auto py-8">
                {messages.length > 0 && !isLoading ? (
                    <div className="max-w-3xl mx-auto space-y-6"> 
                        {messages.map(msg => (
                            <div key={msg._id} className={ `chat ${msg.senderId === selectedUser.userId ? "chat-start" : "chat-end"}` }>
                                <div className={`chat-bubble relative ${ msg.senderId === selectedUser.userId ? "bg-slate-800 text-slate-200": "bg-cyan-600 text-white" }`}>
                                    {msg.image && (
                                        <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                                    )}
                                    {msg.text && <p className="mt-2">{msg.text}</p>}
                                    <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                                        {formatTime(msg.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isLoading ? <MessagesLoadingSkeleton /> : (
                    <NoChatMessagesPlaceholder name={selectedUser.name} />
                )}
            </div>

            <MessageInput />
        </>
    )
}

export default ChatWindow;
