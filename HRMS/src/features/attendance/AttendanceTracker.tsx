import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, LogIn, LogOut, Calendar as CalIcon } from 'lucide-react';

interface AttendanceTrackerProps {
    userId: string;
    isCheckedIn: boolean;
    checkInTime: string | null;
    onToggle: () => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ userId, isCheckedIn, checkInTime, onToggle }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [history, setHistory] = useState<any[]>([]);

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch History
    useEffect(() => {
        if (!userId) return;
        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/attendance/history/${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } catch (err) {
                console.error("Failed to fetch history", err);
            }
        };
        fetchHistory();
    }, [userId, isCheckedIn]); // Re-fetch when check-in status changes

    const handleAction = () => {
        onToggle();
    };

    return (
        <div className="space-y-6">
            {/* Active Tracker Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="p-4 bg-indigo-50 rounded-full mb-4">
                    <Clock size={40} className="text-indigo-600 animate-pulse" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-2">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </h2>
                <p className="text-gray-500 mb-8">{currentTime.toDateString()}</p>

                <button
                    onClick={handleAction}
                    className={`group flex items-center gap-3 px-12 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${isCheckedIn
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-red-100'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                        }`}
                >
                    {isCheckedIn ? <><LogOut /> Check Out</> : <><LogIn /> Check In</>}
                </button>

                {isCheckedIn && (
                    <p className="mt-4 text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle size={14} /> Logged in at {checkInTime}
                    </p>
                )}
            </div>

            {/* Recent History Table [Requirement 3.4.1] */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><CalIcon size={18} /> Weekly View</h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Recent</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Check In</th>
                                <th className="px-6 py-4">Check Out</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {history.length > 0 ? (
                                history.map((record: any, index: number) => (
                                    <AttendanceRow
                                        key={index}
                                        date={record.date}
                                        in={record.checkIn || '---'}
                                        out={record.checkOut || '---'}
                                        status={record.status}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AttendanceRow = ({ date, in: checkIn, out, status }: any) => {
    const statusColors: any = {
        'Present': 'bg-green-100 text-green-700',
        'Half-day': 'bg-orange-100 text-orange-700',
        'Leave': 'bg-blue-100 text-blue-700',
        'Absent': 'bg-red-100 text-red-700'
    };

    return (
        <tr className="hover:bg-gray-50 transition">
            <td className="px-6 py-4 font-medium">{date}</td>
            <td className="px-6 py-4 text-gray-500">{checkIn}</td>
            <td className="px-6 py-4 text-gray-500">{out}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
                    {status}
                </span>
            </td>
        </tr>
    );
};