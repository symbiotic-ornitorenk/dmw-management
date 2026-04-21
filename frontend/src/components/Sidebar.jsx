const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="p-6 text-xl font-bold text-blue-400 border-b border-gray-700">
                DMW Panel
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <a href="#"
                   className="block p-3 rounded bg-blue-600/10 text-blue-400 border border-blue-600/20">Dashboard</a>
                <a href="#"
                   className="block p-3 rounded hover:bg-gray-700 transition text-gray-400 hover:text-white">Digimonlar</a>
                <a href="#"
                   className="block p-3 rounded hover:bg-gray-700 transition text-gray-400 hover:text-white">Aksesuarlar</a>
                <a href="#"
                   className="block p-3 rounded hover:bg-gray-700 transition text-gray-400 hover:text-white">Sealler</a>
                <a href="#"
                   className="block p-3 rounded hover:bg-gray-700 transition text-gray-400 hover:text-white">Union</a>
            </nav>
            <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
                v1.0.0 Beta
            </div>
        </aside>
    );
};

export default Sidebar;