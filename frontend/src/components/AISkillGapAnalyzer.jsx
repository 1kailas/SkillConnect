import { useState } from 'react';
import { FiTarget, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import aiService from '../services/aiService';

const AISkillGapAnalyzer = ({ currentSkills = [], targetProfession }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const analyzeGap = async () => {
    if (!targetProfession) {
      toast.error('Please specify your target profession');
      return;
    }

    if (!currentSkills || currentSkills.length === 0) {
      toast.error('Please add your current skills first');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.analyzeSkillGap(currentSkills, targetProfession);
      
      if (response.success && response.data) {
        setAnalysis(response.data);
        setShowDetails(true);
        toast.success('Skill gap analysis complete!');
      }
    } catch (error) {
      console.error('Error analyzing skill gap:', error);
      toast.error(error.response?.data?.message || 'Failed to analyze skill gap');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-rose-100 text-rose-800 border-rose-300',
      medium: 'bg-amber-100 text-amber-800 border-amber-300',
      low: 'bg-primary-100 text-primary-800 border-primary-300'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="space-y-4">
      <button
        onClick={analyzeGap}
        disabled={loading}
        className="btn btn-primary w-full sm:w-auto"
      >
        {loading ? (
          <>
            <FiLoader className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <FiTarget className="w-5 h-5" />
            Analyze Skill Gap
          </>
        )}
      </button>

      <AnimatePresence>
        {showDetails && analysis && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 mt-4"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Skill Gap Analysis for {targetProfession}
            </h3>

            {/* Strength Skills */}
            {analysis.strengthSkills && analysis.strengthSkills.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-semibold text-slate-800">Your Strengths</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.strengthSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {analysis.missingSkills && analysis.missingSkills.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiAlertCircle className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-slate-800">Skills to Develop</h4>
                </div>
                <div className="space-y-3">
                  {analysis.missingSkills.map((skillObj, idx) => {
                    const skill = typeof skillObj === 'string' ? { skill: skillObj, priority: 'medium' } : skillObj;
                    return (
                      <div
                        key={idx}
                        className={`border rounded-lg p-3 ${getPriorityColor(skill.priority)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-semibold">{skill.skill}</h5>
                          <span className="text-xs uppercase px-2 py-1 bg-white/50 rounded">
                            {skill.priority || 'medium'} priority
                          </span>
                        </div>
                        {skill.learningTime && (
                          <p className="text-sm mb-1">
                            <strong>Learning Time:</strong> {skill.learningTime}
                          </p>
                        )}
                        {skill.resources && skill.resources.length > 0 && (
                          <div className="text-sm">
                            <strong>Resources:</strong>
                            <ul className="list-disc list-inside ml-2 mt-1">
                              {skill.resources.map((resource, ridx) => (
                                <li key={ridx}>{resource}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Development Plan */}
            {analysis.developmentPlan && (
              <div className="mb-4">
                <h4 className="font-semibold text-slate-800 mb-2">Development Plan</h4>
                <div className="bg-primary-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700 whitespace-pre-line">
                    {analysis.developmentPlan}
                  </p>
                </div>
              </div>
            )}

            {/* Market Outlook */}
            {analysis.marketOutlook && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">Market Outlook</h4>
                <p className="text-sm text-slate-700">{analysis.marketOutlook}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AISkillGapAnalyzer;
