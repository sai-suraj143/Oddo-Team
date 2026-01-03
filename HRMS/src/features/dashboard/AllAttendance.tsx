import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const AllAttendance: React.FC = () => {
    // Mock data
    const logs = [
        { id: 1, name: "Alice Johnson", date: "Today", in: "09:00 AM", out: "---", status: "Present" },
        { id: 2, name: "Bob Smith", date: "Today", in: "09:15 AM", out: "06:00 PM", status: "Present" },
        { id: 3, name: "Charlie Brown", date: "Today", in: "---", out: "---", status: "Absent" },
    ];

    return (
        <div className="overflow-x-auto">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-700 flex items-center gap-2"><Clock size={18} /> Today's Overview</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Check In</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{log.name}</td>
                            <td className="px-6 py-4 text-gray-500 font-mono">{log.in}</td>
                            <td className="px-6 py-4">
                                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full w-fit ${log.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {log.status === 'Present' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                    {log.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllAttendance;
