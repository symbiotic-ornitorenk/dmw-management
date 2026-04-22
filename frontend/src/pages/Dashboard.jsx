// Dashboard.jsx
// Sidebar ve Navbar importlarını artık burada yapmamıza gerek yok

const Dashboard = () => {
  return (
    // Ana kapsayıcıdaki flex ve h-screen sınıfları artık App.jsx'teki Layout'tan geliyor
    <div className="text-white">
      {/* DASHBOARD İÇERİK ALANI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium uppercase mb-2">Aktif Digimonlar</h3>
          <p className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium uppercase mb-2">Bot Durumu</h3>
          <p className="text-3xl font-bold text-yellow-500">Beklemede</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium uppercase mb-2">Toplam Kazanç</h3>
          <p className="text-3xl font-bold text-green-500">0 M</p>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-100">
          <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
          Son Aktiviteler
        </h2>
        <div className="border-t border-gray-700/50 pt-4">
          <p className="text-gray-500 italic text-sm">Henüz bir veri bulunmuyor...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;