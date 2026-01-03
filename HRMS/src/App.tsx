import React, { useState } from 'react';
import AuthLayout from './components/layout/AuthLayout';
import LoginForm from './features/auth/LoginForm';
import SignupForm from './features/auth/SignupForm';
import AdminDashboard from './features/dashboard/AdminDashboard';
import EmployeeDashboard from './features/dashboard/EmployeeDashboard';
import type { UserType } from './utils/constants';

const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
  };

  if (view === 'dashboard' && currentUser) {
    return currentUser.role === 'HR'
      ? <AdminDashboard user={currentUser} onLogout={handleLogout} />
      : <EmployeeDashboard user={currentUser} onLogout={handleLogout} />;
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