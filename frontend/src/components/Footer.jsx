const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="h-12 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-8 text-[11px] text-gray-500 font-medium tracking-wide">
            <div className="flex items-center gap-4">
                <span>© {currentYear} DMW Management System</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="text-blue-500/80">Developed for Digimon World</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                    <span className="uppercase">Server Status: Online</span>
                </div>
                <div className="text-gray-400">
                    Version <span className="text-white">1.0.0-beta</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;