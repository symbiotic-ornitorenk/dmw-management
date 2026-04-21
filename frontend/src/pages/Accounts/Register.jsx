import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Basit bir şifre kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor!");
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/auth/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // Kayıt başarılı, login'e gönder
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.username?.[0] || "Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleRegister} className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Yeni Hesap Oluştur</h2>

        {error && <p className="bg-red-500/20 border border-red-500 text-red-500 p-2 rounded mb-4 text-sm text-center">{error}</p>}

        <div className="space-y-4">
          <input
            type="text" name="username" placeholder="Kullanıcı Adı" required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 transition"
            onChange={handleChange}
          />
          <input
            type="email" name="email" placeholder="E-posta (Opsiyonel)"
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 transition"
            onChange={handleChange}
          />
          <input
            type="password" name="password" placeholder="Şifre" required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 transition"
            onChange={handleChange}
          />
          <input
            type="password" name="confirmPassword" placeholder="Şifre Tekrar" required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 transition"
            onChange={handleChange}
          />
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold mt-6 transition transform active:scale-95">
          Kayıt Ol
        </button>

        <p className="text-center mt-4 text-sm text-gray-400">
          Zaten hesabın var mı? <Link to="/login" className="text-blue-400 hover:underline">Giriş Yap</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;