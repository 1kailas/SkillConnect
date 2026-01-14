import { Outlet, Navigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AuthLayout = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const dashboardRoute = user?.role === 'worker'
      ? '/dashboard/worker'
      : user?.role === 'employer'
      ? '/dashboard/employer'
      : user?.role === 'admin'
      ? '/dashboard/admin'
      : '/';
    return <Navigate to={dashboardRoute} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-primary-200/20 rounded-full blur-[80px] animate-float"></div>
      </div>

      {/* Logo Area */}
      <div className="relative z-10 mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-heading text-2xl font-bold text-slate-900 tracking-tight">
            SkillConnect
          </span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>
        <Outlet />
      </div>

      {/* Footer Links */}
      <div className="mt-8 text-center space-x-6 relative z-10 text-sm text-slate-500 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <a href="#" className="hover:text-primary-600 transition-colors">Help</a>
        <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
        <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
      </div>
    </div>
  );
};

export default AuthLayout;
