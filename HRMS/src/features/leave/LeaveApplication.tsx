import React, { useState, useEffect } from 'react';
import { Calendar, Send, Clock, AlertCircle } from 'lucide-react';

interface LeaveApplicationProps {
    userId: string;
}

export const LeaveApplication: React.FC<LeaveApplicationProps> = ({ userId }) => {
    const [myLeaves, setMyLeaves] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        leaveType: 'Paid',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchLeaves = async () => {
        try {
            const res = await fetch(`/api/leave/my-leaves/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setMyLeaves(data);
            }
        } catch (err) {
            console.error("Error fetching leaves", err);
        }
    };

    useEffect(() => {
        if (userId) fetchLeaves();
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/leave/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ...formData })
            });

            if (res.ok) {
                setSuccess('Leave application submitted successfully!');
                setFormData({ leaveType: 'Paid', startDate: '', endDate: '', reason: '' });
                fetchLeaves(); // Refresh list
            } else {
                setError('Failed to submit application. Please try again.');
            }
        } catch (err) {
            setError('Network error occurring.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Application Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Apply for Leave</h2>
                        <p className="text-sm text-gray-500">Request time off for approval</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
                        <Calendar size={16} /> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                        <select
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Paid">Paid Leave</option>
                            <option value="Sick">Sick Leave</option>
                            <option value="Unpaid">Unpaid Leave</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <input
                            type="text"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="e.g. Family function, Feeling unwell"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 transition"
                        >
                            {loading ? 'Submitting...' : <><Send size={16} /> Submit Request</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Application History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><Clock size={18} /> My Leave History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Applied On</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {myLeaves.length > 0 ? (
                                myLeaves.map((leave, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-500">{new Date(leave.appliedAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium">{leave.leaveType}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{leave.reason}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={leave.status} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No leave applications found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors: any = {
        'Pending': 'bg-yellow-100 text-yellow-700',
        'Approved': 'bg-green-100 text-green-700',
        'Rejected': 'bg-red-100 text-red-700'
    };
    return (
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${colors[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
};
