import { useEffect, useState } from 'react';
import api from '../../services/api';

const DriverAssignmentPage = () => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/drivers/my-assignment');
        setAssignment(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="rounded-3xl bg-white p-6 shadow-sm">Loading assignment...</div>;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-3xl font-bold text-slate-900">My assignment</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Assigned bus</p><p className="mt-2 text-xl font-bold text-slate-900">{assignment?.bus?.busNumber || 'N/A'}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Registration</p><p className="mt-2 text-xl font-bold text-slate-900">{assignment?.bus?.registrationNumber || 'N/A'}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bus status</p><p className="mt-2 text-xl font-bold text-slate-900">{assignment?.bus?.status || 'N/A'}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Route</p><p className="mt-2 text-xl font-bold text-slate-900">{assignment?.route?.routeNumber || 'N/A'}</p></div>
      </div>
      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Assigned route: {assignment?.route?.name || 'N/A'}</p>
        <p className="mt-2 text-sm text-slate-600">Stops: {(assignment?.route?.stops || []).length}</p>
      </div>
    </div>
  );
};

export default DriverAssignmentPage;
