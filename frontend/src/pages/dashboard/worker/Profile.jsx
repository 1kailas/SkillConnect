import { useState, useMemo, useEffect } from 'react';
import { FiUser, FiMapPin, FiBriefcase, FiPhone, FiMail, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import useAuthStore from '../../../store/authStore';
import toast from 'react-hot-toast';
import AISkillRecommender from '../../../components/AISkillRecommender';
import AISkillGapAnalyzer from '../../../components/AISkillGapAnalyzer';
import AISalaryEstimator from '../../../components/AISalaryEstimator';
import AIEnhanceButton from '../../../components/AIEnhanceButton';
import SkillsManager from '../../../components/SkillsManager';

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use mock data if user is missing
  const profileUser = useMemo(() => user || {
    _id: 'mock-user-id',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    profession: 'Electrician',
    location: 'Mumbai, Maharashtra',
    experience: '5 years',
    hourlyRate: '500',
    bio: 'Experienced electrician specializing in residential and commercial electrical work.',
    skills: [
      { name: 'Wiring', level: 'advanced', proofType: 'certificate', yearsOfExperience: 5, proof: { certificateTitle: 'Advanced Electrical Wiring', certificateIssuer: 'National Institute' } },
      { name: 'Circuit Installation', level: 'intermediate', proofType: 'project', yearsOfExperience: 3, proof: { projectTitle: 'Smart Home Setup', projectDescription: 'Installed complete circuit system for modern home' } },
      { name: 'Troubleshooting', level: 'advanced', proofType: 'none', yearsOfExperience: 5, proof: {} },
      { name: 'Maintenance', level: 'beginner', proofType: 'none', yearsOfExperience: 1, proof: {} }
    ],
    role: 'worker'
  }, [user]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    location: '',
    experience: '',
    hourlyRate: '',
    bio: '',
    skills: [],
  });

  // Populate form data when profileUser changes
  useEffect(() => {
    console.log('Profile User Data:', profileUser);
    
    // Handle skills - ensure it's an array with the new structure
    let skills = [];
    if (Array.isArray(profileUser?.skills)) {
      // Check if it's the new structure (array of objects) or old (array of strings)
      skills = profileUser.skills.map(skill => {
        if (typeof skill === 'string') {
          // Convert old format to new format
          return {
            name: skill,
            level: 'beginner',
            proofType: 'none',
            yearsOfExperience: 0,
            proof: {}
          };
        }
        // Already in new format
        return skill;
      });
    }

    // Handle location - convert object to string if needed
    const location = typeof profileUser?.location === 'string' 
      ? profileUser.location 
      : profileUser?.location?.address || profileUser?.location?.city || '';

    const formValues = {
      name: profileUser?.name || '',
      email: profileUser?.email || '',
      phone: profileUser?.phone || '',
      profession: profileUser?.profession || '',
      location,
      experience: profileUser?.experience?.toString() || '',
      hourlyRate: profileUser?.hourlyRate?.toString() || '',
      bio: profileUser?.bio || '',
      skills,
    };
    
    console.log('Setting form data:', formValues);
    setFormData(formValues);
  }, [profileUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Skills are already in the correct array format
      const updatedData = { ...formData };
      
      if (user) {
        console.log('Submitting profile update:', updatedData);
        const updated = await updateProfile(updatedData);
        console.log('Profile updated successfully:', updated);
        setIsEditing(false);
      } else {
        // Mock update for development
        console.log('Mock update:', updatedData);
        toast.success('Profile updated (mock mode)');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary w-full sm:w-auto">
            <FiEdit2 /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-5xl font-bold mx-auto mb-4">
              {profileUser?.name?.charAt(0) || 'W'}
            </div>
            <h2 className="text-xl font-heading font-bold text-slate-900">{profileUser?.name}</h2>
            <p className="text-slate-600">{profileUser?.profession || 'Worker'}</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-slate-500">
              <FiMapPin className="w-4 h-4" />
              {typeof profileUser?.location === 'string' 
                ? profileUser.location 
                : profileUser?.location?.address || profileUser?.location?.city || 'Kerala'}
            </div>
            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Member Since</span>
                <span className="font-medium">Jan 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Profile Views</span>
                <span className="font-medium">234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Response Rate</span>
                <span className="font-medium text-emerald-600">95%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-slate-900">Personal Information</h3>
              {isEditing && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline text-sm">
                    <FiX /> Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-primary text-sm">
                    {loading ? <div className="spinner border-white" /> : <><FiSave /> Save</>}
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={!isEditing} className="input pl-10" required />
                </div>
              </div>
              <div>
                <label className="label">Profession *</label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input type="text" value={formData.profession} onChange={(e) => setFormData({...formData, profession: e.target.value})} disabled={!isEditing} className="input pl-10" placeholder="e.g., Electrician" required />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Email *</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={!isEditing} className="input pl-10" required />
                </div>
              </div>
              <div>
                <label className="label">Phone *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} disabled={!isEditing} className="input pl-10" required />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Location *</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} disabled={!isEditing} className="input pl-10" placeholder="e.g., Kottayam" required />
                </div>
              </div>
              <div>
                <label className="label">Experience</label>
                <input type="text" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} disabled={!isEditing} className="input" placeholder="e.g., 5 years" />
              </div>
            </div>

            <div>
              <label className="label">Hourly Rate</label>
              <input type="text" value={formData.hourlyRate} onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})} disabled={!isEditing} className="input" placeholder="e.g., ₹500/hour" />
            </div>

            <div>
              <label className="label">Bio</label>
              <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} disabled={!isEditing} className="input min-h-[100px]" placeholder="Tell us about yourself..." />
              {isEditing && (
                <div className="mt-2">
                  <AIEnhanceButton
                    text={formData.bio}
                    type="workerBio"
                    onEnhanced={(enhanced) => setFormData({...formData, bio: enhanced})}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Skills Management Section */}
      <div className="card">
        <SkillsManager 
          skills={formData.skills}
          onUpdate={(updatedSkills) => setFormData({...formData, skills: updatedSkills})}
          isEditing={isEditing}
        />
      </div>

      {/* AI Career Development Section */}
      {!isEditing && (
        <>
          {/* AI Skill Recommendations */}
          <div className="card bg-gradient-to-br from-primary-50 to-violet-50 border border-primary-200">
            <div className="mb-4">
              <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">💡 AI Skill Recommendations</h2>
              <p className="text-slate-600 text-sm">
                Discover trending skills that can boost your career based on your current expertise
              </p>
            </div>
            <AISkillRecommender
              currentProfession={profileUser?.profession}
              currentSkills={Array.isArray(profileUser?.skills) 
                ? profileUser.skills.map(s => typeof s === 'string' ? s : s.name) 
                : []
              }
              onSkillsRecommended={(skills) => {
                toast.success(`AI suggests learning: ${skills.slice(0, 3).join(', ')}`);
              }}
            />
          </div>

          {/* AI Skill Gap Analysis */}
          <div className="card bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold text-slate-900">📊 Career Development Path</h2>
            </div>
            <p className="text-slate-600 mb-4 text-sm">
              Analyze gaps between your current skills and your career goals
            </p>
            <AISkillGapAnalyzer
              currentSkills={Array.isArray(profileUser?.skills) 
                ? profileUser.skills.map(s => typeof s === 'string' ? s : s.name)
                : []
              }
              targetProfession={`Senior ${profileUser?.profession || 'Professional'}`}
            />
          </div>

          {/* AI Salary Estimator */}
          <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
            <div className="mb-4">
              <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">💰 Market Value Analysis</h2>
              <p className="text-slate-600 text-sm">
                Get AI-powered salary estimates based on your skills, experience, and location
              </p>
            </div>
            <AISalaryEstimator
              profession={profileUser?.profession}
              skills={Array.isArray(profileUser?.skills) ? profileUser.skills : []}
              experience={parseInt(profileUser?.experience) || 0}
              location={typeof profileUser?.location === 'string' ? profileUser.location : profileUser?.location?.city}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
