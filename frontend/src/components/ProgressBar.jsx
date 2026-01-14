import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

const ProgressBar = ({ current, total, label, showPercentage = true }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-700 font-medium">{label}</span>
          {showPercentage && (
            <span className="text-slate-600">{percentage}%</span>
          )}
        </div>
      )}
      <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            percentage >= 100
              ? 'bg-emerald-500'
              : percentage >= 75
              ? 'bg-primary-500'
              : percentage >= 50
              ? 'bg-amber-500'
              : 'bg-rose-500'
          }`}
        >
          {percentage >= 100 && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <FiCheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </motion.div>
      </div>
      {current !== undefined && total !== undefined && (
        <div className="text-xs text-slate-500">
          {current} of {total} completed
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
