import { useState, useEffect } from 'react';
import { FiArrowLeft, FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiUsers, FiCalendar, FiCheckCircle, FiStar, FiPhone, FiMail, FiGlobe, FiHeart, FiShare2, FiX } from 'react-icons/fi';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../store/authStore';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [application, setApplication] = useState({
    coverLetter: '',
    expectedSalary: '',
    availableDate: ''
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/jobs/${id}`);
      setJob(data.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      if (error.response?.status === 404) {
        toast.error('Job not found');
      } else {
        toast.error('Failed to load job details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to apply for this job');
      navigate('/auth/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (user.role !== 'worker') {
      toast.error('Only workers can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      await api.post(`/jobs/${id}/apply`, application);
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setApplication({ coverLetter: '', expectedSalary: '', availableDate: '' });
      fetchJob(); // Refresh to update applicant count
    } catch (error) {
      console.error('Error applying:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Job removed from saved' : 'Job saved successfully');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: `Check out this job: ${job?.title}`,
          url
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(url);
          toast.success('Link copied!');
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading job details..." />;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBriefcase className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Not Found</h2>
          <p className="text-slate-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="btn btn-primary">
            <FiArrowLeft /> Browse Jobs
          </Link>
        </motion.div>
      </div>
    );
  }

  // Extract values with fallbacks
  const salary = job.salary || job.budget;
  const requirements = job.requirements || [];
  const skills = job.skills || job.skillsRequired || [];
  const benefits = job.benefits || [];
  const applicantCount = job.applicants?.length || job.applicantCount || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium">
        <FiArrowLeft /> Back to Jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {(job.employer?.companyName || job.company || 'C').charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-2">{job.title}</h1>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h2 className="text-lg text-slate-700 font-medium">{job.employer?.companyName || job.company || 'Company'}</h2>
                  {(job.employer?.rating?.average || job.companyRating) && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <FiStar className="w-4 h-4 fill-amber-400" />
                      <span className="text-sm font-medium text-slate-900">{(job.employer?.rating?.average || job.companyRating).toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="badge bg-primary-100 text-primary-700">{job.category}</span>
                  <span className="badge bg-slate-100 text-slate-700">{job.type || 'Full-time'}</span>
                  {job.status && (
                    <span className={`badge ${job.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-slate-700">
                <FiMapPin className="w-5 h-5 text-primary-500" />
                <span>{job.location?.city || job.location || 'Location not specified'}, {job.location?.state || 'Kerala'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiDollarSign className="w-5 h-5 text-primary-500" />
                <span className="font-medium">
                  {typeof salary === 'object' 
                    ? `₹${salary.min?.toLocaleString()} - ₹${salary.max?.toLocaleString()}` 
                    : salary ? `₹${salary.toLocaleString()}` : 'Negotiable'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiClock className="w-5 h-5 text-primary-500" />
                <span>Duration: {job.duration?.value ? `${job.duration.value} ${job.duration.unit || 'days'}` : 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiCalendar className="w-5 h-5 text-primary-500" />
                <span>Start: {formatDate(job.startDate) || 'Flexible'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiUsers className="w-5 h-5 text-primary-500" />
                <span>{applicantCount} applicant{applicantCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiBriefcase className="w-5 h-5 text-primary-500" />
                <span>{job.experience || job.experienceRequired || '0'} years experience</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Job Description</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.description || 'No description provided.'}</p>
              </div>

              {requirements.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-700">
                        <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {skills.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-xl font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {benefits.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-700">
                        <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card sticky top-6 space-y-4">
            {job.status === 'open' && (
              <button onClick={() => setShowApplyModal(true)} className="btn btn-primary w-full">
                Apply Now
              </button>
            )}
            <div className="flex gap-2">
              <button onClick={handleSave} className={`btn flex-1 ${isSaved ? 'btn-primary' : 'btn-outline'}`}>
                <FiHeart className={isSaved ? 'fill-current' : ''} /> {isSaved ? 'Saved' : 'Save'}
              </button>
              <button onClick={handleShare} className="btn btn-outline flex-1">
                <FiShare2 /> Share
              </button>
            </div>

            <div className="pt-4 border-t space-y-3">
              <h3 className="font-semibold text-slate-900">Company Information</h3>
              <div className="space-y-2 text-sm">
                {job.employer?.industry && (
                  <p className="text-slate-700"><span className="font-medium">Industry:</span> {job.employer.industry}</p>
                )}
                {job.employer?.companySize && (
                  <p className="text-slate-700"><span className="font-medium">Company Size:</span> {job.employer.companySize} employees</p>
                )}
              </div>
              <div className="space-y-2">
                {job.employer?.phone && (
                  <a href={`tel:${job.employer.phone}`} className="flex items-center gap-2 text-slate-700 hover:text-primary-600 transition">
                    <FiPhone className="w-4 h-4" />
                    <span className="text-sm">{job.employer.phone}</span>
                  </a>
                )}
                {job.employer?.email && (
                  <a href={`mailto:${job.employer.email}`} className="flex items-center gap-2 text-slate-700 hover:text-primary-600 transition">
                    <FiMail className="w-4 h-4" />
                    <span className="text-sm">{job.employer.email}</span>
                  </a>
                )}
                {job.employer?.website && (
                  <a href={job.employer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-700 hover:text-primary-600 transition">
                    <FiGlobe className="w-4 h-4" />
                    <span className="text-sm">Visit Website</span>
                  </a>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-slate-500">Posted {getTimeAgo(job.createdAt)}</p>
              <p className="text-xs text-slate-500 mt-1">{applicantCount} applicant{applicantCount !== 1 ? 's' : ''}</p>
              {job.deadline && (
                <p className="text-xs text-amber-600 mt-1 font-medium">Apply by {formatDate(job.deadline)}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowApplyModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-heading font-bold text-slate-900">Apply for this Job</h2>
                <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cover Letter *</label>
                  <textarea 
                    className="input" 
                    rows="4" 
                    placeholder="Tell us why you're perfect for this role..." 
                    required
                    value={application.coverLetter}
                    onChange={e => setApplication({...application, coverLetter: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Salary (₹)</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="e.g., 30,000/month"
                    value={application.expectedSalary}
                    onChange={e => setApplication({...application, expectedSalary: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Available Start Date</label>
                  <input 
                    type="date" 
                    className="input"
                    value={application.availableDate}
                    onChange={e => setApplication({...application, availableDate: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-ghost flex-1">Cancel</button>
                  <button type="submit" disabled={applying} className="btn btn-primary flex-1">
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDetails;
