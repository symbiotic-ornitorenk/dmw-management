import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../../services/api';

// Backend Modellerine Sadık Sabit Veriler
const STAGES = ['Rookie', 'Rookie X', 'Champion', 'Champion X', 'Ultimate', 'Ultimate X', 'Mega', 'Mega X', 'Burst Mode', 'Burst Mode X', 'Jogress', 'Jogress X', 'Hybrid', 'Variant', 'Armor'];
const TYPES = ['Data', 'Vaccine', 'Virus', 'Unknown', 'None'];
const ELEMENTS = ['Fire', 'Water', 'Ice', 'Earth', 'Wind', 'Thunder', 'Steel', 'Dark', 'Light', 'Land', 'Neutral', 'Pitch Black', 'Wood'];

const STAT_FIELDS = [
    {id: 'hp', label: 'HP'}, {id: 'ds', label: 'DS'}, {id: 'at', label: 'AT'},
    {id: 'as_speed', label: 'AS', step: '0.01'}, {id: 'ct', label: 'CT %', step: '0.1'},
    {id: 'cd', label: 'CD %', step: '0.1'}, {id: 'ht', label: 'HT'},
    {id: 'de', label: 'DE'}, {id: 'bl', label: 'BL %', step: '0.1'},
    {id: 'ev', label: 'EV %', step: '0.1'}, {id: 'sk', label: 'SK %', step: '0.1'},
];

const ORB_COLORS = {
    // Types
    'Data': 'from-[#5fbdff] to-[#004a80]',
    'Vaccine': 'from-[#5fff5f] to-[#008000]',
    'Virus': 'from-[#ff5f5f] to-[#800000]',
    'Unknown': 'from-[#ff5fff] to-[#800080]',
    'None': 'from-[#a0a0a0] to-[#404040]',
    // Elements
    'Fire': 'from-[#ffcc33] to-[#ff0000]',
    'Water': 'from-[#33ccff] to-[#0000ff]',
    'Ice': 'from-[#adebff] to-[#3366ff]',
    'Wind': 'from-[#99ffcc] to-[#00994d]',
    'Thunder': 'from-[#ffff99] to-[#ffcc00]',
    'Steel': 'from-[#e0e0e0] to-[#707070]',
    'Light': 'from-[#ffffeb] to-[#ffcc33]',
    'Dark': 'from-[#9966ff] to-[#330066]',
    'Land': 'from-[#cc9966] to-[#663300]',
    'Neutral': 'from-[#f0f0f0] to-[#999999]',
    'Pitch Black': 'from-[#444444] to-[#000000]',
    'Wood': 'from-[#b3ff66] to-[#4d9900]'
};

