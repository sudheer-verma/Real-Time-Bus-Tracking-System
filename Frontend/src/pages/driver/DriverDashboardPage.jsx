import { useEffect, useState } from 'react';
import api from '../../services/api';
import { BusFront, Gauge, MapPinned, Route as RouteIcon } from 'lucide-react';

const DriverDashboardPage = () => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.get('/drivers/my-assignment');
        setAssignment(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="rounded-3xl bg-white p-6 shadow-sm">Loading driver dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs uppercase tracking-[0.3em] text-violet-600">Driver dashboard</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Ready for service</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">Assigned bus</p><BusFront className="text-violet-600" size={18} /></div><p className="mt-5 text-2xl font-bold text-slate-900">{assignment?.bus?.busNumber || 'N/A'}</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">Status</p><Gauge className="text-violet-600" size={18} /></div><p className="mt-5 text-2xl font-bold text-slate-900">{assignment?.bus?.status || 'N/A'}</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">Route</p><RouteIcon className="text-violet-600" size={18} /></div><p className="mt-5 text-2xl font-bold text-slate-900">{assignment?.route?.routeNumber || 'N/A'}</p></div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">GPS</p><MapPinned className="text-violet-600" size={18} /></div><p className="mt-5 text-2xl font-bold text-slate-900">Ready</p></div>
      </div>
    </div>
  );
};

export default DriverDashboardPage;
