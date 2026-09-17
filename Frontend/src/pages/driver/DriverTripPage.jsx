import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import api from '../../services/api';

const DriverTripPage = () => {
  const [loading, setLoading] = useState({ start: false, end: false });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const actionTrip = async (type) => {
    try {
      setLoading((prev) => ({ ...prev, [type]: true }));
      setNotice('');
      setError('');
      await api.post(`/drivers/my-trip/${type === 'start' ? 'start' : 'end'}`);
      setNotice(type === 'start' ? 'Trip started successfully.' : 'Trip ended successfully.');
    } catch (err) {
      setError(err.message || 'Unable to update trip state.');
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-3xl font-bold text-slate-900">Trip controls</h1>
      <div className="mt-6 flex flex-wrap gap-4">
        <button type="button" disabled={loading.start} onClick={() => actionTrip('start')} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-emerald-300">
          {loading.start ? <span className="flex items-center gap-2"><LoaderCircle className="animate-spin" size={16} /> Starting...</span> : 'START TRIP'}
        </button>
        <button type="button" disabled={loading.end} onClick={() => actionTrip('end')} className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-rose-300">
          {loading.end ? <span className="flex items-center gap-2"><LoaderCircle className="animate-spin" size={16} /> Ending...</span> : 'END TRIP'}
        </button>
      </div>

      {notice && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</div>}
      {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
    </div>
  );
};

export default DriverTripPage;
