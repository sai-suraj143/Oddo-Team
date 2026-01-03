import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, CheckCircle } from 'lucide-react';

export const AdminPayroll: React.FC = () => {
    const [payrolls, setPayrolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    // States for Generation Modal
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        userId: '',
        month: 'October',
        year: new Date().getFullYear(),
        bonus: 0,
        deductions: 0
    });
    const [users, setUsers] = useState<any[]>([]); // To select user

    const fetchPayrolls = async () => {
        try {
            const res = await fetch('/api/payroll/all');
            if (res.ok) setPayrolls(await res.json());
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/all-employees'); // Assuming this route exists from Admin functionality
            if (res.ok) setUsers(await res.json());
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchPayrolls();
        fetchUsers();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading payroll data...</div>;

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            const res = await fetch('/api/payroll/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowModal(false);
                fetchPayrolls();
            }
        } catch (err) {
            console.error("Generate failed");
        } finally {
            setIsGenerating(false);
        }
    };

    const markPaid = async (id: string) => {
        try {
            const res = await fetch(`/api/payroll/${id}/pay`, { method: 'PATCH' });
            if (res.ok) {
                setPayrolls(payrolls.map(p => p._id === id ? { ...p, status: 'Paid' } : p));
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <DollarSign size={20} className="text-green-600" /> Payroll Management
                </h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                >
                    <Plus size={16} /> Generate Payroll
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Month</th>
                                <th className="px-6 py-4">Base</th>
                                <th className="px-6 py-4">Net Salary</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payrolls.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-sm text-gray-900">{p.userId?.name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{p.userId?.empId}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{p.month} {p.year}</td>
                                    <td className="px-6 py-4 text-sm">${p.salary}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">${p.netSalary}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${p.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.status !== 'Paid' && (
                                            <button
                                                onClick={() => markPaid(p._id)}
                                                className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 flex items-center gap-1"
                                            >
                                                <CheckCircle size={12} /> Mark Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 animate-scaleIn">
                        <h3 className="text-lg font-bold mb-4">Generate Payroll</h3>
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Employee</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.empId})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Month</label>
                                    <select
                                        className="w-full border p-2 rounded"
                                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                    >
                                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Year</label>
                                    <input
                                        type="number"
                                        className="w-full border p-2 rounded"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Bonus</label>
                                <input type="number" className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Deductions</label>
                                <input type="number" className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) })} />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" disabled={isGenerating} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                    {isGenerating ? 'Generating...' : 'Generate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
