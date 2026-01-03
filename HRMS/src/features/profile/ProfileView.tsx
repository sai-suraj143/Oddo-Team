import React, { useState } from 'react';
import { User, Mail, MapPin, Phone, Briefcase, DollarSign, FileText, Camera } from 'lucide-react';

interface ProfileViewProps {
    userRole: 'Employee' | 'HR';
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userRole }) => {
    // Mock data - In a real app, fetch from MongoDB using the userId
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "john.doe@nexusportal.com",
        phone: "+1 234 567 890",
        address: "123 Tech Avenue, Silicon Valley",
        designation: "Senior Software Engineer",
        department: "Engineering",
        salary: "$85,000 / year",
        joinedDate: "Jan 15, 2023"
    });

    const isHR = userRole === 'HR';

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header / Profile Picture */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-3xl font-bold border-4 border-white shadow-md">
                        {profile.name.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-border border border-gray-200 text-gray-500 hover:text-indigo-600">
                        <Camera size={16} />
                    </button>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-500">{profile.designation} • {profile.department}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details - Limited Edit for Employees */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><User size={18} /> Personal Details</h3>
                        <button className="text-xs text-indigo-600 font-semibold hover:underline">Edit</button>
                    </div>
                    <div className="space-y-4">
                        <DetailItem icon={<Mail size={16} />} label="Email" value={profile.email} />
                        <DetailItem icon={<Phone size={16} />} label="Phone" value={profile.phone} />
                        <DetailItem icon={<MapPin size={16} />} label="Address" value={profile.address} />
                    </div>
                </div>

                {/* Job Details - HR Only Edit */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Briefcase size={18} /> Job Details</h3>
                        {isHR && <button className="text-xs text-indigo-600 font-semibold hover:underline">Edit All</button>}
                    </div>
                    <div className="space-y-4">
                        <DetailItem label="Joined Date" value={profile.joinedDate} />
                        <DetailItem label="Department" value={profile.department} />
                        {isHR && <DetailItem icon={<DollarSign size={16} />} label="Salary Structure" value={profile.salary} color="text-green-600 font-bold" />}
                    </div>
                </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText size={18} /> Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Employment_Contract.pdf', 'ID_Proof.jpg'].map((doc) => (
                        <div key={doc} className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50 transition cursor-pointer">
                            <span className="text-sm text-gray-600">{doc}</span>
                            <span className="text-xs text-indigo-600">View</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ icon, label, value, color = "text-gray-900" }: any) => (
    <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{label}</p>
        <div className="flex items-center gap-2 mt-1">
            {icon && <span className="text-gray-400">{icon}</span>}
            <p className={`text-sm ${color}`}>{value}</p>
        </div>
    </div>
);