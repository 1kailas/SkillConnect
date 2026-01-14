import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiChevronDown, FiUser, FiLinkedin, FiTwitter, FiFacebook, FiInstagram } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'worker') return '/dashboard/worker';
    if (user?.role === 'employer') return '/dashboard/employer';
    if (user?.role === 'admin') return '/dashboard/admin';
    return '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen 
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className={`font-heading text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                SkillConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50 backdrop-blur-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'Find Workers', path: '/workers' },
                { name: 'Browse Jobs', path: '/jobs' },
                { name: 'Verify', path: '/verify-certificate' },
                { name: 'Pricing', path: '/pricing' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-white text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-white/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white border border-slate-200 rounded-full hover:border-primary-300 transition-all duration-200 hover:shadow-md"
                  >
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-sm text-slate-900 leading-none">{user?.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{user?.role}</div>
                    </div>
                    <FiChevronDown className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                        <p className="text-sm text-slate-500">Signed in as</p>
                        <p className="font-semibold text-slate-900 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </span>
                        Dashboard
                      </Link>
                      <Link
                        to={`${getDashboardLink()}/profile`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                         <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </span>
                        Profile
                      </Link>
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </span>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/auth/login" className="text-sm font-semibold text-slate-600 hover:text-primary-600 px-3 py-2 transition-colors">
                    Log in
                  </Link>
                  <Link to="/auth/signup" className="btn btn-primary rounded-full px-5 shadow-lg shadow-primary-500/20">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 pb-6 px-6 lg:hidden overflow-y-auto animate-in fade-in slide-in-from-top-10 duration-300">
          <div className="flex flex-col gap-2">
            {[
              { name: 'Home', path: '/' },
              { name: 'Find Workers', path: '/workers' },
              { name: 'Browse Jobs', path: '/jobs' },
              { name: 'Verify Certificate', path: '/verify-certificate' },
              { name: 'Pricing', path: '/pricing' },
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-lg font-medium text-slate-800 py-3 border-b border-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="mt-8 space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`}
                      alt={user?.name}
                      className="w-12 h-12 rounded-full ring-2 ring-primary-100"
                    />
                    <div>
                      <div className="font-bold text-lg text-slate-900">{user?.name}</div>
                      <div className="text-sm text-slate-500 capitalize">{user?.role}</div>
                    </div>
                  </div>
                  <Link 
                    to={getDashboardLink()} 
                    className="btn btn-secondary w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="btn border-rose-200 text-rose-600 w-full justify-center hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/auth/login" className="btn btn-secondary w-full justify-center">
                    Log in
                  </Link>
                  <Link to="/auth/signup" className="btn btn-primary w-full justify-center">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 mt-auto border-t border-slate-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-heading text-xl font-bold text-white">SkillConnect</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering Kerala's workforce by connecting skilled professionals with opportunities in Tier 2 & 3 cities.
              </p>
              <div className="flex gap-4">
                {[FiTwitter, FiFacebook, FiInstagram, FiLinkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all duration-300">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-3 text-sm">
                {['How it Works', 'Browse Professionals', 'Post a Job', 'Pricing Plans', 'Success Stories'].map(item => (
                  <li key={item}><a href="#" className="hover:text-primary-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Resources</h4>
              <ul className="space-y-3 text-sm">
                {['Blog', 'Help Center', 'Safety Guidelines', 'Community Guidelines', 'Terms of Service'].map(item => (
                  <li key={item}><a href="#" className="hover:text-primary-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-white font-bold mb-4">Subscribe to our newsletter</h4>
              <p className="text-xs text-slate-400 mb-4">Get the latest jobs and updates delivered to your inbox.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-slate-900 border-slate-700 text-white text-sm rounded-lg w-full px-3 py-2 focus:ring-1 focus:ring-primary-500"
                />
                <button className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 py-2 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; 2024 SkillConnect Kerala. Made with ❤️ in Kerala.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
