import { useState } from 'react';
import { FiZap, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import aiService from '../services/aiService';

const AISkillRecommender = ({ currentProfession, currentSkills = [], onSkillsRecommended }) => {
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (!currentProfession) {
      toast.error('Please select your profession first');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.getSkillRecommendations(currentProfession, currentSkills);
      
      if (response.success && response.data) {
        const skills = response.data.recommendedSkills || [];
        
        if (skills.length > 0) {
          // Extract skill names from the detailed recommendations
          const skillNames = skills.map(s => 
            typeof s === 'string' ? s : s.skill
          );
          onSkillsRecommended(skillNames);
          toast.success('Skill recommendations generated!');
        } else {
          toast.info('No additional skills recommended at this time');
        }
      }
    } catch (error) {
      console.error('Error getting skill recommendations:', error);
      toast.error(error.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={getRecommendations}
      disabled={loading}
      className="btn btn-primary w-full sm:w-auto"
    >
      {loading ? (
        <>
          <FiLoader className="w-5 h-5 animate-spin" />
          Getting suggestions...
        </>
      ) : (
        <>
          <FiZap className="w-5 h-5" />
          Get AI Skill Suggestions
        </>
      )}
    </button>
  );
};

export default AISkillRecommender;
