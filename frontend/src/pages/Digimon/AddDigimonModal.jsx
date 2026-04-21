import React, { useState } from 'react';
import axios from 'axios';

const AddDigimonModal = ({ isOpen, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        name: '',
        digi_type: 'Data', // models.py varsayılan
        element: 'Fire',   // models.py varsayılan
        stage: 'Rookie',   // models.py varsayılan
        image: null
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // authSlice uyumu

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });

        try {
            await axios.post('http://127.0.0.1:8000/api/digimons/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            onRefresh(); // Listeyi güncelle
            onClose();   // Modalı kapat
        } catch (error) {
            console.error("Hata:", error.response?.data);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Yeni Digimon Ekle</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input name="name" placeholder="Digimon Adı" onChange={handleChange} className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-white focus:border-blue-500 outline-none" required />

                    <div className="grid grid-cols-2 gap-4">
                        <select name="digi_type" onChange={handleChange} className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-white">
                            {['Data', 'Vaccine', 'Virus', 'Unknown'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <select name="element" onChange={handleChange} className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-white">
                            {['Fire', 'Water', 'Ice', 'Earth', 'Wind', 'Thunder', 'Steel', 'Dark', 'Light'].map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>

                    <select name="stage" onChange={handleChange} className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-white">
                        {['Rookie', 'Champion', 'Ultimate', 'Mega'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <div className="p-4 border-2 border-dashed border-slate-700 rounded-lg text-center">
                        <input type="file" name="image" onChange={handleChange} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white" accept="image/*" />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors">Vazgeç</button>
                        <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-shadow">Koleksiyona Ekle</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDigimonModal;