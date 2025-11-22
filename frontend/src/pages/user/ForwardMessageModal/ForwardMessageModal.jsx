import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getChatList, forwardMessage } from '../../../services/userServices';
import { MdOutlineClose, MdSend } from "react-icons/md";
import { LoaderIcon } from "lucide-react";
import { images } from "../../../assets/assets";
import toast from 'react-hot-toast';

const ForwardMessageModal = ({ message, onClose }) => {
    const [selectedContacts, setSelectedContacts] = useState([]);

    const { data, isLoading } = useQuery({
        queryKey: ['forwardContacts'],
        queryFn: () => getChatList({ listType: 'all' }),
    });
    const contacts = data?.data || [];

    const { mutate: forward, isPending } = useMutation({
        mutationFn: () => forwardMessage({ messageId: message._id, receiverIds: selectedContacts }),
        onSuccess: () => {
            toast.success("Message forwarded!");
            onClose();
        },
        onError: () => toast.error("Failed to forward message")
    });

    const toggleContact = (id) => {
        setSelectedContacts(prev => 
            prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]">
                
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h3 className="text-lg font-semibold text-slate-100">Forward Message</h3>
                    <button onClick={onClose}><MdOutlineClose size={22} className="text-slate-400 hover:text-white" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {isLoading ? <div className="p-4 text-center"><LoaderIcon className="animate-spin mx-auto" /></div> : 
                     contacts.length === 0 ? <p className="text-center text-slate-500 p-4">No contacts found</p> :
                     contacts.map(contact => (
                        <div 
                            key={contact.userId} 
                            onClick={() => toggleContact(contact.userId)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedContacts.includes(contact.userId) ? "bg-cyan-500/20 border border-cyan-500/50" : "hover:bg-slate-700/50 border border-transparent"
                            }`}
                        >
                            <img src={contact.profilePic || images.defaultProfile} alt={contact.name} className="w-10 h-10 rounded-full" />
                            <span className={`flex-1 font-medium ${selectedContacts.includes(contact.userId) ? "text-cyan-400" : "text-slate-200"}`}>
                                {contact.name}
                            </span>
                            {selectedContacts.includes(contact.userId) && <div className="w-4 h-4 bg-cyan-500 rounded-full" />}
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-end">
                    <button 
                        onClick={() => forward()} 
                        disabled={isPending || selectedContacts.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isPending ? <LoaderIcon className="animate-spin size-4" /> : <><MdSend size={16}/> Forward</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForwardMessageModal;