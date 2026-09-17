import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const EtaPage = () => {
  const { busId } = useParams();
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEta = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/passenger/buses/${busId}/eta`);
        setEta(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (busId) loadEta();
  }, [busId]);

  if (loading) return <div className="rounded-3xl bg-white p-6 shadow-sm">Loading ETA...</div>;

  if (!eta) return <div className="rounded-3xl bg-white p-6 shadow-sm">ETA unavailable for this bus.</div>;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs uppercase tracking-[0.3em] text-sky-600">Estimated arrival</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">{eta.bus?.busNumber}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Next stop</p><p className="mt-3 text-xl font-bold text-slate-900">{eta.nextStop?.name}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Distance</p><p className="mt-3 text-xl font-bold text-slate-900">{eta.distanceKm} km</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">ETA</p><p className="mt-3 text-xl font-bold text-slate-900">{eta.etaMinutes} min</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Route</p><p className="mt-3 text-xl font-bold text-slate-900">{eta.route?.name}</p></div>
      </div>
    </div>
  );
};

export default EtaPage;
