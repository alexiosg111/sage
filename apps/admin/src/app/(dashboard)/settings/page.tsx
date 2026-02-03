export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-black uppercase mb-8">Einstellungen</h1>
      
      <div className="bg-white border border-zinc-200 rounded-xl p-8 max-w-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-6">Shop Konfiguration</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Shop Name</label>
            <input 
              type="text" 
              defaultValue="SAGE CLUB Official Store"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2">Kontakt Email</label>
            <input 
              type="email" 
              defaultValue="shop@sage-club.de"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase mb-2">Währung</label>
            <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:border-primary outline-none transition-all">
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <div className="pt-4">
            <button className="bg-black text-white px-8 py-4 rounded-lg font-bold uppercase hover:bg-zinc-800 transition-all">
              Einstellungen speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
