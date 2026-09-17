import { useEffect, useState } from 'react';
import api from '../../services/api';

const kpiMeta = [
  { key: 'users.total', label: 'Users', color: 'bg-sky-50 text-sky-700' },
  { key: 'drivers.total', label: 'Drivers', color: 'bg-violet-50 text-violet-700' },
  { key: 'buses.total', label: 'Buses', color: 'bg-emerald-50 text-emerald-700' },
  { key: 'routes.active', label: 'Routes', color: 'bg-amber-50 text-amber-700' },
  { key: 'trips.total', label: 'Trips', color: 'bg-rose-50 text-rose-700' },
  { key: 'complaints.total', label: 'Complaints', color: 'bg-slate-100 text-slate-700' },
];

const formatValue = (data, key) => {
  const parts = key.split('.');
  let value = data;
  for (const part of parts) value = value?.[part];
  return value ?? 0;
};

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/dashboard');
        setData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="rounded-3xl bg-white p-6 shadow-sm">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Operations overview</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Admin dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpiMeta.map(({ key, label, color }) => (
          <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{label}</p>
              <div className={`rounded-xl px-2 py-1 text-xs font-semibold ${color}`}>{key.includes('total') ? 'Total' : 'Active'}</div>
            </div>
            <p className="mt-5 text-3xl font-bold text-slate-900">{formatValue(data, key)}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Bus health</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span>Running</span><strong>{data?.buses?.running || 0}</strong></div>
            <div className="flex items-center justify-between"><span>Delayed</span><strong>{data?.buses?.delayed || 0}</strong></div>
            <div className="flex items-center justify-between"><span>Stopped</span><strong>{data?.buses?.stopped || 0}</strong></div>
            <div className="flex items-center justify-between"><span>Breakdown</span><strong>{data?.buses?.breakdown || 0}</strong></div>
            <div className="flex items-center justify-between"><span>Emergency</span><strong>{data?.buses?.emergency || 0}</strong></div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Trip and complaints</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span>Running trips</span><strong>{data?.trips?.running || 0}</strong></div>
            <div className="flex items-center justify-between"><span>Completed trips</span><strong>{data?.trips?.completed || 0}</strong></div>
            <div className="flex items-center justify-between"><span>Cancelled trips</span><strong>{data?.trips?.cancelled || 0}</strong></div>
            <div className="flex items-center justify-between"><span>Pending complaints</span><strong>{data?.complaints?.pending || 0}</strong></div>
            <div className="flex items-center justify-between"><span>Resolved complaints</span><strong>{data?.complaints?.resolved || 0}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
