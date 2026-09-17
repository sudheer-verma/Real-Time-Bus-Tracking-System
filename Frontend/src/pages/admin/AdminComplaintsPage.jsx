import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getStatusBadgeClasses } from '../../components/maps/BusMap';

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      setComplaints(response.complaints || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const updateStatus = async (complaintId, status) => {
    try {
      await api.patch(`/complaints/${complaintId}/status`, { status });
      await loadComplaints();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Complaint queue</h1>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="space-y-3">
          {loading ? (
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          ) : complaints.map((complaint) => (
            <div key={complaint._id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{complaint.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{complaint.description}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-1">{complaint.category}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">{complaint.priority}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">{complaint.user?.name || 'Passenger'}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Pending', 'In Progress', 'Resolved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateStatus(complaint._id, status)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintsPage;
