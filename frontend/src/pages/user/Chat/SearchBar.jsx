import React from 'react';
import { IoSearch } from "react-icons/io5";
import useChatStore from '../../../store/useChatStore'; 

const SearchBar = () => {
    const { searchTerm, setSearchTerm } = useChatStore();

    return (
        <div className="p-4 border-b border-t border-slate-700/50">
            <div className="relative">
                <input 
                    type="text"
                    placeholder="Search chats or contacts..."
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <IoSearch 
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" 
                    size={18} 
                />
            </div>
        </div>
    )
}

export default SearchBar;