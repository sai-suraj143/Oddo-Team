import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { UserType } from '../../utils/constants';


interface LoginFormProps {
    onLogin: (user: UserType) => void;
    onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup }) => {
    const [formData, setFormData] = useState({ empId: '', password: '' });
    const [errors, setErrors] = useState<{ form?: string }>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                onLogin(data.user);
            } else {
                setErrors({ form: data.message || 'Invalid Employee ID or password.' });
                setLoading(false);
            }

        } catch (err) {
            setErrors({ form: "Network error. Please check your connection." });
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
            {errors.form && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                    <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-sm text-red-700">{errors.form}</p>
                    </div>
                </div>
            )}

            {/* Changed Input from Email to Employee ID */}
            <Input
                label="Employee ID"
                icon={User}
                type="text"
                placeholder="e.g. OIJODO20260001"
                value={formData.empId}
                onChange={(e) => setFormData({ ...formData, empId: e.target.value.toUpperCase() })}
                required
            />

            <div className="relative">
                <Input
                    label="Password"
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2" />
                    Remember me
                </label>
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>

            <Button variant="primary" type="submit" className="w-full py-3" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button type="button" onClick={onSwitchToSignup} className="font-medium text-indigo-600 hover:text-indigo-500">
                    Create account
                </button>
            </p>
        </form>
    );
};

export default LoginForm;