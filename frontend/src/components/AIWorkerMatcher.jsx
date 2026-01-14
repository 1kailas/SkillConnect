import { useState } from 'react';
import { FiUsers, FiLoader, FiStar, FiMapPin } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import aiService from '../services/aiService';

const AIWorkerMatcher = ({ jobId, onWorkersFound }) => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const findWorkers = async () => {
    if (!jobId) {
      toast.error('Job ID is required');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.getWorkerRecommendations(jobId, 10);
      
      if (response.success && response.data) {
        setMatches(response.data);
        setShowDetails(true);
        
        if (onWorkersFound) {
          onWorkersFound(response.data.matches);
        }
        
        toast.success(`Found ${response.data.matches?.length || 0} recommended workers!`);
      }
    } catch (error) {
      console.error('Error finding workers:', error);
      toast.error(error.response?.data?.message || 'Failed to find workers');
    } finally {
      setLoading(false);
    }
  };

  const getMatchScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 80) return 'text-emerald-600 bg-emerald-100';
    if (numScore >= 60) return 'text-primary-600 bg-primary-100';
    if (numScore >= 40) return 'text-amber-600 bg-amber-100';
    return 'text-rose-600 bg-rose-100';
  };

  const getRecommendationBadge = (recommendation) => {
    const badges = {
      hire: { color: 'bg-emerald-100 text-emerald-800', text: 'Recommended' },
      interview: { color: 'bg-primary-100 text-primary-800', text: 'Interview' },
      pass: { color: 'bg-slate-100 text-slate-800', text: 'Consider' }
    };
    return badges[recommendation] || badges.pass;
  };

  return (
    <div className="space-y-4">
      <button
        onClick={findWorkers}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? (
          <>
            <FiLoader className="w-5 h-5 animate-spin" />
            Finding best workers...
          </>
        ) : (
          <>
            <FiUsers className="w-5 h-5" />
            Get AI Worker Recommendations
          </>
        )}
      </button>

      <AnimatePresence>
        {showDetails && matches && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 mt-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Top Worker Matches
              </h3>
              <span className="text-sm text-slate-600">
                {matches.totalAnalyzed} workers analyzed
              </span>
            </div>

            {/* Hiring Advice */}
            {matches.hiringAdvice && (
              <div className="mb-6 bg-primary-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-primary-900 mb-1">AI Hiring Advice:</p>
                <p className="text-sm text-primary-800">{matches.hiringAdvice}</p>
              </div>
            )}

            {/* Worker Matches */}
            {matches.matches && matches.matches.length > 0 ? (
              <div className="space-y-4">
                {matches.matches.map((match, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {match.worker && (
                          <>
                            <h4 className="font-semibold text-slate-800">
                              {match.worker.profession}
                            </h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                              {match.worker.experience !== undefined && (
                                <span>{match.worker.experience} years exp.</span>
                              )}
                              {match.worker.rating?.average && (
                                <span className="flex items-center gap-1">
                                  <FiStar className="w-4 h-4 text-amber-500" />
                                  {match.worker.rating.average.toFixed(1)}
                                </span>
                              )}
                              {match.worker.location?.city && (
                                <span className="flex items-center gap-1">
                                  <FiMapPin className="w-4 h-4" />
                                  {match.worker.location.city}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full font-semibold text-sm ${getMatchScoreColor(match.matchScore)}`}>
                          {match.matchScore}% Match
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getRecommendationBadge(match.recommendation).color}`}>
                          {getRecommendationBadge(match.recommendation).text}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    {match.worker?.skills && match.worker.skills.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {match.worker.skills.map((skill, sidx) => (
                            <span
                              key={sidx}
                              className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths */}
                    {match.strengths && match.strengths.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-emerald-700 mb-1">Strengths:</p>
                        <ul className="list-disc list-inside text-sm text-slate-700">
                          {match.strengths.map((strength, sidx) => (
                            <li key={sidx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Concerns */}
                    {match.concerns && match.concerns.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-orange-700 mb-1">Considerations:</p>
                        <ul className="list-disc list-inside text-sm text-slate-700">
                          {match.concerns.map((concern, cidx) => (
                            <li key={cidx}>{concern}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <FiUsers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No worker matches found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIWorkerMatcher;
