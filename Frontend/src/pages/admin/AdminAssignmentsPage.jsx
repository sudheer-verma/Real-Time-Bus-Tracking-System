import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminAssignmentsPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ driverId: '', busId: '', routeId: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [driverRes, busRes, routeRes] = await Promise.all([
          api.get('/drivers'),
          api.get('/buses'),
          api.get('/routes'),
        ]);
        setDrivers(driverRes.drivers || []);
        setBuses(busRes.buses || []);
        setRoutes(routeRes.routes || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/assignments/driver', form);
      setForm({ driverId: '', busId: '', routeId: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-3xl font-bold text-slate-900">Assignment center</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          {routes.map((route) => <option key={route._id} value={route._id}>{route.routeNumber} - {route.name}</option>)}
        </select>
        <button type="submit" className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white">Assign driver, bus and route</button>
      </form>
    </div>
  );
};

export default AdminAssignmentsPage;
