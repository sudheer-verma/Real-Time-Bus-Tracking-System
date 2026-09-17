import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminStopsPage = () => {
  const [stops, setStops] = useState([]);
  const [form, setForm] = useState({ name: '', latitude: '', longitude: '', sequence: '', estimatedArrivalMinutes: '' });
  const [loading, setLoading] = useState(true);

  const loadStops = async () => {
    try {
      const response = await api.get('/stops');
      setStops(response.stops || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStops();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/stops', {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        sequence: Number(form.sequence),
        estimatedArrivalMinutes: Number(form.estimatedArrivalMinutes || 0),
      });
      setForm({ name: '', latitude: '', longitude: '', sequence: '', estimatedArrivalMinutes: '' });
      await loadStops();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Stop management</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Create stop</h2>
          <div className="mt-5 space-y-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Stop name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <div className="grid gap-4 md:grid-cols-2">
              <input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="Latitude" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
              <input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="Longitude" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input value={form.sequence} onChange={(e) => setForm({ ...form, sequence: e.target.value })} type="number" placeholder="Sequence" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
              <input value={form.estimatedArrivalMinutes} onChange={(e) => setForm({ ...form, estimatedArrivalMinutes: e.target.value })} type="number" placeholder="ETA minutes" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            </div>
            <button type="submit" className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white">Create stop</button>
          </div>
        </form>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Stop list</h2>
          <div className="mt-4 space-y-3">
            {loading ? <div className="h-20 animate-pulse rounded-2xl bg-slate-100" /> : stops.map((stop) => (
              <div key={stop._id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{stop.name}</p>
                <p className="text-sm text-slate-600">Sequence: {stop.sequence}</p>
                <p className="text-sm text-slate-600">{stop.latitude}, {stop.longitude}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStopsPage;
