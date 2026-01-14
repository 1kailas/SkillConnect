import { useState } from 'react';
import { FiDollarSign, FiLoader, FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import aiService from '../services/aiService';

const AISalaryEstimator = ({ profession, skills = [], experience = 0, location = 'Kerala' }) => {
  const [loading, setLoading] = useState(false);
  const [estimation, setEstimation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const estimateSalary = async () => {
    if (!profession) {
      toast.error('Profession is required');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.estimateSalary(profession, skills, experience, location);
      
      if (response.success && response.data) {
        setEstimation(response.data);
        setShowDetails(true);
        toast.success('Salary estimation complete!');
      }
    } catch (error) {
      console.error('Error estimating salary:', error);
      toast.error(error.response?.data?.message || 'Failed to estimate salary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={estimateSalary}
        disabled={loading}
        className="btn btn-primary w-full sm:w-auto"
      >
        {loading ? (
          <>
            <FiLoader className="w-5 h-5 animate-spin" />
            Estimating...
          </>
        ) : (
          <>
            <FiDollarSign className="w-5 h-5" />
            Get AI Salary Estimate
          </>
        )}
      </button>

      <AnimatePresence>
        {showDetails && estimation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-br from-emerald-50 to-primary-50 rounded-xl p-6 shadow-lg border border-emerald-200 mt-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <FiTrendingUp className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-800">Salary Estimation</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Hourly Rate */}
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Hourly Rate</p>
                <p className="text-2xl font-bold text-emerald-600">
                  ₹{estimation.hourlyRate?.min || 0} - ₹{estimation.hourlyRate?.max || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">per hour</p>
              </div>

              {/* Monthly Rate */}
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Monthly Rate</p>
                <p className="text-2xl font-bold text-primary-600">
                  ₹{estimation.monthlyRate?.min || 0} - ₹{estimation.monthlyRate?.max || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">per month</p>
              </div>
            </div>

            {/* Factors */}
            {estimation.factors && estimation.factors.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">Factors Considered:</p>
                <ul className="list-disc list-inside space-y-1">
                  {estimation.factors.map((factor, idx) => (
                    <li key={idx} className="text-sm text-slate-600">{factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Market Insights */}
            {estimation.marketInsights && (
              <div className="bg-primary-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-primary-900 mb-1">Market Insights:</p>
                <p className="text-sm text-primary-800">{estimation.marketInsights}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AISalaryEstimator;
