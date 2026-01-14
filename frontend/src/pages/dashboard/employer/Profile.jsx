import { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiBriefcase, FiMapPin, FiGlobe, FiUsers, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../../../store/authStore';

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use mock data if user is not logged in
  const profileUser = user || {
    _id: 'mock-employer-id',
    companyName: 'Tech Solutions Pvt Ltd',
    email: 'hr@techsolutions.com',
    phone: '+91 98765 43210',
    industry: 'Technology',
    companySize: '50-100',
    location: 'Bangalore, Karnataka',
    website: 'https://techsolutions.com',
    description: 'Leading IT solutions provider specializing in enterprise software development and digital transformation. We are committed to delivering innovative solutions that drive business growth.',
    foundedYear: '2015',
    role: 'employer'
  };

  const [profile, setProfile] = useState({
    companyName: profileUser?.companyName || profileUser?.name || '',
    email: profileUser?.email || '',
    phone: profileUser?.phone || '',
    industry: profileUser?.industry || '',
    companySize: profileUser?.companySize || '',
    location: typeof profileUser?.location === 'string' 
      ? profileUser.location 
      : profileUser?.location?.address || profileUser?.location?.city || '',
    website: profileUser?.website || '',
    description: profileUser?.description || profileUser?.bio || '',
    foundedYear: profileUser?.foundedYear || '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      if (user) {
        await updateProfile(profile);
      } else {
        // Mock update for development
        console.log('Mock update:', profile);
        toast.success('Profile updated (mock mode)');
      }
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Member Since', value: 'Jan 2023', icon: FiCalendar },
    { label: 'Active Jobs', value: '8', icon: FiBriefcase },
    { label: 'Hired Workers', value: '24', icon: FiUsers },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Company Profile</h1>
          <p className="text-slate-600 mt-1">Manage your company information and branding</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary w-full sm:w-auto">
            <FiEdit2 /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleSave} className="btn btn-primary flex-1 sm:flex-initial">
              <FiSave /> Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-outline flex-1 sm:flex-initial">
              <FiX /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 card">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {profile.companyName.charAt(0)}
              </div>
              {isEditing && (
                <button className="text-xs text-primary-600 hover:text-primary-700 mt-2 font-medium">Change Logo</button>
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  className="input text-2xl font-bold mb-2"
                />
              ) : (
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{profile.companyName}</h2>
              )}
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-1"><FiBriefcase /> {profile.industry}</span>
                <span className="flex items-center gap-1"><FiMapPin /> {typeof profile.location === 'string' ? profile.location : profile.location?.address || profile.location?.city || 'N/A'}</span>
                <span className="flex items-center gap-1"><FiUsers /> {profile.companySize} employees</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Company Description</label>
              {isEditing ? (
                <textarea
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="input"
                  rows="4"
                />
              ) : (
                <p className="text-slate-700 leading-relaxed">{profile.description}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="input"
                  />
                ) : (
                  <p className="text-slate-900">{profile.email}</p>
                )}
              </div>
              <div>
                <label className="label">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="input"
                  />
                ) : (
                  <p className="text-slate-900">{profile.phone}</p>
                )}
              </div>
              <div>
                <label className="label">Industry</label>
                {isEditing ? (
                  <select
                    value={profile.industry}
                    onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                    className="input"
                  >
                    <option>Technology</option>
                    <option>Construction</option>
                    <option>Manufacturing</option>
                    <option>Healthcare</option>
                    <option>Hospitality</option>
                    <option>Other</option>
                  </select>
                ) : (
                  <p className="text-slate-900">{profile.industry}</p>
                )}
              </div>
              <div>
                <label className="label">Company Size</label>
                {isEditing ? (
                  <select
                    value={profile.companySize}
                    onChange={(e) => setProfile({ ...profile, companySize: e.target.value })}
                    className="input"
                  >
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>50-100</option>
                    <option>100-500</option>
                    <option>500+</option>
                  </select>
                ) : (
                  <p className="text-slate-900">{profile.companySize} employees</p>
                )}
              </div>
              <div>
                <label className="label">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="input"
                  />
                ) : (
                  <p className="text-slate-900">{profile.location}</p>
                )}
              </div>
              <div>
                <label className="label">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="input"
                  />
                ) : (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    <FiGlobe /> Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card text-center">
                <Icon className="w-8 h-8 mx-auto text-primary-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
