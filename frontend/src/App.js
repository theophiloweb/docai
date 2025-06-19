import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PageTranslator from './components/common/PageTranslator';

// Layouts
import LandingLayout from './layouts/LandingLayout';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import DocumentsPage from './pages/dashboard/DocumentsPage';
import DocumentDetailPage from './pages/dashboard/DocumentDetailPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';
import ConsentManagementPage from './pages/dashboard/ConsentManagementPage';
import MedicalHistoryPage from './pages/dashboard/MedicalHistoryPage';
import FinancialPage from './pages/dashboard/FinancialPage';
import BudgetPage from './pages/dashboard/BudgetPage';

// Admin Pages
import AdminLoginPage from './pages/admin/LoginPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminDocumentsPage from './pages/admin/DocumentsPage';
import AdminSettingsPage from './pages/admin/SettingsPage';
import AdminProfilePage from './pages/admin/ProfilePage';
import AdminLogsPage from './pages/admin/LogsPage';
import AdminPlansPage from './pages/admin/PlansPage';
import AdminAISettingsPage from './pages/admin/AISettingsPage';

// Componente de proteção para rotas de administrador
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Se ainda estiver carregando, mostrar nada
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>;
  }
  
  // Verificar se o usuário está autenticado e é um administrador
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <>
      <Routes>
      {/* Public Routes - Using LandingLayout for the homepage */}
      <Route path="/" element={<LandingLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      
      {/* Other Public Routes - Using MainLayout */}
      <Route path="/" element={<MainLayout requireAuth={false} />}>
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms-of-service" element={<TermsOfServicePage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
      
      {/* Legacy Auth Routes */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/cadastro" element={<Navigate to="/auth/register" replace />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<MainLayout requireAuth={true} />}>
        <Route index element={<DashboardPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="documents/:id" element={<DocumentDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="consents" element={<ConsentManagementPage />} />
        <Route path="medical" element={<MedicalHistoryPage />} />
        <Route path="financial" element={<FinancialPage />} />
        <Route path="budget" element={<BudgetPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="documents" element={<AdminDocumentsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="logs" element={<AdminLogsPage />} />
        <Route path="plans" element={<AdminPlansPage />} />
        <Route path="ai-settings" element={<AdminAISettingsPage />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    
    {/* Page Translator Widget */}
    <PageTranslator />
    </>
  );
}

export default App;
