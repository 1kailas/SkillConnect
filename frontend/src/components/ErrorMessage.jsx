import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3"
    >
      <FiAlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-rose-900 font-semibold">Error</h4>
        <p className="text-rose-600 text-sm mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 text-sm text-rose-700 hover:text-rose-800 font-semibold transition-colors"
          >
            Try Again →
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorMessage;
