import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        const response = await api.get('/passenger/routes');
        setRoutes(response.routes || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, []);

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => !search || route.name?.toLowerCase().includes(search.toLowerCase()) || route.routeNumber?.toLowerCase().includes(search.toLowerCase()));
  }, [routes, search]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Available routes</h1>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search routes" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 outline-none focus:border-sky-500" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredRoutes.map((route) => (
          <div key={route._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{route.routeNumber}</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{route.name}</h2>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">{route.startPoint?.name} → {route.endPoint?.name}</p>
            <p className="mt-2 text-sm text-slate-500">{route.stops?.length || 0} stops • {route.estimatedDuration || 0} min</p>
            <Link to={`/user/routes/${route._id}`} className="mt-5 inline-flex rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white">View route</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutesPage;
