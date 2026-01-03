import React from 'react';
import { LayoutDashboard, Users, FileText, Calendar, LogOut, Search, Bell, CheckCircle, type LucideIcon } from 'lucide-react';
import type { UserType } from '../../utils/constants';

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
    trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}><Icon size={24} className={color.replace('bg-', 'text-')} /></div>
            {trend && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
);

interface AdminDashboardProps {
    user: UserType;
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user: _user, onLogout }) => (
    <div className="flex h-screen bg-gray-50">
        <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col p-6">
            <div className="flex items-center gap-2 mb-10 text-white"><LayoutDashboard size={28} /><span className="text-xl font-bold">NexusAdmin</span></div>
            <nav className="flex-1 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white"><LayoutDashboard size={20} /> <span className="font-medium">Dashboard</span></button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800"><Users size={20} /> <span className="font-medium">Employees</span></button>
            </nav>
            <div className="mt-auto pt-6 border-t border-slate-800">
                <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium w-full"><LogOut size={16} /> Sign Out</button>
            </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
                <div className="flex items-center gap-4">
                    <div className="relative"><Search className="absolute left-3 top-2.5 text-gray-400" size={18} /><input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none" /></div>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center"><Bell size={20} /></button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard title="Employees" value="1,240" icon={Users} color="bg-indigo-500 text-indigo-500" trend="+12%" />
                <StatCard title="Applications" value="45" icon={FileText} color="bg-purple-500 text-purple-500" trend="+5%" />
                <StatCard title="On Leave" value="12" icon={Calendar} color="bg-orange-500 text-orange-500" />
                <StatCard title="Avg Attendance" value="95%" icon={CheckCircle} color="bg-green-500 text-green-500" />
            </div>
        </main>
    </div>
);

export default AdminDashboard;