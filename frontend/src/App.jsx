import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import AIHelperBot from './components/AIHelperBot';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import WorkerSearch from './pages/WorkerSearch';
import WorkerProfile from './pages/WorkerProfile';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import CertificateVerification from './pages/CertificateVerification';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Worker Dashboard
import WorkerDashboard from './pages/dashboard/worker/Dashboard';
import WorkerProfilePage from './pages/dashboard/worker/Profile';
import WorkerJobs from './pages/dashboard/worker/Jobs';
import WorkerApplications from './pages/dashboard/worker/Applications';
import WorkerCertificates from './pages/dashboard/worker/Certificates';
import WorkerPortfolio from './pages/dashboard/worker/Portfolio';
import WorkerReviews from './pages/dashboard/worker/Reviews';
import WorkerSettings from './pages/dashboard/worker/Settings';

// Employer Dashboard
import EmployerDashboard from './pages/dashboard/employer/Dashboard';
import EmployerProfilePage from './pages/dashboard/employer/Profile';
import EmployerJobs from './pages/dashboard/employer/Jobs';
import CreateJob from './pages/dashboard/employer/CreateJob';
import EditJob from './pages/dashboard/employer/EditJob';
import JobApplicationsPage from './pages/dashboard/employer/Applications';
import EmployerWorkers from './pages/dashboard/employer/Workers';
import EmployerReviews from './pages/dashboard/employer/Reviews';
import EmployerSettings from './pages/dashboard/employer/Settings';

// Admin Dashboard
import AdminDashboard from './pages/dashboard/admin/Dashboard';
import AdminUsers from './pages/dashboard/admin/Users';
import AdminCertificates from './pages/dashboard/admin/Certificates';
import AdminJobs from './pages/dashboard/admin/Jobs';
import AdminReviews from './pages/dashboard/admin/Reviews';
import AdminSettings from './pages/dashboard/admin/Settings';

// Shared Dashboard Pages
import Messages from './pages/dashboard/Messages';
import Notifications from './pages/dashboard/Notifications';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// 404 Page
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="features" element={<Features />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="workers" element={<WorkerSearch />} />
          <Route path="workers/:id" element={<WorkerProfile />} />
          <Route path="worker/:id" element={<WorkerProfile />} />
          <Route path="jobs" element={<JobListings />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="job/:id" element={<JobDetails />} />
          <Route path="verify-certificate" element={<CertificateVerification />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Worker Dashboard */}
        <Route
          path="/dashboard/worker"
          element={
            <ProtectedRoute allowedRoles={['worker']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<WorkerDashboard />} />
          <Route path="profile" element={<WorkerProfilePage />} />
          <Route path="jobs" element={<WorkerJobs />} />
          <Route path="applications" element={<WorkerApplications />} />
          <Route path="certificates" element={<WorkerCertificates />} />
          <Route path="portfolio" element={<WorkerPortfolio />} />
          <Route path="reviews" element={<WorkerReviews />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<WorkerSettings />} />
        </Route>

        {/* Employer Dashboard */}
        <Route
          path="/dashboard/employer"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployerDashboard />} />
          <Route path="profile" element={<EmployerProfilePage />} />
          <Route path="jobs" element={<EmployerJobs />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="applications" element={<JobApplicationsPage />} />
          <Route path="jobs/create" element={<CreateJob />} />
          <Route path="jobs/:id/edit" element={<EditJob />} />
          <Route path="jobs/:id/applications" element={<JobApplicationsPage />} />
          <Route path="workers" element={<EmployerWorkers />} />
          <Route path="reviews" element={<EmployerReviews />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<EmployerSettings />} />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* AI Helper Bot - Available on all pages */}
      <AIHelperBot />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
