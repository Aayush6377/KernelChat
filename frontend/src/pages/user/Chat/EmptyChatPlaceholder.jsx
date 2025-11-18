import { images } from "../../../assets/assets";

const EmptyChatPlaceholder = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <img 
                src={images.logo} 
                alt="KerChat Logo" 
                className="w-40 mx-auto mb-1" 
            />
            
            <h2 className="text-2xl font-bold text-slate-200 mb-2">
                Welcome to KerChat!
            </h2>
            
            <p className="text-lg text-slate-400">
                Choose a contact from the sidebar to start chatting or continue a previous conversation.
            </p>
            
        </div>
    )
}

export default EmptyChatPlaceholder;