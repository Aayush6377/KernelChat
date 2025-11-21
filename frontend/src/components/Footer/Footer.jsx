import { Github, Linkedin, Instagram, Globe } from 'lucide-react';
import { images, profileLinks } from "../../assets/assets";

const Footer = () => {
    return (
        <footer className="relative z-10 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10">
                        <img src={images.logo} alt="KernelChat" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-xl text-slate-100 tracking-tight">KernelChat</span>
                </div>
                
                <div className="text-slate-500 text-sm font-medium">
                    &copy; {new Date().getFullYear()} KernelChat. Built by <span className="text-slate-300 hover:text-cyan-400 transition-colors cursor-default">Aayush Kukreja</span>.
                </div>

                <div className="flex items-center gap-4">
                    <SocialLink href={profileLinks.github} icon={<Github className="w-5 h-5" />} label="GitHub" />
                    <SocialLink href={profileLinks.linkedin} icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
                    <SocialLink href={profileLinks.instagram} icon={<Instagram className="w-5 h-5" />} label="Instagram" />
                    <SocialLink href={profileLinks.portfolio} icon={<Globe className="w-5 h-5" />} label="Portfolio" />
                </div>
            </div>
        </footer>
    )
}

const SocialLink = ({ href, icon, label }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={label}
        className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-cyan-400 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-cyan-500/20"
        title={label}
    >
        {icon}
    </a>
);

export default Footer;
