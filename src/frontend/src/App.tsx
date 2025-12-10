import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import ModernNavbar from './components/ModernNavbar';
import ModernLogin from './pages/ModernLogin';
import ModernRegister from './pages/ModernRegister';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for better performance
const ModernDashboard = lazy(() => import('./pages/ModernDashboard'));
const ModernAccounts = lazy(() => import('./pages/ModernAccounts'));
const ModernTransactions = lazy(() => import('./pages/ModernTransactions'));
const ModernTransfer = lazy(() => import('./pages/ModernTransfer'));
const Investments = lazy(() => import('./pages/Investments'));
const Loans = lazy(() => import('./pages/Loans'));
const Settings = lazy(() => import('./pages/Settings'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));
const AccountStatements = lazy(() => import('./pages/AccountStatements'));
const Onboarding = lazy(() => import('./pages/Onboarding'));

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated && !localStorage.getItem('onboarding_completed')) {
      setShowOnboarding(true);
    }
  }, [isAuthenticated]);

  if (showOnboarding) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Onboarding />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {isAuthenticated && <ModernNavbar />}
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <ModernLogin /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <ModernRegister /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <ModernDashboard /> : <Navigate to="/login" />} />
            <Route path="/accounts" element={isAuthenticated ? <ModernAccounts /> : <Navigate to="/login" />} />
            <Route path="/transactions" element={isAuthenticated ? <ModernTransactions /> : <Navigate to="/login" />} />
            <Route path="/transfer" element={isAuthenticated ? <ModernTransfer /> : <Navigate to="/login" />} />
            <Route path="/investments" element={isAuthenticated ? <Investments /> : <Navigate to="/login" />} />
            <Route path="/loans" element={isAuthenticated ? <Loans /> : <Navigate to="/login" />} />
            <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
            <Route path="/help" element={isAuthenticated ? <HelpSupport /> : <Navigate to="/login" />} />
            <Route path="/statements" element={isAuthenticated ? <AccountStatements /> : <Navigate to="/login" />} />
            <Route path="/onboarding" element={isAuthenticated ? <Onboarding /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;

