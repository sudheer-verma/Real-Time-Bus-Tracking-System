import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ name: '', routeNumber: '', startPoint: { name: '', latitude: '', longitude: '' }, endPoint: { name: '', latitude: '', longitude: '' }, estimatedDuration: '' });
  const [loading, setLoading] = useState(true);

  const loadRoutes = async () => {
    try {
      const response = await api.get('/routes');
      setRoutes(response.routes || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/routes', {
        ...form,
        estimatedDuration: Number(form.estimatedDuration),
        startPoint: {
          name: form.startPoint.name,
          latitude: Number(form.startPoint.latitude),
          longitude: Number(form.startPoint.longitude),
        },
        endPoint: {
          name: form.endPoint.name,
          latitude: Number(form.endPoint.latitude),
          longitude: Number(form.endPoint.longitude),
        },
      });
      setForm({ name: '', routeNumber: '', startPoint: { name: '', latitude: '', longitude: '' }, endPoint: { name: '', latitude: '', longitude: '' }, estimatedDuration: '' });
      await loadRoutes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Route management</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Create route</h2>
          <div className="mt-5 space-y-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Route name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <input value={form.routeNumber} onChange={(e) => setForm({ ...form, routeNumber: e.target.value })} placeholder="Route number" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <input value={form.estimatedDuration} onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })} type="number" placeholder="Estimated duration" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <div className="grid gap-4 md:grid-cols-2">
              <input value={form.startPoint.name} onChange={(e) => setForm({ ...form, startPoint: { ...form.startPoint, name: e.target.value } })} placeholder="Start point" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
              <input value={form.endPoint.name} onChange={(e) => setForm({ ...form, endPoint: { ...form.endPoint, name: e.target.value } })} placeholder="End point" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input value={form.startPoint.latitude} onChange={(e) => setForm({ ...form, startPoint: { ...form.startPoint, latitude: e.target.value } })} placeholder="Start lat" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
              <input value={form.startPoint.longitude} onChange={(e) => setForm({ ...form, startPoint: { ...form.startPoint, longitude: e.target.value } })} placeholder="Start lng" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input value={form.endPoint.latitude} onChange={(e) => setForm({ ...form, endPoint: { ...form.endPoint, latitude: e.target.value } })} placeholder="End lat" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
              <input value={form.endPoint.longitude} onChange={(e) => setForm({ ...form, endPoint: { ...form.endPoint, longitude: e.target.value } })} placeholder="End lng" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            </div>
            <button type="submit" className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white">Create route</button>
          </div>
        </form>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Route list</h2>
          <div className="mt-4 space-y-3">
            {loading ? <div className="h-20 animate-pulse rounded-2xl bg-slate-100" /> : routes.map((route) => (
              <div key={route._id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{route.name}</p>
                <p className="text-sm text-slate-600">{route.routeNumber}</p>
                <p className="text-sm text-slate-600">{route.startPoint?.name} → {route.endPoint?.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutesPage;
