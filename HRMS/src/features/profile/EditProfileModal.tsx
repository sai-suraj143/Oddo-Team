import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: any;
    userRole: 'Employee' | 'HR';
    onUpdate: () => void;
    userId: string;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profile, userRole, onUpdate, userId }) => {
    const [formData, setFormData] = useState({
        phone: profile.personalDetails?.phone || '',
        address: profile.personalDetails?.address || '',
        profilePicture: profile.profilePicture || '',
        // HR Fields
        designation: profile.jobDetails?.designation || '',
        department: profile.jobDetails?.department || '',
        salary: profile.salaryStructure?.baseSalary || ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const updates: any = {};

        // Employee Fields
        if (formData.phone !== profile.personalDetails?.phone) updates['personalDetails.phone'] = formData.phone;
        if (formData.address !== profile.personalDetails?.address) updates['personalDetails.address'] = formData.address;
        if (formData.profilePicture !== profile.profilePicture) updates['profilePicture'] = formData.profilePicture;

        // HR Fields
        if (userRole === 'HR') {
            if (formData.designation !== profile.jobDetails?.designation) updates['jobDetails.designation'] = formData.designation;
            if (formData.department !== profile.jobDetails?.department) updates['jobDetails.department'] = formData.department;
            if (formData.salary !== profile.salaryStructure?.baseSalary) updates['salaryStructure.baseSalary'] = formData.salary;
        }

        if (Object.keys(updates).length === 0) {
            onClose();
            return;
        }

        try {
            const response = await fetch(`/api/profile/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: userRole,
                    updates
                })
            });

            if (response.ok) {
                onUpdate();
                onClose();
            } else {
                setError('Failed to update profile');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-scaleIn">
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg">Edit Profile</h3>
                    <button onClick={onClose} className="hover:bg-indigo-500 p-1 rounded-full"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {/* Common Fields */}
                    <div className="space-y-4">
                        <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                        <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                        <Input label="Profile Picture URL" name="profilePicture" value={formData.profilePicture} onChange={handleChange} />
                    </div>

                    {/* HR Only Fields */}
                    {userRole === 'HR' && (
                        <div className="pt-4 border-t border-gray-100 space-y-4">
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">HR Controls</p>
                            <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
                            <Input label="Department" name="department" value={formData.department} onChange={handleChange} />
                            <Input label="Base Salary" name="salary" value={formData.salary} onChange={handleChange} />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                        >
                            {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            {...props}
        />
    </div>
);
