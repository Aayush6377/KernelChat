import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MessageCircle, Shield, Zap, Image as ImageIcon, Globe, Heart } from 'lucide-react';
import { images } from '../../../assets/assets'; 
import Footer from "../../../components/Footer/Footer";
import { Menu, X } from 'lucide-react';

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />
      </div>

      <nav className="relative z-50 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10">
                <img src={images.logo} alt="KernelChat" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                KernelChat
            </span>
        </div>

        <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log In
            </Link>
            <Link to="/signup" className="px-5 py-2.5 text-sm font-medium bg-white text-slate-900 rounded-full hover:bg-cyan-50 transition-colors shadow-lg shadow-white/5">
                Get Started
            </Link>
        </div>

        <button 
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-6 flex flex-col gap-4 shadow-2xl md:hidden animate-in slide-in-from-top-5 duration-200">
                <Link 
                    to="/login" 
                    className="text-center py-3 text-slate-300 hover:text-white font-medium border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    Log In
                </Link>
                <Link 
                    to="/signup" 
                    className="text-center py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-cyan-50 transition-colors shadow-lg"
                >
                    Get Started
                </Link>
            </div>
        )}
      </nav>

      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-cyan-400 text-xs font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            v1.0 is now live
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent max-w-4xl">
            Connect instantly with <br className="hidden md:block" />
            <span className="text-cyan-400">privacy first</span> messaging.
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Experience seamless, real-time communication with end-to-end encryption. 
            Share moments, stay connected, and keep your conversations private with KernelChat.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-1">
                Start Chatting Free
            </Link>
            <a href="#features" className="px-8 py-4 bg-slate-800 border border-slate-700 text-white rounded-full font-semibold text-lg hover:bg-slate-700 transition-all">
                Learn More
            </a>
        </div>

        <div className="mt-20 relative group perspective-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl transform rotate-x-12 group-hover:rotate-0 transition-transform duration-500 ease-out">
                <img 
                    src={images.kernelChatSS}
                    alt="App Interface" 
                    className="rounded-xl w-full max-w-5xl mx-auto"
                />
            </div>
        </div>
      </header>

      <section id="features" className="relative z-10 bg-slate-900/50 py-24 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for modern communication</h2>
                <p className="text-slate-400">Everything you need to chat effectively, without the clutter.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<Zap className="w-6 h-6 text-yellow-400" />}
                    title="Real-Time Sync"
                    desc="Messages are delivered instantly via Socket.io. No page refreshes, just seamless conversation flow."
                />
                <FeatureCard 
                    icon={<Shield className="w-6 h-6 text-green-400" />}
                    title="Secure Encryption"
                    desc="Your privacy matters. We use field-level encryption to ensure your messages stay between you and the recipient."
                />
                <FeatureCard 
                    icon={<ImageIcon className="w-6 h-6 text-purple-400" />}
                    title="Media Sharing"
                    desc="Share images and files effortlessly. Powered by Cloudinary for fast and reliable uploads."
                />
                <FeatureCard 
                    icon={<Globe className="w-6 h-6 text-blue-400" />}
                    title="Global Access"
                    desc="Connect with friends and family anywhere in the world. KernelChat breaks down borders."
                />
                <FeatureCard 
                    icon={<Heart className="w-6 h-6 text-red-400" />}
                    title="Favorites & Contacts"
                    desc="Organize your people. Pin your favorite conversations and manage your contact list easily."
                />
                <FeatureCard 
                    icon={<MessageCircle className="w-6 h-6 text-cyan-400" />}
                    title="Clean UI/UX"
                    desc="A distraction-free interface designed for focus, built with Tailwind CSS and modern design principles."
                />
            </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 md:p-16 text-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                Ready to start chatting?
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto relative z-10">
                Join KernelChat today. It's free, secure, and takes less than a minute to set up your account.
            </p>
            <Link to="/signup" className="relative z-10 inline-block px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-cyan-50 transition-colors shadow-xl shadow-white/5">
                Create Free Account
            </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};


const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/60 transition-all duration-300 group">
        <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-700">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

export default Home;