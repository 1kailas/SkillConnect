import { useState, useEffect } from 'react';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ type = 'info', message, onClose, duration = 5000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            onClose?.();
            return 0;
          }
          return prev - (100 / (duration / 100));
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration, onClose]);

  const icons = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    warning: FiAlertTriangle,
    info: FiInfo,
  };

  const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
  };

  const iconColors = {
    success: 'text-emerald-600',
    error: 'text-rose-600',
    warning: 'text-amber-600',
    info: 'text-primary-600',
  };

  const progressColors = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-primary-500',
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`${colors[type]} border rounded-xl shadow-lg overflow-hidden max-w-md relative`}
    >
      <div className="p-4 flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColors[type]} flex-shrink-0 mt-0.5`} />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition-opacity">
          <FiX className="w-5 h-5" />
        </button>
      </div>
      {duration > 0 && (
        <div className="h-1 bg-black/5">
          <motion.div 
            className={`h-full ${progressColors[type]}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Toast;
