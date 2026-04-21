import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';

const DigimonList = () => {
    const [digimons, setDigimons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchDigimons = async () => {
            try {
                // DigimonList.jsx içinde
                const token = localStorage.getItem('token'); // 'access_token' değil, 'token' olmalı

                const response = await axios.get('http://127.0.0.1:8000/api/digimons/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDigimons(response.data);
            } catch (error) {
                // Hata 401 ise token geçersizdir veya süresi dolmuştur
                console.error("Detaylı Hata:", error.response?.data);
            }
        };
        fetchDigimons();
    }, []);

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold border-l-4 border-blue-500 pl-4">Karakter Koleksiyonu</h1>
                <button
                    onClick={() => navigate('/add-digimon')} // Formun olduğu sayfaya gider
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                >
                    + Yeni Digimon Ekle
                </button>
            </div>

            {/* 250x250 Grid Yapısı */}
            <div
                className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-8 gap-8 justify-items-center">
                {digimons.map((digimon) => (
                    <div
                        key={digimon.id}
                        className="relative w-[150px] h-[255px] bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500 group transition-all duration-300 shadow-xl"
                    >
                        {/* Fotoğraf Alanı (250x250) */}
                        <div
                            className="w-[150px] h-[150px] bg-black/50 overflow-hidden relative flex items-center justify-center">
                            {digimon.image ? (
                                <img
                                    src={digimon.image}
                                    alt={digimon.name}
                                    /* 'object-contain' resmin tamamını kutuya sığdırır (boşluk kalabilir).
                                       'object-cover' kutuyu tamamen doldurur ama kenarları kesebilir.
                                       Taşmayı engellemek için 'object-top' veya 'object-center' ile odak ayarlanabilir.
                                    */
                                    className="w-full h-full object-contain transition-transform hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150'; // Boş bırakmak yerine placeholder daha iyi olur
                                    }}
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] italic">
                                    Görüntü Yok
                                </div>
                            )}

                            {/* Stage Badge */}
                            <div
                                className="absolute top-2 right-2 bg-blue-600/90 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded uppercase font-bold border border-blue-400 text-white z-10">
                                {digimon.stage}
                            </div>
                        </div>

                        {/* Bilgi Alanı */}
                        <div className="p-4 flex flex-col justify-between h-[100px]">
                            <div className="text-center">
                                <h3 className="font-bold text-lg truncate">{digimon.name}</h3>
                                <p className="text-xs text-gray-400">{digimon.digi_type} / {digimon.element}</p>
                            </div>

                            {/* Düzenle ve Silme Butonları */}
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="flex-1 bg-gray-700 hover:bg-blue-600 text-[12px] py-1.5 rounded font-medium transition-colors border border-gray-600 hover:border-blue-400">
                                    Düzenle
                                </button>
                                <button
                                    className="flex-1 bg-gray-700 hover:bg-red-900/50 text-[12px] py-1.5 rounded font-medium transition-colors border border-gray-600 hover:border-red-500 text-red-400 hover:text-white">
                                    Sil
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DigimonList;