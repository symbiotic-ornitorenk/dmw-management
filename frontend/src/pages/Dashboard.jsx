import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        {/* DASHBOARD CONTENT */}
        <main className="p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition">
              <h3 className="text-gray-400 text-sm font-medium uppercase mb-2">Aktif Digimonlar</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition">
              <h3 className="text-gray-400 text-sm font-medium uppercase mb-2">Bot Durumu</h3>
              <p className="text-3xl font-bold text-yellow-500">Beklemede</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition">
              <h3 className="text-gray-400 text-sm font-medium uppercase mb-2">Toplam Kazanç</h3>
              <p className="text-3xl font-bold text-green-500">0 M</p>
            </div>
          </div>

          <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
              Son Aktiviteler
            </h2>
            <p className="text-gray-500 italic">Henüz bir veri bulunmuyor...</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;