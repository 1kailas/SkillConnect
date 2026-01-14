import { useState } from 'react';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ type = 'info', message, onClose, duration = 5000 }) => {
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

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`${colors[type]} border rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-md`}
    >
      <Icon className={`w-5 h-5 ${iconColors[type]} flex-shrink-0 mt-0.5`} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={onClose} className="flex-shrink-0 hover:opacity-70">
        <FiX className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default Toast;
