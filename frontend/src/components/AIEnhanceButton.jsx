import { useState } from 'react';
import { FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';
import aiService from '../services/aiService';

const AIEnhanceButton = ({ text, onEnhanced, type = 'jobDescription' }) => {
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
    if (!text || text.length < 10) {
      toast.error('Please provide more text to enhance');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.enhanceText(text, type);
      
      if (response.success && response.data) {
        onEnhanced(response.data.enhanced);
        toast.success('Text enhanced successfully!');
      }
    } catch (error) {
      console.error('Error enhancing text:', error);
      toast.error(error.response?.data?.message || 'Failed to enhance text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleEnhance}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20"
      title="Enhance with AI"
    >
      <FiZap className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
      {loading ? 'Enhancing...' : 'AI Enhance'}
    </button>
  );
};

export default AIEnhanceButton;
