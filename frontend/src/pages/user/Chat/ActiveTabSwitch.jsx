import useChatStore from "../../../store/useChatStore";
import { MdOutlineFavorite } from "react-icons/md";
import { FaRegMessage, FaRegUser } from "react-icons/fa6"; 

const TABS = [
    { id: "all", label: "All", icon: <FaRegMessage size={16} /> },
    { id: "contacts", label: "Contacts", icon: <FaRegUser size={16} /> },
    { id: "favorites", label: "Favorites", icon: <MdOutlineFavorite size={18} /> },
];

const ActiveTabSwitch = () => {
    const { activeTab, setActiveTab } = useChatStore();

    return (
        <div className="p-2 border-b border-slate-700/50">
            <div className="flex bg-slate-800 p-1 rounded-lg space-x-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex-1 flex items-center justify-center gap-2 p-2 rounded-md cursor-pointer
                            text-sm font-medium transition-colors duration-200
                            ${activeTab === tab.id
                                ? 'bg-cyan-500/20 text-cyan-400' 
                                : 'text-slate-400 hover:text-slate-200' 
                            }
                        `}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ActiveTabSwitch;