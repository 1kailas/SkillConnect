/**
 * AI Integration Examples
 * Copy these examples into your actual pages
 */

import { useState } from 'react';
import useAuthStore from '../store/authStore';
import aiService from '../services/aiService';

// Import all AI components
import AIJobMatcher from '../components/AIJobMatcher';
import AIWorkerMatcher from '../components/AIWorkerMatcher';
import AISkillRecommender from '../components/AISkillRecommender';
import AISkillGapAnalyzer from '../components/AISkillGapAnalyzer';
import AISalaryEstimator from '../components/AISalaryEstimator';
import AIEnhanceButton from '../components/AIEnhanceButton';
import AIHelperBot from '../components/AIHelperBot';

// ============================================
// Example 1: Worker Dashboard with AI Features
// ============================================

export const WorkerDashboardAIExample = () => {
  const { user } = useAuthStore();
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Worker Dashboard</h1>

      {/* AI Job Recommendations Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">🎯 AI Job Recommendations</h2>
        <AIJobMatcher
          workerId={user._id}
          onMatchesFound={(matches) => {
            setJobRecommendations(matches);
          }}
        />

        {/* Display job recommendations */}
        {jobRecommendations.length > 0 && (
          <div className="mt-4 grid gap-4">
            {jobRecommendations.map((job, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <h3 className="font-semibold">{job.jobType}</h3>
                <p className="text-sm text-slate-600 mt-1">{job.reasoning}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span className="text-emerald-600">
                    Match: {job.skillMatch}%
                  </span>
                  <span className="text-primary-600">
                    Demand: {job.marketDemand}
                  </span>
                  <span className="text-purple-600">
                    {job.estimatedSalary}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Skill Development Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">💡 Skill Recommendations</h2>
          <AISkillRecommender
            currentProfession={user.profession}
            currentSkills={user.skills || []}
            onSkillsRecommended={(skills) => {
              setRecommendedSkills(skills);
            }}
          />

          {recommendedSkills.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-slate-600">Top skills to learn:</p>
              {recommendedSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700">{skill}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">💰 Salary Estimation</h2>
          <AISalaryEstimator
            profession={user.profession}
            skills={user.skills}
            experience={user.experience || 0}
            location={user.location?.city}
          />
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Career Development</h2>
        <AISkillGapAnalyzer
          currentSkills={user.skills || []}
          targetProfession={`Senior ${user.profession || "Professional"}`}
        />
      </div>
    </div>
  );
};

// ============================================
// Example 2: Employer Job Creation with AI
// ============================================

export const EmployerJobCreationAIExample = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyDescription: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Job Posting</h1>

      <form className="space-y-6">
        {/* Job Title with AI Enhancement */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Job Title
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="e.g., Experienced Electrician"
            />
            <AIEnhanceButton
              text={formData.title}
              type="jobTitle"
              onEnhanced={(enhanced) => handleChange('title', enhanced)}
            />
          </div>
        </div>

        {/* Job Description with AI Enhancement */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Job Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            rows={6}
            placeholder="Describe the job requirements, responsibilities, etc."
          />
          <div className="mt-2">
            <AIEnhanceButton
              text={formData.description}
              type="jobDescription"
              onEnhanced={(enhanced) => handleChange('description', enhanced)}
            />
          </div>
        </div>

        {/* Company Description with AI Enhancement */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Company Description
          </label>
          <textarea
            value={formData.companyDescription}
            onChange={(e) => handleChange('companyDescription', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            rows={4}
            placeholder="Tell candidates about your company"
          />
          <div className="mt-2">
            <AIEnhanceButton
              text={formData.companyDescription}
              type="companyDescription"
              onEnhanced={(enhanced) => handleChange('companyDescription', enhanced)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
        >
          Create Job Posting
        </button>
      </form>
    </div>
  );
};

// ============================================
// Example 3: Employer Job Applications with AI
// ============================================

export const EmployerApplicationsAIExample = ({ jobId }) => {
  const [aiMatches, setAiMatches] = useState([]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Job Applications</h1>

      {/* AI Worker Recommendations */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          🤖 AI-Recommended Workers
        </h2>
        <p className="text-slate-600 mb-4">
          Our AI has analyzed available workers and ranked them based on their
          match with your job requirements.
        </p>

        <AIWorkerMatcher
          jobId={jobId}
          onWorkersFound={(workers) => {
            setAiMatches(workers);
            console.log('AI found workers:', workers);
          }}
        />

        {/* Display AI-matched workers */}
        {aiMatches.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-slate-800">
              Top {aiMatches.length} Candidates:
            </h3>
            {/* Workers will be displayed by the AIWorkerMatcher component */}
          </div>
        )}
      </div>

      {/* Regular Applications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">All Applications</h2>
        {/* Your existing applications list */}
      </div>
    </div>
  );
};

// ============================================
// Example 4: Worker Profile Enhancement
// ============================================

export const WorkerProfileEnhancementExample = ({ worker, onUpdate }) => {
  const [bio, setBio] = useState(worker.bio || '');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Profile</h1>

      {/* Bio with AI Enhancement */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Professional Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows={5}
          placeholder="Tell employers about your experience and expertise"
        />
        <div className="mt-2 flex gap-2">
          <AIEnhanceButton
            text={bio}
            type="workerBio"
            onEnhanced={(enhanced) => setBio(enhanced)}
          />
          <button
            onClick={() => onUpdate({ bio })}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Save Bio
          </button>
        </div>
      </div>

      {/* Career Development Tools */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📈 Skill Development</h3>
          <AISkillGapAnalyzer
            currentSkills={worker.skills}
            targetProfession={worker.profession}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">💰 Market Value</h3>
          <AISalaryEstimator
            profession={worker.profession}
            skills={worker.skills}
            experience={worker.experience}
            location={worker.location?.city}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// Example 5: Adding AI Helper Bot to Any Page
// ============================================

export const PageWithAIHelper = () => {
  return (
    <div>
      <h1>Any Page in Your App</h1>
      
      {/* Your page content */}
      <div className="content">
        {/* ... */}
      </div>

      {/* AI Helper Bot - Floating button appears automatically */}
      <AIHelperBot />
    </div>
  );
};

// ============================================
// Example 6: Using AI Service Directly
// ============================================

export const DirectAIServiceExample = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCustomAIRequest = async () => {
    setLoading(true);
    try {
      // Example: Custom salary estimation
      const salaryData = await aiService.estimateSalary(
        'Carpenter',
        ['Furniture Making', 'Wood Working', 'Finishing'],
        8,
        'Kochi'
      );
      setResult(salaryData.data);

      // Example: Custom chat
      const chatResponse = await aiService.chatWithAI(
        'What are the best practices for construction safety?',
        'safety-chat-123',
        'worker'
      );
      console.log('AI Response:', chatResponse.data.message);

      // Example: Generate interview questions
      const questions = await aiService.generateInterviewQuestions(
        'Senior Plumber',
        ['Pipe Installation', 'Leak Detection', 'System Design'],
        'senior'
      );
      console.log('Interview Questions:', questions.data);

    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCustomAIRequest} disabled={loading}>
        {loading ? 'Processing...' : 'Get AI Insights'}
      </button>
      
      {result && (
        <div className="mt-4">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
