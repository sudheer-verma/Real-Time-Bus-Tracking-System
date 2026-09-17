import { useEffect, useState } from 'react';
import { LoaderCircle, MapPinned, Navigation, Send } from 'lucide-react';
import api from '../../services/api';
import socket from '../../services/socket';
import { useAuth } from '../../context/AuthContext';

const DriverGpsPage = () => {
  const { token } = useAuth();
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [status, setStatus] = useState('Waiting for location');
  const [location, setLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!gpsEnabled) return undefined;

    if (!navigator.geolocation) {
      setStatus('GPS unavailable');
      setError('Geolocation is not supported by this browser.');
      return undefined;
    }

    setStatus('Listening for location');
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const payload = { latitude, longitude };

        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
          setError('Invalid GPS coordinates received.');
          return;
        }

        setLocation(payload);
        setStatus('GPS active');
        setError('');

        socket.auth = { token };
        socket.connect();
        socket.emit('driver-location-update', payload);

        try {
          await api.put('/drivers/my-bus/location', payload);
        } catch (err) {
          console.error(err);
        }
      },
      (geoError) => {
        if (geoError.code === 1) {
          setStatus('Permission denied');
          setError('Location access denied.');
        } else {
          setStatus('GPS unavailable');
          setError('Unable to fetch the current location.');
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
    );

    setWatchId(id);

    return () => {
      if (id) navigator.geolocation.clearWatch(id);
      if (socket.connected) socket.disconnect();
    };
  }, [gpsEnabled, token]);

  const toggleGps = async () => {
    if (gpsEnabled) {
      setGpsEnabled(false);
      setStatus('GPS stopped');
      if (watchId) navigator.geolocation.clearWatch(watchId);
      return;
    }

    if (!navigator.geolocation) {
      setStatus('GPS unavailable');
      return;
    }

    setLoading(true);
    setError('');
    setGpsEnabled(true);
    setLoading(false);
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-3xl font-bold text-slate-900">Live GPS</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          <button type="button" onClick={toggleGps} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white">
            {loading ? <LoaderCircle className="animate-spin" size={16} /> : <Navigation size={16} />}
            {gpsEnabled ? 'Stop GPS sharing' : 'Start GPS sharing'}
          </button>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
            <p className="mt-3 text-xl font-bold text-slate-900">{status}</p>
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Last location</p>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p><strong>Latitude:</strong> {location?.latitude ?? 'Waiting for location'}</p>
            <p><strong>Longitude:</strong> {location?.longitude ?? 'Waiting for location'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverGpsPage;
