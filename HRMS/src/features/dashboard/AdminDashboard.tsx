import React, { useState } from 'react';
import {
    Users,
    CheckSquare,
    ClipboardList,
    LogOut,
    Search,
    UserPlus
} from 'lucide-react';
import type { UserType } from '../../utils/constants';

// We'll define these simple sub-components below
import EmployeeList from './EmployeeList';
import AllAttendance from './AllAttendance';
import { AdminLeaveDashboard } from '../leave/AdminLeaveDashboard';
import { AdminPayroll } from '../payroll/AdminPayroll';
import { DollarSign } from 'lucide-react'; // Import DollarSign icon

interface AdminDashboardProps {
    user: UserType;
    onLogout: () => void;
}


const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
    const [adminView, setAdminView] = useState<'users' | 'attendance' | 'leaves' | 'payroll'>('users');

    const navItemClasses = (isActive: boolean) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full mb-1 ${isActive
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
            : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
        }`;

    // --- ADD EMPLOYEE LOGIC ---
    const [showAddModal, setShowAddModal] = useState(false);
    const [empData, setEmpData] = useState({
        name: '', email: '', role: 'Employee', department: '', designation: '', salary: ''
    });

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/add-employee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(empData)
            });
            if (res.ok) {
                alert("Employee added successfully!");
                setShowAddModal(false);
                setEmpData({ name: '', email: '', role: 'Employee', department: '', designation: '', salary: '' });
                // Note: ideally we should trigger a refresh of EmployeeList here, 
                // but since these are separate components, a simple way is to reload or use context. 
                // For now, simple reload works or user navigates back and forth.
                if (adminView === 'users') {
                    // Force refresh trick or just let user re-navigate
                    setAdminView('attendance'); // toggle
                    setTimeout(() => setAdminView('users'), 50);
                }
            } else {
                alert("Failed to add employee");
            }
        } catch (err) {
            console.error("Error adding employee", err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6">
                <div className="flex items-center gap-2 mb-10 text-indigo-600">
                    <img src="/OdooLogo.png" alt="Odoo Logo" className="h-10 w-auto" />
                    <span className="text-xl font-bold">Odoo</span> <span className="text-[10px] bg-indigo-100 px-2 py-0.5 rounded ml-1">HR</span>
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
                    <button onClick={() => setAdminView('payroll')} className={navItemClasses(adminView === 'payroll')}>
                        <DollarSign size={20} /> <span className="font-medium">Payroll Management</span>
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
                        {adminView === 'payroll' && 'Payroll Management'}
                    </h1>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
                        >
                            <UserPlus size={18} /> Add Employee
                        </button>
                    </div>
                </header>

                {/* Content Render */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {adminView === 'users' && <EmployeeList />}
                    {adminView === 'attendance' && <AllAttendance />}
                    {adminView === 'leaves' && <AdminLeaveDashboard />}
                    {adminView === 'payroll' && <AdminPayroll />}
                </div>
            </main>

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 animate-scaleIn">
                        <h3 className="text-lg font-bold mb-4">Add New Employee</h3>
                        <form onSubmit={handleAddEmployee} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input type="text" required className="w-full border p-2 rounded"
                                    value={empData.name} onChange={e => setEmpData({ ...empData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" required className="w-full border p-2 rounded"
                                    value={empData.email} onChange={e => setEmpData({ ...empData, email: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Role</label>
                                    <select className="w-full border p-2 rounded"
                                        value={empData.role} onChange={e => setEmpData({ ...empData, role: e.target.value })}>
                                        <option value="Employee">Employee</option>
                                        <option value="HR">HR / Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Salary</label>
                                    <input type="text" required className="w-full border p-2 rounded"
                                        value={empData.salary} onChange={e => setEmpData({ ...empData, salary: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Department</label>
                                    <input type="text" required className="w-full border p-2 rounded"
                                        value={empData.department} onChange={e => setEmpData({ ...empData, department: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Designation</label>
                                    <input type="text" required className="w-full border p-2 rounded"
                                        value={empData.designation} onChange={e => setEmpData({ ...empData, designation: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;