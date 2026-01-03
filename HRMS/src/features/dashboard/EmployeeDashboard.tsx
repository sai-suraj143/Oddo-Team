import React from 'react';
import { LayoutDashboard, Calendar, LogOut, Bell, CheckCircle, Briefcase, type LucideIcon } from 'lucide-react';
import type { UserType } from '../../utils/constants';

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}><Icon size={24} className={color.replace('bg-', 'text-')} /></div>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
);

const EmployeeDashboard: React.FC<{ user: UserType; onLogout: () => void }> = ({ user, onLogout }) => (
    <div className="flex h-screen bg-gray-50">
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6">
            <div className="flex items-center gap-2 mb-10 text-indigo-600"><LayoutDashboard size={28} /><span className="text-xl font-bold">NexusPortal</span></div>
            <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">{user.name.charAt(0)}</div>
                    <div><p className="text-sm font-medium">{user.name}</p><p className="text-xs text-gray-500">{user.role}</p></div>
                </div>
                <button onClick={onLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-medium w-full"><LogOut size={16} /> Sign Out</button>
            </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                <button className="p-2 text-gray-400 hover:text-indigo-600"><Bell size={20} /></button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Attendance" value="92%" icon={CheckCircle} color="bg-green-500 text-green-500" />
                <StatCard title="Pending Tasks" value="4" icon={Briefcase} color="bg-orange-500 text-orange-500" />
                <StatCard title="Leave Balance" value="12 Days" icon={Calendar} color="bg-blue-500 text-blue-500" />
            </div>
        </main>
    </div>
);
export default EmployeeDashboard;