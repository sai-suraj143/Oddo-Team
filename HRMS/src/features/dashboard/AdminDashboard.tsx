import React, { useState } from 'react';
import {
    Users,
    CheckSquare,
    ClipboardList,
    LogOut,
    LayoutDashboard,
    Search,
    UserPlus
} from 'lucide-react';
import type { UserType } from '../../utils/constants';

// We'll define these simple sub-components below
import EmployeeList from './EmployeeList';
import AllAttendance from './AllAttendance';

interface AdminDashboardProps {
    user: UserType;
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
    const [adminView, setAdminView] = useState<'users' | 'attendance' | 'leaves'>('users');

    const navItemClasses = (isActive: boolean) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full mb-1 ${isActive
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
            : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
        }`;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6">
                <div className="flex items-center gap-2 mb-10 text-indigo-600 font-bold text-xl">
                    <LayoutDashboard size={28} /> NexusPortal <span className="text-[10px] bg-indigo-100 px-2 py-0.5 rounded ml-1">HR</span>
                </div>

                <nav className="flex-1">
                    <button onClick={() => setAdminView('users')} className={navItemClasses(adminView === 'users')}>
                        <Users size={20} /> <span className="font-medium">Employees</span>
                    </button>
                    <button onClick={() => setAdminView('attendance')} className={navItemClasses(adminView === 'attendance')}>
                        <CheckSquare size={20} /> <span className="font-medium">All Attendance</span>
                    </button>
                    <button onClick={() => setAdminView('leaves')} className={navItemClasses(adminView === 'leaves')}>
                        <ClipboardList size={20} /> <span className="font-medium">Leave Requests</span>
                    </button>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500 uppercase">Administrator</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-medium w-full">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {adminView === 'users' && 'Employee Directory'}
                        {adminView === 'attendance' && 'Daily Attendance Logs'}
                        {adminView === 'leaves' && 'Leave Approvals'}
                    </h1>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm">
                            <UserPlus size={18} /> Add Employee
                        </button>
                    </div>
                </header>

                {/* Content Render */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {adminView === 'users' && <EmployeeList />}
                    {adminView === 'attendance' && <AllAttendance />}
                    {adminView === 'leaves' && (
                        <div className="p-20 text-center text-gray-400">No pending leave requests found.</div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;