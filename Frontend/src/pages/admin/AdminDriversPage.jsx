import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminDriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', licenseNumber: '', licenseExpiry: '', experienceYears: '' });
  const [loading, setLoading] = useState(true);

  const loadDrivers = async () => {
    try {
      const response = await api.get('/drivers');
      setDrivers(response.drivers || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/drivers', { ...form, experienceYears: Number(form.experienceYears) });
      setForm({ name: '', email: '', phone: '', password: '', licenseNumber: '', licenseExpiry: '', experienceYears: '' });
      await loadDrivers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Driver management</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Create driver</h2>
          <div className="mt-5 space-y-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Password" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <input value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} placeholder="License number" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <input value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} type="date" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <input value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} type="number" placeholder="Experience years" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <button type="submit" className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white">Create driver</button>
          </div>
        </form>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Driver list</h2>
          <div className="mt-4 space-y-3">
            {loading ? <div className="h-20 animate-pulse rounded-2xl bg-slate-100" /> : drivers.map((driver) => (
              <div key={driver._id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between"><p className="font-semibold text-slate-900">{driver.user?.name}</p><span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{driver.isActive ? 'Active' : 'Inactive'}</span></div>
                <p className="mt-2 text-sm text-slate-600">{driver.user?.email}</p>
                <p className="text-sm text-slate-600">License: {driver.licenseNumber}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDriversPage;
