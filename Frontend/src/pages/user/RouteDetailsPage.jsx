import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const RouteDetailsPage = () => {
  const { routeId } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoute = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/passenger/routes/${routeId}`);
        setRoute(response.route || response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (routeId) loadRoute();
  }, [routeId]);

  if (loading) return <div className="rounded-3xl bg-white p-6 shadow-sm">Loading route...</div>;
  if (!route) return <div className="rounded-3xl bg-white p-6 shadow-sm">Route details unavailable.</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-600">Route</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{route.name}</h1>
        <p className="mt-2 text-sm text-slate-500">{route.routeNumber} • {route.startPoint?.name} to {route.endPoint?.name}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Route summary</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p><strong>Start:</strong> {route.startPoint?.name}</p>
            <p><strong>End:</strong> {route.endPoint?.name}</p>
            <p><strong>Estimated duration:</strong> {route.estimatedDuration || 0} min</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Stops timeline</h2>
          <div className="mt-5 space-y-4">
            {(route.stops || []).sort((a,b)=> (a.sequence || 0) - (b.sequence || 0)).map((stop, index) => (
              <div key={stop._id || index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">{index + 1}</div>
                  {index < (route.stops || []).length - 1 && <div className="mt-2 h-12 w-px bg-slate-200" />}
                </div>
                <div className="flex-1 rounded-2xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">{stop.name}</p>
                  <p className="text-xs text-slate-500">Sequence {stop.sequence} • ETA {stop.estimatedArrivalMinutes || 0} min</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailsPage;
