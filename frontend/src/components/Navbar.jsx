import {useSelector, useDispatch} from 'react-redux';
import {logout} from '../store/authSlice.js';
import {useNavigate} from 'react-router-dom';

const Navbar = () => {
    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8 shadow-md">
            <div className="text-gray-400">
                Hoş geldin, <span className="text-white font-semibold">{user?.username || 'Kullanıcı'}</span>
            </div>

            <div className="flex items-center gap-4">
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