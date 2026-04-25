import {useEffect, useState, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import api from '../../services/api';
import {ORB_COLORS, STAT_FIELDS, STAGES, TYPES, ELEMENTS} from '../../components/Digimon/Constants';
import DigimonFormModal from "../../components/Digimon/DigimonFormModal.jsx";

const DigimonDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [digimon, setDigimon] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal ve Form State'leri
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState(null);
    const fileInputRef = useRef(null);

    const [allDigimons, setAllDigimons] = useState([]);

    const fetchDetail = async () => {
        try {
            const detailRes = await api.get(`digimons/${id}/`);
            const data = detailRes.data;
            setDigimon(data);

            const listRes = await api.get('digimons/');
            setAllDigimons(listRes.data);

            const currentStats = typeof data.stats === 'string'
                ? JSON.parse(data.stats)
                : data.stats;

            setFormData({
                ...data,
                // Backend'den gelen yeni ID alanlarını modalın beklediği isimlere aktar
                evolves_from_id: data.evolves_from_id || "",
                evolves_to_id: data.evolves_to_id || "",
                stats: currentStats || {},
                image: null
            });
            setPreviewImage(data.image);
        } catch (error) {
            console.error("Hata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({...formData, image: file});
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
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

            data.append('evolves_from_id', formData.evolves_from_id || "");
            data.append('evolves_to_id', formData.evolves_to_id || "");

            data.append('stats', JSON.stringify(formData.stats));

            if (formData.image instanceof File) {
                data.append('image', formData.image);
            }

            const response = await api.patch(`digimons/${id}/`, data);

            if (response.status === 200 || response.status === 204) {
                setIsModalOpen(false);
                // Sayfadaki veriyi yenile
                await fetchDetail();
                alert("Değişiklikler başarıyla kaydedildi!");
            }
        } catch (error) {
            console.error("Hata:", error.response?.data);
            alert("Güncelleme başarısız.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`${digimon.name} isimli Digimon'u silmek istediğine emin misin?`)) {
            try {
                await api.delete(`digimons/${id}/`);
                navigate('/digimons');
            } catch (error) {
                console.error("Silme hatası:", error);
            }
        }
    };

    if (loading || !digimon) return (
        <div
            className="h-full flex items-center justify-center italic text-blue-500 animate-pulse font-black uppercase tracking-widest">
            Veri Aktarılıyor...
        </div>
    );

    const displayStats = typeof digimon.stats === 'string' ? JSON.parse(digimon.stats) : digimon.stats;

    return (
        <div className="h-full flex flex-col overflow-hidden px-4 animate-in fade-in duration-700">

            {/* ÜST BAŞLIK */}
            <div className="flex-none flex justify-between items-end mb-4 border-b border-white/5 pb-4">
                <div>
                    <button onClick={() => navigate(-1)}
                            className="text-gray-500 hover:text-white text-[10px] font-black tracking-[0.2em] uppercase mb-1 transition-colors italic">
                        ← GERİ DÖN
                    </button>
                    <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                        {digimon.name}
                    </h1>
                </div>
                <div className="text-right">
                    <span
                        className="bg-blue-600/10 text-blue-500 border border-blue-500/20 px-4 py-1 rounded-full text-[10px] font-black uppercase italic">
                        {digimon.stage}
                    </span>
                </div>
            </div>

            {/* ORTA GÖVDE: Görsel + Statlar */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 mb-6 items-stretch">

                {/* SOL KOLON: Görsel ve İşlemler */}
                <div className="lg:col-span-5 flex flex-col min-h-0">
                    <div
                        className="flex-1 bg-[#161b22]/50 border border-white/5 rounded-[2.5rem] flex items-center justify-center p-8 mb-4 shadow-2xl relative overflow-hidden group">
                        <img
                            src={digimon.image}
                            alt={digimon.name}
                            className="max-w-full max-h-full object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    <div className="flex-none space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                className="bg-[#161b22] p-3 rounded-2xl border border-white/5 flex flex-col items-center gap-1 shadow-inner">
                                <div
                                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${ORB_COLORS[digimon.digi_type]}`}></div>
                                <span
                                    className="text-[9px] font-black text-gray-500 uppercase italic">TİP: {digimon.digi_type}</span>
                            </div>
                            <div
                                className="bg-[#161b22] p-3 rounded-2xl border border-white/5 flex flex-col items-center gap-1 shadow-inner">
                                <div
                                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${ORB_COLORS[digimon.element]}`}></div>
                                <span
                                    className="text-[9px] font-black text-gray-500 uppercase italic">ELEMENT: {digimon.element}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setIsModalOpen(true)}
                                    className="bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-600/20 py-3 rounded-xl font-black text-[10px] uppercase italic transition-all">
                                DÜZENLE
                            </button>
                            <button onClick={handleDelete}
                                    className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 py-3 rounded-xl font-black text-[10px] uppercase italic transition-all">
                                SİL
                            </button>
                        </div>
                    </div>
                </div>

                {/* SAĞ KOLON: İstatistikler */}
                <div
                    className="lg:col-span-7 bg-[#161b22]/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col min-h-0 shadow-2xl">
                    <h3 className="flex-none text-[10px] font-black text-blue-500 uppercase italic mb-6 tracking-widest flex items-center gap-3">
                        <span className="w-1 h-3 bg-blue-600 rounded-full"></span> TEMEL İSTATİSTİKLER
                    </h3>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 min-h-0">
                        {STAT_FIELDS.map(f => (
                            <div key={f.id}
                                 className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center group hover:border-blue-500/30 transition-all shadow-sm">
                                <div className="text-[9px] font-black text-gray-600 uppercase mb-1">{f.label}</div>
                                <div
                                    className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {displayStats?.[f.id] || 0}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ALT KISIM: Evrim Hattı */}
            <div className="flex-none bg-[#161b22]/30 border border-white/5 rounded-[2rem] p-6 mb-4 shadow-xl">
                <div className="flex items-center justify-center max-w-4xl mx-auto gap-4">

                    {/* ÖNCEKİ EVRİM */}
                    <EvolutionSlot
                        label="Önceki"
                        name={digimon.evolves_from_name}
                        targetId={digimon.evolves_from_id} // ID'yi gönderiyoruz
                        onNavigate={(id) => navigate(`/digimons/${id}`)}
                    />

                    <div className="text-gray-800 text-2xl font-black italic select-none">»</div>

                    {/* MEVCUT DIGIMON (Tıklanamaz/Aktif) */}
                    <EvolutionSlot
                        label="Mevcut"
                        name={digimon.name}
                        active
                    />

                    <div className="text-gray-800 text-2xl font-black italic select-none">»</div>

                    {/* SONRAKI EVRİM */}
                    <EvolutionSlot
                        label="Sonraki"
                        name={digimon.evolves_to_name}
                        targetId={digimon.evolves_to_id} // ID'yi gönderiyoruz
                        onNavigate={(id) => navigate(`/digimons/${id}`)}
                    />

                </div>
            </div>

            {/* DÜZENLEME MODALI */}
            {formData && (
                <DigimonFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    editingId={id}
                    previewImage={previewImage}
                    allDigimons={allDigimons} // Gerekirse buraya tüm listeyi bir context'ten çekip verebilirsin
                    fileInputRef={fileInputRef}
                    STAGES={STAGES} TYPES={TYPES} ELEMENTS={ELEMENTS} STAT_FIELDS={STAT_FIELDS}
                    handleImageChange={handleImageChange}
                    handleChange={handleChange}
                />
            )}
        </div>
    );
};

const EvolutionSlot = ({label, name, active, targetId, onNavigate}) => {
    // Eğer bir ID varsa ve aktif değilse tıklanabilir özellik kazandırıyoruz
    const isClickable = targetId && !active;

    return (
        <div
            onClick={() => isClickable && onNavigate(targetId)}
            className={`flex-1 p-3 rounded-xl border transition-all duration-300 ${
                active
                    ? 'border-blue-500/40 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.05)] cursor-default'
                    : isClickable
                        ? 'border-white/5 bg-black/20 hover:border-blue-500/30 hover:bg-blue-500/5 cursor-pointer group'
                        : 'border-white/5 bg-black/20 opacity-50 cursor-not-allowed'
            }`}
        >
            <div className="text-[8px] font-black text-gray-600 uppercase mb-1 tracking-tighter">
                {label}
            </div>
            <div className={`text-[10px] font-bold uppercase truncate transition-colors ${
                active
                    ? 'text-blue-400'
                    : isClickable
                        ? 'text-gray-400 group-hover:text-blue-300'
                        : 'text-gray-600 italic'
            }`}>
                {name || 'YOK'}
            </div>
        </div>
    );
};

export default DigimonDetail;