import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export const AdminLeaveDashboard: React.FC = () => {
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const fetchLeaves = async () => {
        try {
            const res = await fetch('/api/leave/all');
            if (res.ok) {
                const data = await res.json();
                setLeaves(data);
            }
        } catch (err) {
            console.error("Error fetching admin leaves", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleAction = async (leaveId: string, status: 'Approved' | 'Rejected') => {
        try {
            const res = await fetch(`/api/leave/${leaveId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // Optimistic update
                setLeaves(leaves.map(l => l._id === leaveId ? { ...l, status } : l));
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading leave requests...</div>;

    const filteredLeaves = filter === 'All' ? leaves : leaves.filter(l => l.status === filter);

    return (
        <div className="space-y-6">
            {/* Header / Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Clock size={20} className="text-indigo-600" /> Leave Requests
                </h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === status ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredLeaves.map((leave) => (
                                <tr key={leave._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-gray-900">{leave.userId?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500">{leave.userId?.empId}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{leave.leaveType}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{leave.reason}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={leave.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {leave.status === 'Pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(leave._id, 'Approved')}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded" title="Approve"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(leave._id, 'Rejected')}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded" title="Reject"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredLeaves.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No requests found.</td>
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
