import BorderAnimatedContainer from "../../../components/BorderAnimatedContainer/BorderAnimatedContainer";
import useChatStore from "../../../store/useChatStore";
import ProfileHeader from "./ProfileHeader";
import SearchBar from "./SearchBar";
import ActiveTabSwitch from "./ActiveTabSwitch";
import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import EmptyChatPlaceholder from "./EmptyChatPlaceholder";

const Chat = () => {
    const { activeTab, selectedUser } = useChatStore();
    
    return (
        <div className='fixed inset-0 z-50 bg-slate-900 md:relative md:inset-auto md:w-full md:max-w-6xl md:h-[800px]'>
            <BorderAnimatedContainer>
                <div className="w-full h-full flex">
                    
                    {/* LEFT SIDE (Chat List) */}
                    <div className={`
                        flex-col bg-slate-800/50 backdrop-blur-sm
                        ${selectedUser ? 'hidden md:flex' : 'flex w-full'} 
                        md:w-80 h-full
                    `}>
                        <ProfileHeader />
                        <SearchBar />
                        <ActiveTabSwitch />

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            <ChatList listType={activeTab} />
                        </div>
                    </div>

                    {/* RIGHT SIDE (Chat Window) */}
                    <div className={`
                        flex-1 flex-col bg-slate-900/50 backdrop-blur-sm h-full
                        ${selectedUser ? 'flex' : 'hidden md:flex'}
                    `}>
                        {selectedUser ? <ChatWindow /> : <EmptyChatPlaceholder />}
                    </div>

                </div>
            </BorderAnimatedContainer>
        </div>
    )
}

export default Chat;