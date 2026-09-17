import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BusFront, Clock3, Compass, MapPinned, MessageSquareText, Route, Search, ShieldCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { getStatusBadgeClasses } from '../../components/maps/BusMap';

const formatTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const UserDashboardPage = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [busResponse, routeResponse] = await Promise.all([
          api.get('/passenger/buses'),
          api.get('/passenger/routes'),
        ]);
        setBuses(busResponse.buses || []);
        setRoutes(routeResponse.routes || []);
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const runningCount = useMemo(() => buses.filter((bus) => ['Running', 'Delayed', 'Stopped', 'Breakdown', 'Emergency'].includes(bus.status)).length, [buses]);

  const quickStats = [
    { label: 'Available buses', value: buses.length, icon: BusFront },
    { label: 'Running now', value: runningCount, icon: TrendingUp },
    { label: 'Routes active', value: routes.length, icon: Route },
    { label: 'Complaints', value: 0, icon: MessageSquareText },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Passenger dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Find your next ride</h1>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="text-sky-600" size={18} />
            <input
              className="w-full bg-transparent text-sm placeholder:text-slate-400 outline-none"
              placeholder="Search buses or route numbers"
            />
          </div>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickStats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{label}</p>
              <div className="rounded-xl bg-sky-50 p-2 text-sky-700"><Icon size={18} /></div>
            </div>
            <p className="mt-5 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Nearby buses</h2>
            <Link to="/user/buses" className="text-sm font-semibold text-sky-700">View all</Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {buses.slice(0, 4).map((bus) => (
                <div key={bus._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-lg font-bold text-sky-700">
                      {bus.busNumber}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{bus.route?.name || 'Route not assigned'}</p>
                      <p className="text-sm text-slate-500">{bus.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(bus.status)}`}>
                      {bus.status}
                    </span>
                    <Link to={`/user/track/${bus._id}`} className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white">
                      Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Quick access</h3>
            <div className="mt-4 grid gap-3">
              <Link to="/user/buses" className="flex items-center justify-between rounded-2xl bg-sky-50 p-3 text-sky-800"><span className="flex items-center gap-2"><MapPinned size={16} /> Live tracking</span><span>→</span></Link>
              <Link to="/user/routes" className="flex items-center justify-between rounded-2xl bg-emerald-50 p-3 text-emerald-800"><span className="flex items-center gap-2"><Compass size={16} /> Explore routes</span><span>→</span></Link>
              <Link to="/user/complaints" className="flex items-center justify-between rounded-2xl bg-amber-50 p-3 text-amber-800"><span className="flex items-center gap-2"><MessageSquareText size={16} /> Submit complaint</span><span>→</span></Link>
              <Link to="/user/profile" className="flex items-center justify-between rounded-2xl bg-violet-50 p-3 text-violet-800"><span className="flex items-center gap-2"><ShieldCheck size={16} /> My profile</span><span>→</span></Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Route snapshot</h3>
            <ul className="mt-4 space-y-3">
              {routes.slice(0, 4).map((route) => (
                <li key={route._id} className="rounded-2xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">{route.name}</p>
                  <p className="text-sm text-slate-500">{route.routeNumber} • {route.startPoint?.name} → {route.endPoint?.name}</p>
                  <p className="mt-2 text-xs text-slate-500">ETA {route.estimatedDuration || 0} min</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Status overview</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500"><Clock3 size={16} /> Updated live</div>
        </div>

        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {['Running', 'Delayed', 'Stopped', 'Breakdown', 'Emergency', 'Inactive'].map((status) => {
            const count = buses.filter((bus) => bus.status === status).length;
            return (
              <div key={status} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(status)}`}>{status}</div>
                <p className="mt-4 text-3xl font-bold text-slate-900">{count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
