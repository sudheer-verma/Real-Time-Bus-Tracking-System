import { NavLink, Outlet } from 'react-router-dom';
import { Bus, Gauge, LogOut, MapPinned, Route, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/driver/dashboard', icon: Gauge },
  { label: 'My Assignment', to: '/driver/assignment', icon: Route },
  { label: 'Trip', to: '/driver/trip', icon: Bus },
  { label: 'Live GPS', to: '/driver/gps', icon: MapPinned },
  { label: 'Profile', to: '/driver/profile', icon: UserRound },
];

const DriverLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-5 shadow-sm lg:flex lg:flex-col">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-violet-600 p-2 text-white">
            <Bus size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">TransitFlow</p>
            <h1 className="text-lg font-bold text-slate-900">Driver Console</h1>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-100' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Driver</p>
          <p className="mt-2 font-semibold text-slate-900">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
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
            <div className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              DRIVER
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

export default DriverLayout;
