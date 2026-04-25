import {useSelector, useDispatch} from 'react-redux';
import {logout} from '../store/authSlice.js';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';
import api from '../services/api';

const Navbar = () => {
    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Arama state'leri
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Arama Fonksiyonu
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.trim().length > 1) {
                try {
                    const response = await api.get(`digimons/?search=${searchTerm}`);

                    // Manuel Filtreleme: Backend hata yapsa bile sadece ismi içerenleri tutar
                    const filteredResults = response.data.filter(d =>
                        d.name.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    setResults(filteredResults);
                    setIsSearching(true);
                } catch (error) {
                    console.error("Arama hatası:", error);
                }
            } else {
                setResults([]);
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // Dışarı tıklandığında kapatma
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearching(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id) => {
        navigate(`/digimons/${id}`);
        setSearchTerm('');
        setIsSearching(false);
    };

    return (
        <header
            className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8 shadow-md relative z-[100]">
            {/* SOL KISIM */}
            <div className="text-gray-400 min-w-[200px]">
                Merhaba, <span className="text-white font-semibold">{user?.username || 'Kullanıcı'}</span>
            </div>

            {/* ORTA KISIM: SEARCH BAR (Görünmeyen kısım burasıydı) */}
            <div className="flex-1 max-w-xl mx-10 relative" ref={searchRef}>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                    <input
                        type="text"
                        placeholder="Digimon Ara (Rookie, Mega...)"
                        className="w-full bg-gray-900/80 border border-gray-600 py-2 pl-12 pr-4 rounded-xl text-sm focus:border-blue-500 outline-none transition-all text-white placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm.length > 1 && setIsSearching(true)}
                    />
                </div>

                {/* Arama Sonuçları Listesi */}
                {isSearching && results.length > 0 && (
                    <div
                        className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto z-[110]">
                        {results.map((d) => (
                            <div
                                key={d.id}
                                onClick={() => handleSelect(d.id)}
                                className="px-4 py-3 hover:bg-blue-600/20 border-b border-gray-700/50 cursor-pointer flex items-center gap-3 transition-colors"
                            >
                                <img src={d.image} alt="" className="w-8 h-8 object-contain"/>
                                <div>
                                    <div className="text-sm font-bold text-white">{d.name}</div>
                                    <div className="text-[10px] text-blue-400 uppercase font-black">{d.stage}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SAĞ KISIM */}
            <div className="flex items-center gap-4 min-w-[200px] justify-end">
                <div
                    className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm uppercase">
                    {user?.username?.charAt(0) || 'U'}
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-1.5 rounded text-sm font-medium border border-red-500/50 transition-all cursor-pointer"
                >
                    Çıkış Yap
                </button>
            </div>
        </header>
    );
};

export default Navbar;