import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminBusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({ busNumber: '', registrationNumber: '', capacity: '', status: 'Inactive' });
  const [loading, setLoading] = useState(true);

  const loadBuses = async () => {
    try {
      const response = await api.get('/buses');
      setBuses(response.buses || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/buses', { ...form, capacity: Number(form.capacity) });
      setForm({ busNumber: '', registrationNumber: '', capacity: '', status: 'Inactive' });
      await loadBuses();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Bus management</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Create bus</h2>
          <div className="mt-5 space-y-4">
            <input value={form.busNumber} onChange={(e) => setForm({ ...form, busNumber: e.target.value })} placeholder="Bus number" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <input value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} placeholder="Registration number" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="Capacity" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <button type="submit" className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white">Create bus</button>
          </div>
        </form>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Bus list</h2>
          <div className="mt-4 space-y-3">
            {loading ? <div className="h-20 animate-pulse rounded-2xl bg-slate-100" /> : buses.map((bus) => (
              <div key={bus._id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between"><p className="font-semibold text-slate-900">{bus.busNumber}</p><span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{bus.status}</span></div>
                <p className="mt-2 text-sm text-slate-600">Registration: {bus.registrationNumber}</p>
                <p className="text-sm text-slate-600">Capacity: {bus.capacity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBusesPage;
