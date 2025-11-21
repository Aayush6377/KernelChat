import { useState } from 'react'; 
import useChatStore from '../../../store/useChatStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { MdOutlineClose, MdPersonAdd } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";
import { LoaderIcon } from "lucide-react";
import { addContactByEmail } from '../../../services/userServices';

const SearchBar = () => {
    const { searchTerm, setSearchTerm } = useChatStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="p-4 border-b border-t border-slate-700/50 flex items-center gap-2">
                <div className="relative flex-1">
                    <input 
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-full pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <IoSearch 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
                        size={18} 
                    />
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 hover:border-cyan-500/30 transition-all duration-200 group cursor-pointer"
                    title="Add Contact"
                >
                    <FiUserPlus size={20} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {isModalOpen && <AddContactModal onClose={() => setIsModalOpen(false)} />}
        </>
    )
}

const AddContactModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        email: "",
        nickname: "",
        notes: ""
    });
    const [formErrors, setFormErrors] = useState({});
    
    const queryClient = useQueryClient();

    const { mutate: addContactMutation, isPending } = useMutation({
        mutationFn: addContactByEmail, 
        onSuccess: () => {
            toast.success("Contact added successfully!");
            queryClient.invalidateQueries(['chatList', 'contacts']); 
            queryClient.invalidateQueries(['chatList', 'all']); 
            onClose();
        },
        onError: (err) => {
            if (err.response?.data?.errors) {
                setFormErrors(err.response.data.errors);
                toast.error(err.response.data.message);
            } else{
                toast.error(err?.response?.data?.message || "Failed to add contact.");
            }
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email.trim()) return;
        
        addContactMutation(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                        <MdPersonAdd className="text-cyan-400" /> Add New Contact
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                        <MdOutlineClose size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Email Address <span className="text-red-400">*</span>
                        </label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@example.com"
                            required
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 placeholder-slate-500 transition-all"
                            autoFocus
                        />
                        { formErrors.email && <p className='auth-input-error'>{ formErrors.email }</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Nickname <span className="text-slate-500 text-xs">(Optional)</span>
                        </label>
                        <input 
                            type="text" 
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="e.g. Bestie, Work Buddy"
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 placeholder-slate-500 transition-all"
                        />
                        { formErrors.nickname && <p className='auth-input-error'>{ formErrors.nickname }</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Notes <span className="text-slate-500 text-xs">(Optional)</span>
                        </label>
                        <textarea 
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Add some details about this contact..."
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 placeholder-slate-500 transition-all resize-none"
                        />
                        { formErrors.notes && <p className='auth-input-error'>{ formErrors.notes }</p>}
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isPending || !formData.email}
                            className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                        >
                            {isPending ? <LoaderIcon className="animate-spin size-4" /> : "Add Contact"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchBar;