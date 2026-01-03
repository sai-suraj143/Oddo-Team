import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Briefcase, DollarSign, FileText, Camera } from 'lucide-react';
import { EditProfileModal } from './EditProfileModal';

interface ProfileViewProps {
    userId: string; // This should be the MongoDB _id from the User model (which links to Profile)
    userRole: 'Employee' | 'HR';
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userId, userRole }) => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`/api/profile/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    if (loading) return <div className="text-center p-10">Loading profile...</div>;
    if (!profile) return <div className="text-center p-10">Profile not found.</div>;

    const isHR = userRole === 'HR';

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header / Profile Picture */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-3xl font-bold border-4 border-white shadow-md overflow-hidden">
                        {profile.profilePicture ? (
                            <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            profile.personalDetails?.firstName?.charAt(0) || 'U'
                        )}
                    </div>
                    {/* Only allow editing picture if employee or HR */}
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-border border border-gray-200 text-gray-500 hover:text-indigo-600"
                    >
                        <Camera size={16} />
                    </button>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {profile.personalDetails?.firstName} {profile.personalDetails?.lastName}
                    </h2>
                    <p className="text-gray-500">{profile.jobDetails?.designation} • {profile.jobDetails?.department}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><User size={18} /> Personal Details</h3>
                        <button onClick={() => setIsEditModalOpen(true)} className="text-xs text-indigo-600 font-semibold hover:underline">Edit</button>
                    </div>
                    <div className="space-y-4">
                        {/* Note: Email comes from User model, but we stored it in Profile too or fetch separately? 
                            The current Profile model doesn't store email, it's on User. 
                            For now, let's assume we populated it or we just show phone/address from profile 
                        */}
                        <DetailItem icon={<Phone size={16} />} label="Phone" value={profile.personalDetails?.phone || 'N/A'} />
                        <DetailItem icon={<MapPin size={16} />} label="Address" value={profile.personalDetails?.address || 'N/A'} />
                    </div>
                </div>

                {/* Job Details */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Briefcase size={18} /> Job Details</h3>
                        {isHR && <button onClick={() => setIsEditModalOpen(true)} className="text-xs text-indigo-600 font-semibold hover:underline">Edit All</button>}
                    </div>
                    <div className="space-y-4">
                        <DetailItem label="Joined Date" value={new Date(profile.jobDetails?.joiningDate).toLocaleDateString()} />
                        <DetailItem label="Department" value={profile.jobDetails?.department} />
                        {isHR && (
                            <DetailItem
                                icon={<DollarSign size={16} />}
                                label="Salary Structure"
                                value={profile.salaryStructure?.baseSalary}
                                color="text-green-600 font-bold"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText size={18} /> Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.documents && profile.documents.length > 0 ? (
                        profile.documents.map((doc: string, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50 transition cursor-pointer">
                                <span className="text-sm text-gray-600 truncate max-w-[150px]">{doc}</span>
                                <span className="text-xs text-indigo-600">View</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">No documents uploaded.</p>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    profile={profile}
                    userRole={userRole}
                    onUpdate={fetchProfile}
                    userId={userId}
                />
            )}
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