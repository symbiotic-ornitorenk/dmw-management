import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import api from '../../services/api';
import DigimonCard from "../../components/Digimon/DigimonCard.jsx";
import DigimonFormModal from "../../components/Digimon/DigimonFormModal.jsx";
import {STAGES, TYPES, ELEMENTS, STAT_FIELDS} from "../../components/Digimon/Constants.js";


const DigimonList = () => {
    const [digimons, setDigimons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [editingId, setEditingId] = useState(null);

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

    const handleEdit = (e, digimon) => {
        if (e && e.stopPropagation) e.stopPropagation();

        setEditingId(digimon.id);

        setFormData({
            ...digimon,
            // Serializer'dan gelen verileri modalın beklediği state'e aktar
            evolves_from_id: digimon.evolves_from_id || "",
            evolves_to_id: digimon.evolves_to_id || "",
            stats: typeof digimon.stats === 'string' ? JSON.parse(digimon.stats) : (digimon.stats || {}),
            image: null
        });
        setPreviewImage(digimon.image);
        setIsModalOpen(true);
    };

    const handleDelete = async (e, id, name) => {
        e.stopPropagation();
        if (window.confirm(`${name} isimli Digimon'u silmek istediğine emin misin?`)) {
            try {
                await api.delete(`digimons/${id}/`);
                setDigimons(prev => prev.filter(d => d.id !== id));
            } catch (error) {
                console.error("Silme hatası:", error.response?.data);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(initialFormState);
        setPreviewImage(null);
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

            if (editingId) {
                await api.patch(`digimons/${editingId}/`, data);
            } else {
                await api.post('digimons/', data);
            }

            closeModal();
            fetchDigimons();
        } catch (error) {
            console.error("İşlem hatası:", error.response?.data);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Header Kısmı */}
            <div
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 border-b border-white/5 pb-8">
                <h1 className="text-4xl font-black text-white uppercase italic flex items-center gap-3">
                    <span className="w-2 h-10 bg-blue-600 rounded-full"></span> Digimonlar
                </h1>
                <button onClick={() => setIsModalOpen(true)}
                        className="group bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-4 px-8 rounded-2xl uppercase tracking-widest italic transition-all shadow-lg shadow-blue-900/20">
                    <span className="text-xl group-hover:rotate-90 transition-transform">+</span> Yeni Kayıt Oluştur
                </button>
            </div>

            {/* Liste Kısmı */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                {digimons.filter(d => d.stage === 'Rookie').map((digimon) => (
                    <DigimonCard
                        key={digimon.id}
                        digimon={digimon}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onNavigate={navigate}
                    />
                ))}
            </div>

            {/* Form Modalı */}
            <DigimonFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                editingId={editingId}
                previewImage={previewImage}
                allDigimons={digimons}
                fileInputRef={fileInputRef}
                STAGES={STAGES} TYPES={TYPES} ELEMENTS={ELEMENTS} STAT_FIELDS={STAT_FIELDS}
                handleImageChange={handleImageChange}
                handleChange={handleChange}
            />
        </div>
    );
};

export default DigimonList;