import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Bus, ClipboardList, Gauge, LogOut, MapPinned, Route, ShieldCheck, UserCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: Gauge },
  { label: 'Live Buses', to: '/admin/live-buses', icon: MapPinned },
  { label: 'Buses', to: '/admin/buses', icon: Bus },
  { label: 'Drivers', to: '/admin/drivers', icon: UserCog },
  { label: 'Routes', to: '/admin/routes', icon: Route },
  { label: 'Stops', to: '/admin/stops', icon: ClipboardList },
  { label: 'Assignments', to: '/admin/assignments', icon: ShieldCheck },
  { label: 'Trips', to: '/admin/trips', icon: BarChart3 },
  { label: 'Complaints', to: '/admin/complaints', icon: ClipboardList },
  { label: 'Profile', to: '/admin/profile', icon: UserCog },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-slate-900 p-5 text-slate-100 shadow-sm lg:flex lg:flex-col">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-amber-500 p-2 text-slate-900">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">TransitFlow</p>
            <h1 className="text-lg font-bold text-white">Admin Console</h1>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-slate-800 text-white ring-1 ring-slate-700' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-700 bg-slate-800 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Administrator</p>
          <p className="mt-2 font-semibold text-white">{user?.name}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-sm font-medium text-slate-900"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Operations</p>
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            </div>
            <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              ADMIN
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
