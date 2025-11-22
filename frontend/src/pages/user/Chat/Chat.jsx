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
        // --- FIX EXPLAINED ---
        // 1. 'fixed inset-0': Forces the chat to cover the ENTIRE mobile screen (no scrolling the body).
        // 2. 'z-50': Ensures it sits on top of any other mobile UI.
        // 3. 'md:relative md:inset-auto': Resets this for desktop so it sits in the layout.
        // 4. 'md:h-[800px]': Keeps your fixed height preference for desktop.
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