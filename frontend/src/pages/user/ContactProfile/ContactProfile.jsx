import { useState, useEffect } from 'react';
import { MdOutlineClose, MdEdit, MdSave, MdBlock, MdStar, MdStarBorder, MdDelete, MdPersonAdd, MdEmail } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import { images } from "../../../assets/assets";
import useChatStore from "../../../store/useChatStore";
import useAuthStore from "../../../store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleBlock, toggleFavorite, addContactById, updateContactInfo, removeContact, getContactInfo } from "../../../services/userServices";
import toast from 'react-hot-toast';

const ContactProfile = ({ onClose }) => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState({ nickname: false, notes: false });
    const [formData, setFormData] = useState({ nickname: "", notes: "" });

    const { data: contactDetails } = useQuery({
        queryKey: ['contactDetails', selectedUser.userId],
        queryFn: () => getContactInfo(selectedUser.userId),
        enabled: !!selectedUser.isContact, 
    });

    useEffect(() => {
        if (contactDetails?.data) {
            setFormData({
                nickname: contactDetails.data.nickname || "",
                notes: contactDetails.data.notes || ""
            });
        } else {
            setFormData({ nickname: selectedUser.name, notes: "" });
        }
    }, [contactDetails, selectedUser]);


    const { mutate: updateContact } = useMutation({
        mutationFn: (data) => updateContactInfo({ userId: selectedUser.userId, ...data }),
        onSuccess: () => {
            toast.success("Contact updated");
            queryClient.invalidateQueries(['chatList']); 
            setIsEditing({ nickname: false, notes: false });
        },
        onError: () => toast.error("Failed to update")
    });

    const { mutate: deleteCon } = useMutation({
        mutationFn: () => removeContact(selectedUser.userId),
        onSuccess: () => {
            toast.success("Contact removed");
            queryClient.invalidateQueries(['chatList']);
            setSelectedUser({ ...selectedUser, isContact: false, isFavorite: false });
        },
        onError: () => toast.error("Failed to delete contact")
    });

    const { mutate: toggleFav } = useMutation({
        mutationFn: () => toggleFavorite(selectedUser.userId),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries(['chatList']);
            setSelectedUser({ ...selectedUser, isFavorite: res.isFavorite });
        }
    });

    const { mutate: toggleBlk } = useMutation({
        mutationFn: () => toggleBlock(selectedUser.userId),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries(['chatList']);
            setSelectedUser({ ...selectedUser, isBlocked: res.isBlocked });
        }
    });

    const { mutate: addCon } = useMutation({
        mutationFn: () => addContactById(selectedUser.userId),
        onSuccess: () => {
            toast.success("Added to contacts");
            queryClient.invalidateQueries(['chatList']);
            setSelectedUser({ ...selectedUser, isContact: true });
        }
    });

    const handleSave = (field) => {
        updateContact({ [field]: formData[field] });
    };

    if (!selectedUser) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border-l border-slate-700 h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                
                <div className="p-4 flex items-center gap-3 border-b border-slate-700 bg-slate-800/50 sticky top-0 z-10">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer">
                        <MdOutlineClose size={24} />
                    </button>
                    <h2 className="text-lg font-semibold text-slate-200">Contact Info</h2>
                </div>

                <div className="p-6 space-y-8">
                    
                    <div className="flex flex-col items-center">
                        <div className={`avatar ${onlineUsers.includes(selectedUser.userId) ? 'online' : ''} mb-4`}>
                            <div className="w-32 rounded-full ring ring-cyan-500/30 ring-offset-base-100 ring-offset-2">
                                <img src={selectedUser.profilePic || images.defaultProfile} alt={selectedUser.name} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-100 text-center">
                            {formData.nickname || selectedUser.name}
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {selectedUser.email}
                        </p>
                    </div>

                    {selectedUser.isContact ? (
                        <>
                            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Nickname</label>
                                    <button 
                                        onClick={() => isEditing.nickname ? handleSave('nickname') : setIsEditing(prev => ({...prev, nickname: true}))}
                                        className="text-cyan-400 hover:text-cyan-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
                                    >
                                        {isEditing.nickname ? <><MdSave size={14}/> Save</> : <><MdEdit size={14}/> Edit</>}
                                    </button>
                                </div>
                                {isEditing.nickname ? (
                                    <input 
                                        type="text" 
                                        value={formData.nickname}
                                        onChange={(e) => setFormData(prev => ({...prev, nickname: e.target.value}))}
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
                                    />
                                ) : (
                                    <p className="text-slate-200">{formData.nickname || selectedUser.name}</p>
                                )}
                            </div>

                            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Notes</label>
                                    <button 
                                        onClick={() => isEditing.notes ? handleSave('notes') : setIsEditing(prev => ({...prev, notes: true}))}
                                        className="text-cyan-400 hover:text-cyan-300 text-xs font-medium flex items-center gap-1 cursor-pointer"
                                    >
                                        {isEditing.notes ? <><MdSave size={14}/> Save</> : <><MdEdit size={14}/> Edit</>}
                                    </button>
                                </div>
                                {isEditing.notes ? (
                                    <textarea 
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                                        rows={3}
                                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 resize-none"
                                    />
                                ) : (
                                    <p className="text-slate-300 text-sm italic">{formData.notes || "No notes added."}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => toggleFav()}
                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700/50 hover:border-cyan-500/30 transition-all group cursor-pointer"
                                >
                                    {selectedUser.isFavorite ? (
                                        <MdStar className="size-6 text-yellow-400" />
                                    ) : (
                                        <MdStarBorder className="size-6 text-slate-400 group-hover:text-yellow-400" />
                                    )}
                                    <span className="text-xs font-medium text-slate-300">Favorite</span>
                                </button>

                                <button 
                                    onClick={() => toggleBlk()}
                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700/50 hover:border-red-500/30 transition-all group cursor-pointer"
                                >
                                    {selectedUser.isBlocked ? (
                                        <CgUnblock className="size-6 text-red-400" />
                                    ) : (
                                        <MdBlock className="size-6 text-slate-400 group-hover:text-red-400" />
                                    )}
                                    <span className="text-xs font-medium text-slate-300">
                                        {selectedUser.isBlocked ? "Unblock" : "Block"}
                                    </span>
                                </button>
                            </div>

                            <button 
                                onClick={() => {
                                    if(window.confirm("Are you sure you want to remove this contact?")) deleteCon();
                                }}
                                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors mt-4 cursor-pointer"
                            >
                                <MdDelete size={20} /> Delete Contact
                            </button>
                        </>
                    ) : (
   
                        <div className="text-center py-8 space-y-6 bg-slate-800/30 rounded-xl border border-slate-700/50 p-6">
                            <p className="text-slate-400">
                                {selectedUser.name} is not in your contacts list. Add them to edit nickname, notes, and more.
                            </p>
                            <button 
                                onClick={() => addCon()}
                                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/20 cursor-pointer"
                            >
                                <MdPersonAdd size={20} /> Add to Contacts
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactProfile;