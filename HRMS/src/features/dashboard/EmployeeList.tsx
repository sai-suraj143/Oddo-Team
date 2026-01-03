import React from 'react';
import { MoreVertical } from 'lucide-react';

const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch('/api/admin/all-employees');
                if (res.ok) {
                    const data = await res.json();
                    setEmployees(data);
                }
            } catch (err) {
                console.error("Error fetching employees", err);
            }
        };
        fetchEmployees();
    }, []);

    return (
        <div>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-700">All Employees</h3>
                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border">Total: {employees.length}</span>
            </div>
            <ul>
                {employees.map((emp) => (
                    <li key={emp._id} className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                {emp.personalDetails?.firstName?.charAt(0) || emp.userId?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{emp.personalDetails?.firstName} {emp.personalDetails?.lastName} </p>
                                <p className="text-xs text-gray-500">{emp.jobDetails?.designation || 'Staff'} • {emp.userId?.email || 'No Email'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700`}>
                                Active
                            </span>
                            <button className="text-gray-400 hover:text-indigo-600"><MoreVertical size={18} /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;
