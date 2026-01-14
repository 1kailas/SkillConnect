import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiSearch, FiBriefcase, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  const suggestions = [
    { icon: FiHome, label: 'Back to Home', link: '/', primary: true },
    { icon: FiBriefcase, label: 'Browse Jobs', link: '/jobs' },
    { icon: FiSearch, label: 'Find Workers', link: '/workers' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 Illustration */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.span 
              className="text-[180px] md:text-[220px] font-bold text-primary-100 leading-none select-none"
              animate={{ 
                textShadow: ['0 0 0px rgba(59, 130, 246, 0)', '0 0 30px rgba(59, 130, 246, 0.3)', '0 0 0px rgba(59, 130, 246, 0)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              404
            </motion.span>
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className="bg-white rounded-full p-6 shadow-lg border border-slate-100">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <FiSearch className="w-12 h-12 text-primary-600" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off. 
            Don't worry, let's get you back on track.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            {suggestions.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    to={item.link}
                    className={`btn ${item.primary ? 'btn-primary' : 'btn-outline'} w-full sm:w-auto`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Go back to previous page
            </button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-sm text-slate-400"
        >
          If you believe this is an error, please{' '}
          <Link to="/contact" className="text-primary-600 hover:underline">
            contact support
          </Link>
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;