const DigimonList = () => {
    const [digimons, setDigimons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const initialFormState = {
        name: '',
        digi_type: 'Data',
        element: 'Fire',
        stage: 'Rookie',
        size: 140.0,
        hatch_level: 5,
        evolves_from_id: '',
        evolves_to_id: '',
        image: null,
        stats: STAT_FIELDS.reduce((acc, field) => ({...acc, [field.id]: 0}), {})
    };

    const [formData, setFormData] = useState(initialFormState);

    const fetchDigimons = async () => {
        try {
            const response = await api.get('digimons/');
            setDigimons(response.data);
        } catch (error) {
            console.error("Veri çekme hatası:", error.response?.data);
        }
    };

    useEffect(() => {
        fetchDigimons();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({...formData, image: file});
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e, isStat = false) => {
        const {name, value} = e.target;
        if (isStat) {
            setFormData(prev => ({
                ...prev,
                stats: {...prev.stats, [name]: parseFloat(value) || 0}
            }));
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('digi_type', formData.digi_type);
            data.append('element', formData.element);
            data.append('stage', formData.stage);
            data.append('size', formData.size);
            data.append('hatch_level', formData.hatch_level);

            if (formData.image) data.append('image', formData.image);
            if (formData.evolves_from_id) data.append('evolves_from_id', formData.evolves_from_id);
            if (formData.evolves_to_id) data.append('evolves_to_id', formData.evolves_to_id);

            const cleanedStats = {};
            STAT_FIELDS.forEach(f => {
                cleanedStats[f.id] = formData.stats[f.id] || 0;
            });
            data.append('stats', JSON.stringify(cleanedStats));

            await api.post('digimons/', data);
            setIsModalOpen(false);
            setPreviewImage(null);
            setFormData(initialFormState);
            fetchDigimons();
        } catch (error) {
            console.error("Kayıt hatası:", error.response?.data);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Üst Başlık Bölümü */}
            <div
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                        <span className="w-2 h-10 bg-blue-600 rounded-full"></span>
                        Digimonlar <span className="text-blue-500"></span>
                    </h1>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center gap-3 uppercase tracking-widest italic"
                >
                    <span className="text-xl group-hover:rotate-90 transition-transform">+</span>
                    Yeni Kayıt Oluştur
                </button>
            </div>

            {/* Karakter Kartları Gridi */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                {digimons.filter(d => d.stage === "Rookie").map((digimon) => (
                    <div
                        key={digimon.id}
                        className="group relative bg-[#161b22]/40 hover:bg-[#1c2128] rounded-[2rem] border border-white/5 hover:border-blue-500/50 transition-all duration-500 shadow-xl flex flex-col h-[280px] overflow-hidden"
                    >
                        {/* Stage Badge */}
                        <div
                            className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md text-[9px] px-3 py-1 rounded-full font-black text-blue-400 border border-white/5 uppercase">
                            {digimon.stage}
                        </div>

                        {/* Görsel Alanı */}
                        <div className="h-[140px] relative flex items-center justify-center p-4">
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent opacity-50"></div>
                            <img
                                src={digimon.image || 'https://via.placeholder.com/150'}
                                alt={digimon.name}
                                className="z-10 max-w-[100px] max-h-[100px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        {/* Bilgi Alanı */}
                        <div className="px-4 pb-4 flex-1 flex flex-col justify-between">
                            <div className="text-center">
                                <h3 className="font-black text-white text-sm uppercase tracking-tight mb-3 truncate">
                                    {digimon.name}
                                </h3>

                                <div className="flex justify-center gap-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <div
                                            className={`w-4 h-4 rounded-full bg-gradient-to-br ${ORB_COLORS[digimon.digi_type]} border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.4)]`}></div>
                                        <span
                                            className="text-[8px] font-bold text-gray-500 uppercase">{digimon.digi_type}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div
                                            className={`w-4 h-4 rounded-full bg-gradient-to-br ${ORB_COLORS[digimon.element]} border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.4)]`}></div>
                                        <span
                                            className="text-[8px] font-bold text-gray-500 uppercase">{digimon.element}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Butonları */}
                            <div
                                className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <button
                                    onClick={() => navigate(`/digimon/${digimon.id}`)}
                                    className="flex-[3] bg-blue-600 hover:bg-blue-500 text-[10px] py-2 rounded-xl font-black text-white transition-all uppercase tracking-tighter shadow-lg shadow-blue-900/40"
                                >
                                    DETAY
                                </button>
                                <button
                                    className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-2 py-2 rounded-xl border border-red-500/20 transition-all text-sm">
                                    🗑
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Veri Giriş Modalı */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div
                        className="bg-gray-800 border border-gray-700 rounded-[2.5rem] w-full max-w-5xl p-8 my-auto shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-8 text-gray-500 hover:text-white text-3xl transition-colors">✕
                        </button>

                        <h2 className="text-2xl font-black text-blue-400 mb-8 uppercase italic border-l-4 border-blue-600 pl-4">Yeni
                            Digimon Kaydı</h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-4 space-y-4">
                                    <div onClick={() => fileInputRef.current.click()}
                                         className="aspect-square bg-gray-900 rounded-3xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-blue-500 transition-all relative">
                                        {previewImage ? (
                                            <>
                                                <img src={previewImage}
                                                     className="w-full h-full object-contain p-4 z-10" alt="Önizleme"/>
                                                <div
                                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
                                                    <span className="text-xs font-bold text-white">DEĞİŞTİR</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-6">
                                                <div className="text-4xl mb-2">📸</div>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Karakter
                                                    Görseli</p>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*"
                                           onChange={handleImageChange}/>
                                </div>

                                <div className="lg:col-span-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label
                                                className="text-[10px] font-black text-gray-500 uppercase ml-1">İsim</label>
                                            <input name="name"
                                                   className="bg-gray-900 border border-gray-700 p-3 rounded-2xl focus:border-blue-500 outline-none transition-all text-white"
                                                   onChange={handleChange} required/>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label
                                                className="text-[10px] font-black text-gray-500 uppercase ml-1">Aşama</label>
                                            <select name="stage"
                                                    className="bg-gray-900 border border-gray-700 p-3 rounded-2xl focus:border-blue-500 outline-none cursor-pointer text-white"
                                                    onChange={handleChange}>
                                                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Tip
                                                (Type)</label>
                                            <select name="digi_type"
                                                    className="bg-gray-900 border border-gray-700 p-3 rounded-2xl focus:border-blue-500 outline-none text-white"
                                                    onChange={handleChange}>
                                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label
                                                className="text-[10px] font-black text-gray-500 uppercase ml-1">Element</label>
                                            <select name="element"
                                                    className="bg-gray-900 border border-gray-700 p-3 rounded-2xl focus:border-blue-500 outline-none text-white"
                                                    onChange={handleChange}>
                                                {ELEMENTS.map(e => <option key={e} value={e}>{e}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/50 p-6 rounded-[2rem] border border-gray-700">
                                <h3 className="text-[10px] font-black text-gray-500 mb-6 uppercase tracking-[0.3em] text-center italic">Temel
                                    İstatistikler</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {STAT_FIELDS.map(f => (
                                        <div key={f.id} className="flex flex-col gap-1">
                                            <label
                                                className="text-[9px] font-black text-gray-600 uppercase text-center">{f.label}</label>
                                            <input type="number" name={f.id} step={f.step || "1"} placeholder="0"
                                                   className="bg-gray-800 border border-gray-700 p-2 rounded-xl text-center text-sm focus:border-blue-500 outline-none text-white"
                                                   onChange={(e) => handleChange(e, true)}/>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button type="submit"
                                        className="flex-[2] bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 transition-all uppercase tracking-widest italic text-white">Veritabanına
                                    Ekle
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)}
                                        className="flex-1 bg-gray-700 hover:bg-gray-600 py-4 rounded-2xl font-black text-lg transition-all uppercase italic text-white">İptal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DigimonList;