import React from 'react';
import { LayoutDashboard } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => (
    <div className="min-h-screen bg-gray-50 flex">
        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-between p-12 text-white">
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><LayoutDashboard size={28} /></div>
                    <span className="text-2xl font-bold tracking-tight">Odoo</span>
                </div>
                <h1 className="text-5xl font-bold mb-6 leading-tight">Manage your workforce with <br /><span className="text-indigo-200">confidence.</span></h1>
            </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                    <p className="mt-2 text-gray-600">{subtitle}</p>
                </div>
                {children}
            </div>
        </div>
    </div>
);
export default AuthLayout;