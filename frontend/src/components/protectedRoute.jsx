import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Eğer token yoksa kullanıcıyı login sayfasına yönlendir
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Token varsa istenen sayfayı (children) göster
    return children;
};

export default ProtectedRoute;