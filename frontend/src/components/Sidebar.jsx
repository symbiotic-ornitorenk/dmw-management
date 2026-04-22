// Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    // Aktif link stili için yardımcı fonksiyon
    const linkClass = (path) =>
        `block p-3 rounded transition ${
            location.pathname === path 
            ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
            : "hover:bg-gray-700 text-gray-400 hover:text-white"
        }`;

    return (
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen sticky top-0">
            <div className="p-6 text-xl font-bold text-blue-400 border-b border-gray-700">
                DMW Panel
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
                <Link to="/digimons" className={linkClass('/digimons')}>Digimonlar</Link>
                <Link to="#" className={linkClass('/accessories')}>Aksesuarlar</Link>
                <Link to="#" className={linkClass('/seals')}>Sealler</Link>
                <Link to="#" className={linkClass('/union')}>Union</Link>
            </nav>
            <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
                v1.0.0 Beta
            </div>
        </aside>
    );
};

export default Sidebar;