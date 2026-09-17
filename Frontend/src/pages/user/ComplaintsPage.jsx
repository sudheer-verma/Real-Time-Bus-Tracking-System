import { useEffect, useState } from 'react';
import { AlertCircle, PlusCircle } from 'lucide-react';
import api from '../../services/api';
import { getStatusBadgeClasses } from '../../components/maps/BusMap';

const categories = ['Delay', 'Breakdown', 'Driver', 'Overcrowding', 'Route', 'Bus Condition', 'Safety', 'Other'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

const ComplaintsPage = () => {
  const [form, setForm] = useState({ title: '', description: '', category: 'Other', priority: 'Medium', bus: '' });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadComplaints = async () => {
    try {
      const response = await api.get('/complaints/my');
      setComplaints(response.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.description) {
      setError('Title and description are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await api.post('/complaints', form);
      setSuccess('Complaint submitted successfully.');
      setForm({ title: '', description: '', category: 'Other', priority: 'Medium', bus: '' });
      await loadComplaints();
    } catch (err) {
      setError(err.message || 'Unable to submit complaint.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Complaint center</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Report an issue</h2>
          <div className="mt-5 space-y-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Complaint title" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="5" placeholder="Describe the issue" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />

            <div className="grid gap-4 sm:grid-cols-2">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500">
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500">
                {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
              </select>
            </div>

            <input value={form.bus} onChange={(e) => setForm({ ...form, bus: e.target.value })} placeholder="Bus ID (optional)" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-sky-500" />

            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>}

            <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-sky-300">
              <PlusCircle size={18} />
              {saving ? 'Submitting...' : 'Submit complaint'}
            </button>
          </div>
        </form>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">My complaints</h2>
          <div className="mt-4 space-y-3">
            {loading ? (
              <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            ) : complaints.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">No complaints submitted yet.</div>
            ) : (
              complaints.map((complaint) => (
                <div key={complaint._id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-slate-900">{complaint.title}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(complaint.status)}`}>{complaint.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{complaint.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2 py-1">{complaint.category}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">{complaint.priority}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;
