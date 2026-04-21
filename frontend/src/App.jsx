import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import Login from './pages/Accounts/Login.jsx';
import Register from './pages/Accounts/Register.jsx';
import Dashboard from "./pages/Dashboard.jsx";
import DigimonList from "./pages/Digimon/DigimonList.jsx";
import AddDigimonModal from "./pages/Digimon/AddDigimonModal.jsx";


function App() {
    const {isAuthenticated} = useSelector((state) => state.auth);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login/> : <Navigate transition to="/dashboard"/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route
                    path="/dashboard"
                    element={isAuthenticated ? <Dashboard/> : <Navigate to="/login"/>}
                />
                <Route path="/" element={<Navigate to="/login"/>}/>
                <Route path="/digimons" element={<DigimonList />} />
                <Route path="/add-digimon" element={<AddDigimonModal />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;