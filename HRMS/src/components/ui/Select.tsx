import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    icon: LucideIcon;
    options: { value: string; label: string }[];
    error?: string;
}

const Select: React.FC<SelectProps> = ({ label, icon: Icon, options, error, ...props }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Icon size={18} />
            </div>
            <select
                className={`block w-full pl-10 pr-3 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white`}
                {...props}
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);
export default Select;