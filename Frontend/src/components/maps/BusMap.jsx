import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const busIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const statusColors = {
  Running: '#16a34a',
  Delayed: '#f59e0b',
  Stopped: '#64748b',
  Breakdown: '#dc2626',
  Emergency: '#ef4444',
  Inactive: '#6b7280',
};

const BusMap = ({ bus, routeStops = [], center = [0, 0], zoom = 12 }) => {
  const busPosition = bus?.currentLocation ? [bus.currentLocation.latitude, bus.currentLocation.longitude] : center;
  const routeCoordinates = routeStops
    .filter((stop) => stop.latitude && stop.longitude)
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
    .map((stop) => [stop.latitude, stop.longitude]);

  return (
    <div className="h-[360px] w-full overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer center={busPosition} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routeCoordinates.length > 0 && <Polyline positions={routeCoordinates} pathOptions={{ color: '#0ea5e9', weight: 4, opacity: 0.7 }} />}

        {bus && (
          <Marker position={busPosition} icon={busIcon}>
            <Popup>
              <div>
                <strong>{bus.busNumber || 'Bus'}</strong>
                <div>Status: {bus.status}</div>
                <div>Route: {bus.route?.name || 'N/A'}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export const getStatusBadgeClasses = (status) => {
  const palette = {
    Running: 'bg-emerald-100 text-emerald-700',
    Delayed: 'bg-amber-100 text-amber-700',
    Stopped: 'bg-slate-200 text-slate-700',
    Breakdown: 'bg-red-100 text-red-700',
    Emergency: 'bg-rose-100 text-rose-700',
    Inactive: 'bg-gray-200 text-gray-700',
    Pending: 'bg-slate-200 text-slate-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Resolved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
    Low: 'bg-slate-200 text-slate-700',
    Medium: 'bg-amber-100 text-amber-700',
    High: 'bg-orange-100 text-orange-700',
    Critical: 'bg-red-100 text-red-700',
    Scheduled: 'bg-sky-100 text-sky-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-rose-100 text-rose-700',
  };

  return palette[status] || 'bg-slate-100 text-slate-600';
};

export const statusColor = (status) => statusColors[status] || '#64748b';

export default BusMap;
