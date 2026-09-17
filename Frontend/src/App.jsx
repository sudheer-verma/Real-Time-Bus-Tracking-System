import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';
import UserLayout from './layouts/UserLayout';
import DriverLayout from './layouts/DriverLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserDashboardPage from './pages/user/UserDashboardPage';
import BusListPage from './pages/user/BusListPage';
import LiveTrackingPage from './pages/user/LiveTrackingPage';
import RoutesPage from './pages/user/RoutesPage';
import RouteDetailsPage from './pages/user/RouteDetailsPage';
import EtaPage from './pages/user/EtaPage';
import ComplaintsPage from './pages/user/ComplaintsPage';
import ProfilePage from './pages/user/ProfilePage';
import DriverDashboardPage from './pages/driver/DriverDashboardPage';
import DriverAssignmentPage from './pages/driver/DriverAssignmentPage';
import DriverTripPage from './pages/driver/DriverTripPage';
import DriverGpsPage from './pages/driver/DriverGpsPage';
import DriverProfilePage from './pages/driver/DriverProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBusesPage from './pages/admin/AdminBusesPage';
import AdminDriversPage from './pages/admin/AdminDriversPage';
import AdminRoutesPage from './pages/admin/AdminRoutesPage';
import AdminStopsPage from './pages/admin/AdminStopsPage';
import AdminAssignmentsPage from './pages/admin/AdminAssignmentsPage';
import AdminTripsPage from './pages/admin/AdminTripsPage';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminLiveBusesPage from './pages/admin/AdminLiveBusesPage';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">Loading your workspace...</div>;
  }

  const defaultHome = user ? { user: '/user/dashboard', driver: '/driver/dashboard', admin: '/admin/dashboard' }[user.role] || '/login' : '/login';

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Navigate to={defaultHome} replace />} />

        <Route path="user" element={<RoleRoute allowedRoles={['user']}><UserLayout /></RoleRoute>}>
          <Route path="dashboard" element={<UserDashboardPage />} />
          <Route path="buses" element={<BusListPage />} />
          <Route path="track/:busId" element={<LiveTrackingPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="routes/:routeId" element={<RouteDetailsPage />} />
          <Route path="eta/:busId" element={<EtaPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="driver" element={<RoleRoute allowedRoles={['driver']}><DriverLayout /></RoleRoute>}>
          <Route path="dashboard" element={<DriverDashboardPage />} />
          <Route path="assignment" element={<DriverAssignmentPage />} />
          <Route path="trip" element={<DriverTripPage />} />
          <Route path="gps" element={<DriverGpsPage />} />
          <Route path="profile" element={<DriverProfilePage />} />
        </Route>

        <Route path="admin" element={<RoleRoute allowedRoles={['admin']}><AdminLayout /></RoleRoute>}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="live-buses" element={<AdminLiveBusesPage />} />
          <Route path="buses" element={<AdminBusesPage />} />
          <Route path="drivers" element={<AdminDriversPage />} />
          <Route path="routes" element={<AdminRoutesPage />} />
          <Route path="stops" element={<AdminStopsPage />} />
          <Route path="assignments" element={<AdminAssignmentsPage />} />
          <Route path="trips" element={<AdminTripsPage />} />
          <Route path="complaints" element={<AdminComplaintsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={defaultHome} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
