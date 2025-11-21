import { useNavigate, useRouteError } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home, SearchX } from 'lucide-react';

const Error = ({ 
    code, 
    title, 
    message, 
    showHomeButton = true, 
    showBackButton = true 
}) => {
    const navigate = useNavigate();
    const routeError = useRouteError();

    const finalCode = code || routeError?.status || 404;
    
    let finalTitle = title;
    let finalMessage = message;
    let Icon = AlertTriangle;

    if (finalCode === 404) {
        finalTitle = finalTitle || "Page Not Found";
        finalMessage = finalMessage || "Sorry, we couldn't find the page you were looking for. It might have been removed or doesn't exist.";
        Icon = SearchX;
    } else if (finalCode === 500) {
        finalTitle = finalTitle || "Server Error";
        finalMessage = finalMessage || "Oops! Something went wrong on our end. Please try again later.";
    } else {
        finalTitle = finalTitle || "Something went wrong";
        finalMessage = finalMessage || routeError?.statusText || routeError?.message || "An unexpected error occurred.";
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            
            <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] opacity-50 pointer-events-none" />

            <div className="max-w-lg w-full bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 text-center shadow-2xl relative z-10">
                
                <div className="mx-auto w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-lg border border-slate-700 group">
                    <Icon className={`w-10 h-10 ${finalCode === 404 ? 'text-cyan-400' : 'text-red-400'} group-hover:scale-110 transition-transform duration-300`} />
                </div>

                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500 mb-2">
                    {finalCode}
                </h1>

                <h2 className="text-2xl font-bold text-slate-200 mb-3">
                    {finalTitle}
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    {finalMessage}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {showBackButton && (
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors font-medium cursor-pointer"
                        >
                            <ArrowLeft size={18} />
                            Go Back
                        </button>
                    )}
                    
                    {showHomeButton && (
                        <button 
                            onClick={() => navigate('/')}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors font-medium shadow-lg shadow-cyan-900/20 cursor-pointer"
                        >
                            <Home size={18} />
                            Back Home
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Error;