import { useEffect, useRef } from "react";
import useChatStore from "../../../store/useChatStore";
import { getMessagesByUserId } from "../../../services/userServices";
import { useQuery } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import NoChatMessagesPlaceholder from "./NoChatMessagesPlaceholder";
import MessagesLoadingSkeleton from "../../../components/MessagesLoadingSkeleton/MessagesLoadingSkeleton";
import MessageBubble from "./MessageBubble";
import useAuthStore from "../../../store/useAuthStore";


const ChatWindow = () => {
    const { selectedUser, messages, setMessages, subscribeToMessage, unsubscribeToMessage } = useChatStore();
    const { user: authUser } = useAuthStore();
    const messageEndRef = useRef(null);

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

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
        
    useEffect(() => {   
        subscribeToMessage();
        return () => {
            unsubscribeToMessage();
        }
    }, [selectedUser, subscribeToMessage, unsubscribeToMessage]);
    
    return (
        <>
            <ChatHeader />
            <div className="flex-1 px-6 overflow-y-auto py-8">
                {messages.length > 0 && !isLoading ? (
                    <div className="max-w-3xl mx-auto space-y-6"> 
                        {messages.map(msg => (
                            <MessageBubble 
                                key={msg._id} 
                                msg={msg} 
                                isMe={msg.senderId === authUser.userId} 
                            />
                        ))}

                        <div ref={messageEndRef}></div>
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
