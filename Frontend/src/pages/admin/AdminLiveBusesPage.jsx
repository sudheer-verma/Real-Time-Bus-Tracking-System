import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getStatusBadgeClasses } from '../../components/maps/BusMap';

const AdminLiveBusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBuses = async () => {
      try {
        const response = await api.get('/buses');
        setBuses(response.buses || []);
      } finally {
        setLoading(false);
      }
    };

    loadBuses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Live buses</h1>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        {loading ? (
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        ) : (
          <div className="space-y-3">
            {buses.map((bus) => (
              <div key={bus._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{bus.busNumber}</p>
                  <p className="text-sm text-slate-600">{bus.route?.name || 'No route assigned'} • {bus.registrationNumber}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(bus.status)}`}>
                  {bus.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLiveBusesPage;
