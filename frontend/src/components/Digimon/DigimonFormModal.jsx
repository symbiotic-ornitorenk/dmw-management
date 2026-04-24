const DigimonFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    editingId,
    previewImage,
    handleImageChange,
    handleChange,
    allDigimons,
    fileInputRef,
    STAGES, TYPES, ELEMENTS, STAT_FIELDS
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-800 border border-gray-700 rounded-[2.5rem] w-full max-w-5xl p-8 my-auto shadow-2xl relative animate-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-6 right-8 text-gray-500 hover:text-white text-3xl">✕</button>
                <h2 className="text-2xl font-black text-blue-400 mb-8 uppercase italic border-l-4 border-blue-600 pl-4">
                    {editingId ? 'Digimon Düzenle' : 'Yeni Digimon Kaydı'}
                </h2>

                <form onSubmit={onSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sol Kolon: Görsel Seçimi */}
                        <div className="lg:col-span-4">
                            <div onClick={() => fileInputRef.current.click()} className="aspect-square bg-gray-900 rounded-3xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-blue-500 transition-all relative">
                                {previewImage ? (
                                    <img src={previewImage} className="w-full h-full object-contain p-4" alt="Önizleme"/>
                                ) : (
                                    <div className="text-center p-6"><div className="text-4xl mb-2">📸</div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Görsel Seç</p></div>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange}/>
                        </div>

                        {/* Sağ Kolon: Inputlar */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput label="İsim" name="name" value={formData.name} onChange={handleChange} required />
                                <FormSelect label="Aşama" name="stage" value={formData.stage} options={STAGES} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormSelect label="Tip" name="digi_type" value={formData.digi_type} options={TYPES} onChange={handleChange} />
                                <FormSelect label="Element" name="element" value={formData.element} options={ELEMENTS} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormSelect label="Kimden Evriliyor?" name="evolves_from_id" value={formData.evolves_from_id} options={allDigimons} onChange={handleChange} isDigimonSelect />
                                <FormSelect label="Kime Evriliyor?" name="evolves_to_id" value={formData.evolves_to_id} options={allDigimons} onChange={handleChange} isDigimonSelect />
                            </div>
                        </div>
                    </div>

                    {/* Statlar Paneli */}
                    <div className="bg-gray-900/50 p-6 rounded-[2rem] border border-gray-700">
                        <h3 className="text-[10px] font-black text-gray-500 mb-6 uppercase tracking-widest text-center italic">Temel Statlar</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                            {STAT_FIELDS.map(f => (
                                <div key={f.id} className="flex flex-col gap-1">
                                    <label className="text-[9px] font-black text-gray-600 uppercase text-center">{f.label}</label>
                                    <input
                                        type="number"
                                        name={f.id}
                                        value={formData.stats[f.id]}
                                        step={f.step || "1"}
                                        className="bg-gray-800 border border-gray-700 p-2 rounded-xl text-center text-sm text-white outline-none"
                                        onChange={(e) => handleChange(e, true)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 transition-all uppercase italic text-white">
                            {editingId ? 'Değişiklikleri Kaydet' : 'Digimonu Ekle'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 py-4 rounded-2xl font-black text-lg transition-all uppercase italic text-white">İptal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Yardımcı Input Bileşenleri (Dosya içinde kalabilirler)
const FormInput = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black text-gray-500 uppercase">{label}</label>
        <input className="bg-gray-900 border border-gray-700 p-3 rounded-2xl focus:border-blue-500 outline-none text-white" {...props} />
    </div>
);

const FormSelect = ({ label, options, isDigimonSelect, ...props }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-black text-gray-500 uppercase">{label}</label>
        <select className="bg-gray-900 border border-gray-700 p-3 rounded-2xl focus:border-blue-500 outline-none text-white" {...props}>
            <option value="">{isDigimonSelect ? 'Seçilmedi' : 'Seçiniz'}</option>
            {options.map(opt => (
                <option key={opt.id || opt} value={opt.id || opt}>
                    {opt.name ? `${opt.name} (${opt.stage})` : opt}
                </option>
            ))}
        </select>
    </div>
);

export default DigimonFormModal;