// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/auth/login/', { username, password });
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch (err) {
      alert("Giriş başarısız!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">DMW Management</h2>
        <input
          type="text" placeholder="Kullanıcı Adı"
          className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password" placeholder="Şifre"
          className="w-full p-3 mb-6 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold transition">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;