import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ driverId: '', busId: '', routeId: '' });

  const load = async () => {
    try {
      const [tripRes, driverRes, busRes, routeRes] = await Promise.all([
        api.get('/trips'),
        api.get('/drivers'),
        api.get('/buses'),
        api.get('/routes'),
      ]);
      setTrips(tripRes.trips || []);
      setDrivers(driverRes.drivers || []);
      setBuses(busRes.buses || []);
      setRoutes(routeRes.routes || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/trips', { driverId: form.driverId, busId: form.busId, routeId: form.routeId });
      setForm({ driverId: '', busId: '', routeId: '' });
      await load();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Trip management</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Schedule trip</h2>
          <div className="mt-5 space-y-4">
            <select value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500">
              <option value="">Select driver</option>
              {drivers.map((driver) => <option key={driver._id} value={driver._id}>{driver.user?.name}</option>)}
            </select>
            <select value={form.busId} onChange={(e) => setForm({ ...form, busId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500">
              <option value="">Select bus</option>
              {buses.map((bus) => <option key={bus._id} value={bus._id}>{bus.busNumber}</option>)}
            </select>
            <select value={form.routeId} onChange={(e) => setForm({ ...form, routeId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500">
              <option value="">Select route</option>
              {routes.map((route) => <option key={route._id} value={route._id}>{route.routeNumber}</option>)}
            </select>
            <button type="submit" className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white">Create trip</button>
          </div>
        </form>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Trips</h2>
          <div className="mt-4 space-y-3">
            {trips.map((trip) => (
              <div key={trip._id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{trip.bus?.busNumber} • {trip.driver?.name}</p>
                <p className="text-sm text-slate-600">{trip.route?.name}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{trip.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTripsPage;
