import React, { useState, useEffect } from 'react';
import { DollarSign, Download, Calendar } from 'lucide-react';

interface PayrollViewProps {
    userId: string;
}

export const PayrollView: React.FC<PayrollViewProps> = ({ userId }) => {
    const [payrolls, setPayrolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayroll = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`/api/payroll/my-payroll/${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setPayrolls(data);
                }
            } catch (err) {
                console.error("Error fetching payroll", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayroll();
    }, [userId]);

    if (loading) return <div className="text-center p-10">Loading payroll data...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">My Payroll</h2>
                        <p className="text-sm text-gray-500">View and download salary slips</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Month/Year</th>
                                <th className="px-6 py-4">Base Salary</th>
                                <th className="px-6 py-4">Additions</th>
                                <th className="px-6 py-4">Deductions</th>
                                <th className="px-6 py-4">Net Salary</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-50">
                            {payrolls.length > 0 ? (
                                payrolls.map((payroll) => (
                                    <tr key={payroll._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            {payroll.month} {payroll.year}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">${payroll.salary.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-green-600">+${payroll.bonus.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-red-600">-${payroll.deductions.toLocaleString()}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">${payroll.netSalary.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${payroll.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {payroll.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-xs font-semibold">
                                                <Download size={14} /> Slip
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No payroll records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
