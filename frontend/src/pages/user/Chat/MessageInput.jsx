import { useEffect, useRef, useState } from "react";
import useKeyboardSound from "../../../hooks/useKeyboardSound";
import useChatStore from "../../../store/useChatStore";
import { sendMessage } from "../../../services/userServices";
import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import { MdOutlineClose } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

const MessageInput = () => {
    const { playRandomKeyStrokeSound } = useKeyboardSound();
    const { isSoundEnabled, selectedUser, messages, setMessages } = useChatStore();
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const fileInputRef = useRef(null);
    const emojiPickerRef = useRef(null);

    const { mutate: sendMessageMutation } = useMutation({
        mutationFn: ({ receiverId, text, imageFile }) => sendMessage(receiverId, text, imageFile),
        onSuccess: (res) => {
            const newMessage = res.data; 
            setMessages([...messages, newMessage]);
            setText("");
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        onError: (error) => {
            console.error("Error sending message:", error);
        }
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        const imageFile = imagePreview ? imagePreview.file : null;
        sendMessageMutation({
            receiverId: selectedUser.userId,
            text: text.trim(),
            imageFile,
        });
    }

    const handleTextChange = (e) => {
        setText(e.target.value);
        if (isSoundEnabled) {
            playRandomKeyStrokeSound();
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")){
            toast.error("Please select a valid image file.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview({ file, previewUrl: reader.result });
        };
        reader.readAsDataURL(file);
    }

    const removeImagePreview = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleEmojiClick = (emojiObject) => {
        setText((prevText) => prevText + emojiObject.emoji);
    };
    
    return (
        <div className="p-4 border-t border-slate-700/50">
            {showEmojiPicker && (
                <div 
                    ref={emojiPickerRef} 
                    className="absolute bottom-20 left-4 z-50 shadow-xl rounded-xl"
                >
                    <EmojiPicker 
                        theme="dark" 
                        onEmojiClick={handleEmojiClick}
                        searchDisabled={false}
                        width={300}
                        height={400}
                        previewConfig={{ showPreview: false }} 
                    />
                </div>
            )}
            {imagePreview && (
                <div className="max-w-3xl mx-auto mb-3 flex items-center">
                <div className="relative">
                    <img
                        src={imagePreview.previewUrl}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                    />
                    <button
                        onClick={removeImagePreview}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
                        type="button"
                    >
                        <MdOutlineClose className="w-4 h-4" />
                    </button>
                </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-3">
                <div className="flex-1 flex gap-2 relative">
                     
                     <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 z-10 ${
                            showEmojiPicker 
                            ? "text-cyan-400" 
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <BsEmojiSmile className="w-5 h-5" />
                    </button>

                     <input 
                        type="text" 
                        value={text} 
                        onChange={handleTextChange} 
                        className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-slate-500"
                        placeholder="Type your message..."
                    />

                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2 rounded-lg transition-colors cursor-pointer border border-transparent ${
                            imagePreview 
                            ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" 
                            : "bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                        }`}
                        title="Attach Image"
                    >
                        <FaRegImage className="w-5 h-5" />
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={!text.trim() && !imagePreview}
                    className="bg-cyan-600 text-white rounded-lg p-2.5 font-medium hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shadow-lg shadow-cyan-900/20"
                >
                    <IoSend className="w-5 h-5 ml-0.5" />
                </button>
            </form>
        </div>
    )
}

export default MessageInput;
