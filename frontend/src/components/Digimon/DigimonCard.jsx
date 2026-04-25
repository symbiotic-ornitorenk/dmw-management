import { ORB_COLORS } from "./Constants.js"; // Renkleri ortak bir dosyaya alabilirsin

const DigimonCard = ({ digimon, onEdit, onDelete, onNavigate }) => {
    return (
        <div
            onClick={() => onNavigate(`/digimons/${digimon.id}`)}
            className="group relative bg-[#161b22]/40 hover:bg-[#1c2128] rounded-[2rem] border border-white/5 hover:border-blue-500/50 transition-all duration-500 shadow-xl flex flex-col h-[280px] overflow-hidden cursor-pointer"
        >
            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md text-[9px] px-3 py-1 rounded-full font-black text-blue-400 border border-white/5 uppercase">
                {digimon.stage}
            </div>

            <div className="h-[140px] relative flex items-center justify-center p-4">
                <img
                    src={digimon.image || 'https://via.placeholder.com/150'}
                    className="z-10 max-w-[100px] max-h-[100px] object-contain group-hover:scale-110 transition-transform duration-500"
                    alt={digimon.name}
                />
            </div>

            <div className="px-4 pb-4 flex-1 flex flex-col justify-between">
                <h3 className="text-center font-black text-white text-sm uppercase truncate mb-3">{digimon.name}</h3>
                <div className="flex justify-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${ORB_COLORS[digimon.digi_type]} border border-white/20 shadow-lg`}></div>
                        <span className="text-[8px] font-bold text-gray-500 uppercase">{digimon.digi_type}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${ORB_COLORS[digimon.element]} border border-white/20 shadow-lg`}></div>
                        <span className="text-[8px] font-bold text-gray-500 uppercase">{digimon.element}</span>
                    </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button
                        onClick={(e) => onEdit(e, digimon)}
                        className="flex-[3] bg-yellow-500 hover:bg-yellow-400 text-[10px] py-2 rounded-xl font-black text-black transition-all uppercase italic shadow-lg shadow-yellow-900/20"
                    >
                        DÜZENLE
                    </button>
                    <button
                        onClick={(e) => onDelete(e, digimon.id, digimon.name)}
                        className="flex-1 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-2 py-2 rounded-xl border border-red-500/20 transition-all text-sm"
                    >
                        🗑
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DigimonCard;