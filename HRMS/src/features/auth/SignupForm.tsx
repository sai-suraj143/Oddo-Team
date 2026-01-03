import React, { useState } from 'react';
import { User, Mail, Lock, Briefcase, CheckCircle, Copy, ArrowRight } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { PASSWORD_REGEX } from '../../utils/constants';

interface SignupFormProps {
    onSignupSuccess: () => void;
    onSwitchToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
    const [step, setStep] = useState(1);
    const [generatedId, setGeneratedId] = useState('');

    // Note: 'empId' is NOT here because user does not enter it
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'Employee'
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = "Full Name is required";
        if (!formData.email.includes('@')) newErrors.email = "Invalid email address";
        if (!PASSWORD_REGEX.test(formData.password)) {
            newErrors.password = "Password must be 8+ chars, with Upper, Lower, Number & Symbol.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ ...errors, form: data.message || "Registration failed" });
                setLoading(false);
                return;
            }

            // 1. Get ID from Backend Response
            setGeneratedId(data.empId);

            // 2. Move to Success Screen
            setLoading(false);
            setStep(2);

        } catch (err) {
            setErrors({ ...errors, form: "Network error. Please try again." });
            setLoading(false);
        }
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(generatedId);
        alert('Employee ID copied to clipboard!');
    };

    // --- STEP 2: SUCCESS VIEW (Shows ID) ---
    if (step === 2) {
        return (
            <div className="text-center py-8 animate-fadeIn">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                <p className="text-gray-600 mb-6">
                    Your account has been created. Here is your unique Employee ID.
                </p>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 relative group">
                    <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-2">Your Employee ID</p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl font-mono font-bold text-indigo-900 tracking-widest">
                            {generatedId}
                        </span>
                        <button
                            onClick={handleCopyId}
                            className="text-indigo-400 hover:text-indigo-700 p-2"
                            title="Copy to clipboard"
                        >
                            <Copy size={20} />
                        </button>
                    </div>
                    <p className="text-xs text-red-500 mt-3 font-medium">
                        * SAVE THIS ID. You will need it to log in.
                    </p>
                </div>

                <Button
                    variant="primary"
                    className="w-full py-3 flex items-center justify-center gap-2"
                    onClick={onSwitchToLogin}
                >
                    Next: Go to Login <ArrowRight size={18} />
                </Button>
            </div>
        );
    }

    // --- STEP 1: FORM VIEW (No ID Input) ---
    return (
        <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
            <Input
                label="Full Name"
                icon={User}
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Role"
                    icon={Briefcase}
                    options={[
                        { value: 'Employee', label: 'Employee' },
                        { value: 'HR', label: 'HR Admin' }
                    ]}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <Input
                    label="Work Email"
                    icon={Mail}
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                />
            </div>

            <div className="relative">
                <Input
                    label="Password"
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                />
                <p className="text-xs text-gray-500 mt-1">Must contain 8+ chars, 1 uppercase, 1 symbol.</p>
            </div>

            <Button variant="primary" type="submit" className="w-full py-3" disabled={loading}>
                {loading ? 'Generating ID...' : 'Register Account'}
            </Button>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button type="button" onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign In
                </button>
            </p>
        </form>
    );
};

export default SignupForm;