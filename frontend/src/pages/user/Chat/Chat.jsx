import BorderAnimatedContainer from "../../../components/BorderAnimatedContainer/BorderAnimatedContainer";
import useChatStore from "../../../store/useChatStore";
import ProfileHeader from "./ProfileHeader";
import SearchBar from "./SearchBar";
import ActiveTabSwitch from "./ActiveTabSwitch";
import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import EmptyChatPlaceholder from "./EmptyChatPlaceholder";
import ContactProfile from "../ContactProfile/ContactProfile";

const Chat = () => {
    const { activeTab, selectedUser } = useChatStore();
    
    return (
        <div className='relative w-full max-w-6xl h-[800px]'>
            <BorderAnimatedContainer>
                <div className="w-full h-full flex">
                    
                    {/* LEFT SIDE */}
                    <div className={`
                        flex-col bg-slate-800/50 backdrop-blur-sm
                        ${selectedUser ? 'hidden md:flex' : 'flex w-full'} 
                        md:w-80
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
                        flex-1 flex-col bg-slate-900/50 backdrop-blur-sm
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
