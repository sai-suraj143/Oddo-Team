import React, { useState } from 'react';
import AuthLayout from './components/layout/AuthLayout';
import LoginForm from './features/auth/LoginForm';
import SignupForm from './features/auth/SignupForm';
import AdminDashboard from './features/dashboard/AdminDashboard';
import EmployeeDashboard from './features/dashboard/EmployeeDashboard';
import type { UserType } from './utils/constants';

// Define the available sub-views for your features
export type SubViewType = 'home' | 'profile' | 'attendance';

const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [subView, setSubView] = useState<SubViewType>('home');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    setView('dashboard');
    setSubView('home'); // Reset to dashboard home on login
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setSubView('home');
  };

  if (view === 'dashboard' && currentUser) {
    // Note: You can apply the same subView logic to AdminDashboard if needed
    return currentUser.role === 'HR'
      ? <AdminDashboard user={currentUser} onLogout={handleLogout} />
      : <EmployeeDashboard
        user={currentUser}
        onLogout={handleLogout}
        subView={subView}
        setSubView={setSubView}
      />;
  }

  return (
    <AuthLayout
      title={view === 'login' ? "Sign in to your account" : "Create your account"}
      subtitle={view === 'login' ? "Welcome back! Please enter your details." : "Start managing your work journey today."}
    >
      {view === 'login' ? (
        <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setView('signup')} />
      ) : (
        <SignupForm onSwitchToLogin={() => setView('login')} />
      )}
    </AuthLayout>
  );
};

export default App;