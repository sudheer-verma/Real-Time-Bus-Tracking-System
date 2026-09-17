import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DriverProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-violet-600">Profile</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{user?.name}</h1>
        </div>
        <button type="button" onClick={logout} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p><p className="mt-2 text-lg font-semibold text-slate-900">{user?.email}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Phone</p><p className="mt-2 text-lg font-semibold text-slate-900">{user?.phone}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Role</p><p className="mt-2 text-lg font-semibold text-slate-900">{user?.role}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Account</p><p className="mt-2 text-lg font-semibold text-emerald-600">Active</p></div>
      </div>
    </div>
  );
};

export default DriverProfilePage;
