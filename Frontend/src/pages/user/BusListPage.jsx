import { useEffect, useMemo, useState } from 'react';
import { MapPinned, Search, TimerReset } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { getStatusBadgeClasses } from '../../components/maps/BusMap';

const BusListPage = () => {
  const [buses, setBuses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBuses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/passenger/buses');
        setBuses(response.buses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBuses();
  }, []);

  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      const matchesSearch = !search || bus.busNumber?.toLowerCase().includes(search.toLowerCase()) || bus.route?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || bus.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [buses, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Live bus directory</h1>
        <p className="mt-2 text-sm text-slate-500">Track service status, route details, and live availability.</p>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bus number or route" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 outline-none focus:border-sky-500" />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500">
            <option value="All">All statuses</option>
            <option value="Running">Running</option>
            <option value="Delayed">Delayed</option>
            <option value="Stopped">Stopped</option>
            <option value="Breakdown">Breakdown</option>
            <option value="Emergency">Emergency</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-52 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredBuses.map((bus) => (
            <div key={bus._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bus {bus.busNumber}</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">{bus.route?.name || 'No route assigned'}</h3>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(bus.status)}`}>{bus.status}</span>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><strong>Route:</strong> {bus.route?.routeNumber || 'N/A'}</p>
                <p><strong>Driver:</strong> {bus.driver?.name || 'Unavailable'}</p>
                <p><strong>Current location:</strong> {bus.currentLocation?.latitude && bus.currentLocation?.longitude ? 'Live' : 'Unavailable'}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link to={`/user/track/${bus._id}`} className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white">Track</Link>
                <Link to={`/user/eta/${bus._id}`} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">ETA</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusListPage;
