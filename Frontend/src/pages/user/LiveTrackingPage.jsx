import { useEffect, useMemo, useState } from 'react';
import { MapPinned, RadioTower, TimerReset } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import BusMap from '../../components/maps/BusMap';
import { useBusTracking } from '../../hooks/useBusTracking';
import { getStatusBadgeClasses } from '../../components/maps/BusMap';

const LiveTrackingPage = () => {
  const { busId } = useParams();
  const [bus, setBus] = useState(null);
  const [route, setRoute] = useState(null);
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(true);
  const { connected, liveLocation, status, error } = useBusTracking(busId);

  useEffect(() => {
    const loadBus = async () => {
      try {
        setLoading(true);
        const [busResponse, etaResponse] = await Promise.all([
          api.get(`/passengers/buses/${busId}/live`),
          api.get(`/passengers/buses/${busId}/eta`),
        ]);

        const routeData = busResponse.bus?.route || null;
        setBus({ ...busResponse.bus, status: busResponse.bus?.status || status });
        setRoute(routeData);
        setEta(etaResponse);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (busId) loadBus();
  }, [busId, status]);

  const activeLocation = liveLocation || bus?.currentLocation;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Bus tracking</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{bus?.busNumber || 'Live tracker'}</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <RadioTower size={16} className={connected ? 'text-emerald-600' : 'text-slate-400'} />
            {connected ? 'Connected' : 'Connecting'}
          </div>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <BusMap bus={bus ? { ...bus, currentLocation: activeLocation } : null} routeStops={route?.stops || []} />

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Arrival details</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Next stop</p>
                  <p className="mt-3 text-xl font-bold text-slate-900">{eta?.nextStop?.name || 'N/A'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Distance</p>
                  <p className="mt-3 text-xl font-bold text-slate-900">{eta?.distanceKm ?? 0} km</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ETA</p>
                  <p className="mt-3 text-xl font-bold text-slate-900">{eta?.etaMinutes ?? 0} min</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Vehicle status</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between"><span>Current status</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(status || bus?.status)}`}>{status || bus?.status || 'N/A'}</span></div>
                <div className="flex items-center justify-between"><span>Latitude</span><strong>{activeLocation?.latitude ?? 'N/A'}</strong></div>
                <div className="flex items-center justify-between"><span>Longitude</span><strong>{activeLocation?.longitude ?? 'N/A'}</strong></div>
                <div className="flex items-center justify-between"><span>Last update</span><strong>{activeLocation?.updatedAt ? new Date(activeLocation.updatedAt).toLocaleTimeString() : 'N/A'}</strong></div>
                <div className="flex items-center justify-between"><span>Route</span><strong>{route?.name || 'N/A'}</strong></div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Live movement</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2"><MapPinned size={16} className="text-sky-600" /> <span>{activeLocation ? 'Tracking active' : 'Waiting for position data'}</span></div>
                <div className="flex items-center gap-2"><TimerReset size={16} className="text-sky-600" /> <span>{activeLocation?.updatedAt ? `Updated ${new Date(activeLocation.updatedAt).toLocaleTimeString()}` : 'Awaiting update'}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTrackingPage;
