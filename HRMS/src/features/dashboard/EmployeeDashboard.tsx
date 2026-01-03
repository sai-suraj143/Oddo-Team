import React, { useState, useEffect } from 'react';
import {
    Calendar,
    LogOut,
    CheckCircle,
    Briefcase,
    User,
    Clock,
    Home,
    DollarSign,
    type LucideIcon
} from 'lucide-react';
import type { UserType } from '../../utils/constants';
import type { SubViewType } from '../../App';

// Import your components (Ensure these paths match your project structure)
import { ProfileView } from '../profile/ProfileView';
import { AttendanceTracker } from '../attendance/AttendanceTracker'; // Check if this is a default or named export in your file
import { LeaveApplication } from '../leave/LeaveApplication'; // Placeholder if not yet created
import { PayrollView } from '../payroll/PayrollView'; // Placeholder if not yet created

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${color.split(' ')[0]} bg-opacity-10`}>
                <Icon size={24} className={color.split(' ')[1]} />
            </div>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
);

interface DashboardProps {
    user: UserType;
    onLogout: () => void;
    subView: SubViewType;
    setSubView: (view: SubViewType) => void;
}

const EmployeeDashboard: React.FC<DashboardProps> = ({ user, onLogout, subView, setSubView }) => {
    // --- CHECK-IN LOGIC STATE ---
    const [attendanceStatus, setAttendanceStatus] = useState<'Absent' | 'Present'>('Absent');
    const [checkInTime, setCheckInTime] = useState<string | null>(null);

    // Fetch initial status
    useEffect(() => {
        const fetchStatus = async () => {
            if (!user._id) return;
            try {
                // This route needs to exist in your backend (see Step 2 below)
                const res = await fetch(`/api/attendance/today/${user._id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'Present') {
                        setAttendanceStatus('Present');
                        setCheckInTime(data.checkIn);
                    } else {
                        setAttendanceStatus('Absent');
                        setCheckInTime(null);
                    }
                }
            } catch (err) {
                console.error("Error fetching attendance status", err);
            }
        };
        fetchStatus();
    }, [user._id]);

    const handleCheckInToggle = async () => {
        if (!user._id) {
            alert("User ID missing. Please re-login.");
            return;
        }

        try {
            const endpoint = attendanceStatus === 'Absent' ? '/api/attendance/checkin' : '/api/attendance/checkout';
            console.log(`Sending request to ${endpoint}`);

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });

            console.log("Response status:", res.status);

            // Try to parse JSON, but handle if it fails (e.g. 404 HTML)
            let data;
            try {
                const text = await res.text();
                data = text ? JSON.parse(text) : {};
            } catch (e) {
                console.error("Failed to parse response JSON", e);
                alert(`Server error (${res.status}): The server returned an invalid response. Please restart the backend.`);
                return;
            }

            if (res.ok) {
                if (attendanceStatus === 'Absent') {
                    setAttendanceStatus('Present');
                    setCheckInTime(data.checkIn);
                } else {
                    setAttendanceStatus('Absent');
                    setCheckInTime(null);
                }
            } else {
                alert(`Request failed: ${data.message || res.statusText}`);
            }
        } catch (err: any) {
            console.error("Attendance action failed", err);
            alert(`Network error: ${err.message}. Is the server running?`);
        }
    };

    // FIXED: Removed extra spaces in class string
    const navItemClasses = (isActive: boolean) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full mb-1 ${isActive
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
            : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
        }`;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6">
                <div className="flex items-center gap-2 mb-10 text-indigo-600">
                    {/* Ensure this image exists in your public folder */}
                    <img src="/OdooLogo.png" alt="Odoo Logo" className="h-14 w-auto" />
                </div>

                <nav className="flex-1">
                    <button onClick={() => setSubView('home')} className={navItemClasses(subView === 'home')}>
                        <Home size={20} /> <span className="font-medium">Dashboard</span>
                    </button>
                    <button onClick={() => setSubView('profile')} className={navItemClasses(subView === 'profile')}>
                        <User size={20} /> <span className="font-medium">My Profile</span>
                    </button>
                    <button onClick={() => setSubView('attendance')} className={navItemClasses(subView === 'attendance')}>
                        <Clock size={20} /> <span className="font-medium">Attendance</span>
                    </button>
                    <button onClick={() => setSubView('leave')} className={navItemClasses(subView === 'leave')}>
                        <Calendar size={20} /> <span className="font-medium">Leave & Time Off</span>
                    </button>
                    <button onClick={() => setSubView('payroll')} className={navItemClasses(subView === 'payroll')}>
                        <DollarSign size={20} /> <span className="font-medium">Payroll</span>
                    </button>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{user.role}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-medium w-full transition-colors">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {subView === 'home' && `Welcome back, ${user.name ? user.name.split(' ')[0] : 'Employee'}! 👋`}
                            {subView === 'profile' && 'Profile Management'}
                            {subView === 'attendance' && 'Attendance Tracker'}
                            {subView === 'leave' && 'Leave Management'}
                            {subView === 'payroll' && 'Payroll Information'}
                        </h1>
                    </div>

                    {/* QUICK CHECK-IN BUTTON IN HEADER */}
                    <button
                        onClick={handleCheckInToggle}
                        // FIXED: Removed extra spaces in class string
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all shadow-sm border ${attendanceStatus === 'Present'
                            ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                            }`}
                    >
                        {attendanceStatus === 'Present' ? <LogOut size={18} /> : <CheckCircle size={18} />}
                        {attendanceStatus === 'Present' ? 'Check Out' : 'Check In'}
                    </button>
                </header>

                <div className="animate-in fade-in duration-500">
                    {subView === 'home' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <StatCard
                                    title="Today's Status"
                                    value={attendanceStatus === 'Present' ? 'Present' : 'Not Marked'}
                                    icon={CheckCircle}
                                    color={attendanceStatus === 'Present' ? "bg-green-500 text-green-500" : "bg-gray-400 text-gray-400"}
                                />
                                <StatCard title="Pending Tasks" value="4" icon={Briefcase} color="bg-orange-500 text-orange-500" />
                                <StatCard title="Leave Balance" value="12 Days" icon={Calendar} color="bg-blue-500 text-blue-500" />
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {checkInTime && (
                                        <div className="flex items-center gap-4 text-sm text-gray-600 border-b border-gray-50 pb-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span>You checked in at <b>{checkInTime}</b> today.</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <span>System welcome message.</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {subView === 'profile' && <ProfileView userRole={user.role} userId={user._id || ''} />}

                    {subView === 'attendance' && (
                        <AttendanceTracker
                            isCheckedIn={attendanceStatus === 'Present'}
                            checkInTime={checkInTime}
                            onToggle={handleCheckInToggle}
                            userId={user._id || ''}
                        />
                    )}

                    {subView === 'leave' && <LeaveApplication userId={user._id || ''} />}
                    {subView === 'payroll' && <PayrollView userId={user._id || ''} />}
                </div>
            </main>
        </div>
    );
};

export default EmployeeDashboard;