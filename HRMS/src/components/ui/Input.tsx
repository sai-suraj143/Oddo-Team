import React from 'react';
import { AlertCircle, Info, type LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    error?: string;
    helperText?: string;
}

const Input: React.FC<InputProps> = ({ label, icon: Icon, error, helperText, className, ...props }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Icon size={18} />
            </div>
            <input
                className={`block w-full pl-10 pr-3 py-2.5 border ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-lg shadow-sm text-sm placeholder-gray-400 transition-colors ${className}`}
                {...props}
            />
        </div>
        {helperText && !error && <p className="mt-1 text-xs text-gray-500 flex items-center gap-1"><Info size={12} /> {helperText}</p>}
        {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
    </div>
);
export default Input;