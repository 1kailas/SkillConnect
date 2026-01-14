import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  FiHome, FiUser, FiBriefcase, FiFileText, FiAward, FiImage,
  FiStar, FiMessageSquare, FiBell, FiSettings, FiLogOut, FiMenu, FiX,
  FiUsers, FiShield, FiBarChart, FiSearch
} from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import AIHelperBot from '../components/AIHelperBot';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    // Auto-close sidebar on mobile when navigating
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
      setMobileMenuOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = {
    worker: [
      { path: '/dashboard/worker', icon: FiHome, label: 'Overview' },
      { path: '/dashboard/worker/jobs', icon: FiBriefcase, label: 'Find Work' },
      { path: '/dashboard/worker/applications', icon: FiFileText, label: 'Applications' },
      { path: '/dashboard/worker/profile', icon: FiUser, label: 'My Skills' },
      { path: '/dashboard/worker/certificates', icon: FiAward, label: 'Certifications' },
      { path: '/dashboard/worker/messages', icon: FiMessageSquare, label: 'Messages' },
      { path: '/dashboard/worker/settings', icon: FiSettings, label: 'Settings' },
    ],
    employer: [
      { path: '/dashboard/employer', icon: FiHome, label: 'Overview' },
      { path: '/dashboard/employer/jobs', icon: FiBriefcase, label: 'My Postings' },
      { path: '/dashboard/employer/workers', icon: FiUsers, label: 'Talent Scout' },
      { path: '/dashboard/employer/applications', icon: FiFileText, label: 'Applications' },
      { path: '/dashboard/employer/messages', icon: FiMessageSquare, label: 'Inbox' },
      { path: '/dashboard/employer/settings', icon: FiSettings, label: 'Settings' },
    ],
    admin: [
      { path: '/dashboard/admin', icon: FiBarChart, label: 'Analytics' },
      { path: '/dashboard/admin/users', icon: FiUsers, label: 'User Types' },
      { path: '/dashboard/admin/certificates', icon: FiShield, label: 'Verifications' },
    ]
  };

  const currentMenu = menuItems[user?.role] || [];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-72' : 'w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand */}
        <div className={`h-20 flex items-center ${sidebarOpen ? 'px-6 justify-between' : 'justify-center'} border-b border-slate-100`}>
          {sidebarOpen ? (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30">
                SC
              </div>
              <span className="font-heading font-bold text-xl text-slate-800 tracking-tight">SkillConnect</span>
            </Link>
          ) : (
             <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">SC</div>
          )}
          <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            {sidebarOpen ? <FiX size={14} /> : <FiMenu size={14} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {currentMenu.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== `/dashboard/${user?.role}`);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isActive && <div className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"></div>}
                <item.icon size={22} className={`${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`} />
                <span className={`font-medium whitespace-nowrap transition-all duration-200 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 hidden'}`}>
                  {item.label}
                </span>
                
                {/* Tooltip for collapsed state */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
        
        {/* User Mini Profile (Bottom) */}
        <div className="border-t border-slate-100 p-4">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
             <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
              )}
          </div>
          
          <div className={`mt-4 grid ${sidebarOpen ? 'grid-cols-2 gap-2' : 'grid-cols-1 gap-2'}`}>
            <button 
              onClick={() => navigate('/')} 
              className={`flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors ${!sidebarOpen && 'hidden'}`}
              title="Home"
            >
              <FiHome size={18} />
            </button>
            <button 
              onClick={handleLogout} 
              className={`flex items-center justify-center p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors`}
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200/60 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <FiMenu size={24} />
            </button>
            
            <div className="hidden md:flex items-center gap-4 text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
               <FiSearch size={18} />
               <input 
                 type="text" 
                 placeholder="Search anything..." 
                 className="bg-transparent border-none focus:outline-none text-sm text-slate-700 w-48"
               />
               <span className="text-xs border border-slate-300 rounded px-1.5 py-0.5">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <FiBell size={20} />
              <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                 <p className="text-xs text-slate-500">Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>

      <AIHelperBot />
    </div>
  );
};

export default DashboardLayout;
