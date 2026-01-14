import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionLabel 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      {Icon && (
        <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <Icon className="w-12 h-12 text-slate-400" />
        </div>
      )}
      <h3 className="text-2xl font-heading font-bold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      {action && actionLabel && (
        <button onClick={action} className="btn btn-primary shadow-lg">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
