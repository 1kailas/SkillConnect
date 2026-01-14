import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, trend, color = 'primary' }) => {
  const colors = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-700',
      icon: 'text-primary-600',
      border: 'border-primary-100',
    },
    secondary: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      icon: 'text-rose-600',
      border: 'border-rose-100',
    },
    success: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      icon: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      icon: 'text-amber-600',
      border: 'border-amber-100',
    },
    danger: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      icon: 'text-rose-600',
      border: 'border-rose-100',
    },
  };

  const colorScheme = colors[color] || colors.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`card cursor-pointer border ${colorScheme.border} hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-14 h-14 rounded-xl ${colorScheme.bg} flex items-center justify-center shadow-sm`}>
          <Icon className={`w-7 h-7 ${colorScheme.icon}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trend.type === 'up' ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            <span>{trend.type === 'up' ? '↑' : '↓'}</span>
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className={`text-3xl font-bold ${colorScheme.text}`}>{value}</div>
        <div className="text-sm text-slate-600 mt-1">{label}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;
