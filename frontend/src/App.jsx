import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import Login from './pages/Accounts/Login.jsx';
import Register from './pages/Accounts/Register.jsx';
import Dashboard from "./pages/Dashboard.jsx";
import DigimonList from "./pages/Digimon/DigimonList.jsx";


// Yetkisiz erişimi engelleyen sarmalayıcı bileşen
const ProtectedRoute = ({isAuthenticated, children}) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }
    return children;
};

function App() {
    const {isAuthenticated} = useSelector((state) => state.auth);

    return (
        <BrowserRouter>
            <Routes>
                {/* Herkese Açık Rotalar */}
                <Route
                    path="/login"
                    element={!isAuthenticated ? <Login/> : <Navigate to="/dashboard" replace/>}
                />
                <Route
                    path="/register"
                    element={!isAuthenticated ? <Register/> : <Navigate to="/dashboard" replace/>}
                />

                {/* Dashboard ve Digimons gibi sayfalar için ortak Layout */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <div className="flex h-screen w-full bg-[#0a0c10] text-white overflow-hidden">
                                <Sidebar/>
                                <div className="flex-1 flex flex-col min-w-0">
                                    <Navbar/>

                                    {/* bg-transparent yaparak iç içe sayfa görüntüsünü bitiriyoruz */}
                                    <main className="flex-1 overflow-y-auto p-8 bg-transparent">
                                        <Routes>
                                            <Route path="/dashboard" element={<Dashboard/>}/>
                                            <Route path="/digimons" element={<DigimonList/>}/>
                                            <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
                                        </Routes>
                                    </main>

                                    <Footer/>
                                </div>
                            </div>
                        </ProtectedRoute>
                    }
                />

                {/* Tanımsız URL'leri yakala */}
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;