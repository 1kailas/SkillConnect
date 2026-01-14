import { useState, useEffect } from 'react';
import { FiArrowLeft, FiBriefcase, FiMapPin, FiDollarSign, FiSave } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../../lib/axios';
import LoadingSpinner from '../../../components/LoadingSpinner';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'electrical',
    location: '',
    city: '',
    state: 'Kerala',
    pincode: '',
    jobType: 'full-time',
    description: '',
    requirements: '',
    skills: '',
    experience: '0',
    salaryType: 'monthly',
    salaryMin: '',
    salaryMax: '',
    startDate: '',
    duration: '',
    workersNeeded: 1,
    urgency: 'medium',
    status: 'open',
  });

  const categories = [
    { value: 'construction', label: 'Construction' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'painting', label: 'Painting' },
    { value: 'welding', label: 'Welding' },
    { value: 'masonry', label: 'Masonry' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/jobs/${jobId}`);
      const job = data.data;
      
      setFormData({
        title: job.title || '',
        category: job.category || 'electrical',
        location: job.location?.address || '',
        city: job.location?.city || '',
        state: job.location?.state || 'Kerala',
        pincode: job.location?.pincode || '',
        jobType: job.jobType || 'full-time',
        description: job.description || '',
        requirements: job.requirements?.education || '',
        skills: job.skills?.join(', ') || '',
        experience: job.requirements?.experience?.toString() || '0',
        salaryType: job.salary?.type || 'monthly',
        salaryMin: job.salary?.min?.toString() || job.salary?.amount?.toString() || '',
        salaryMax: job.salary?.max?.toString() || '',
        startDate: job.startDate ? new Date(job.startDate).toISOString().split('T')[0] : '',
        duration: job.duration?.value ? `${job.duration.value} ${job.duration.unit}` : '',
        workersNeeded: job.workersNeeded || 1,
        urgency: job.urgency || 'medium',
        status: job.status || 'open',
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
      navigate('/dashboard/employer/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const salaryMin = parseFloat(formData.salaryMin) || 0;
      const salaryMax = parseFloat(formData.salaryMax) || salaryMin;

      const jobData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        jobType: formData.jobType,
        location: {
          type: 'Point',
          coordinates: [76.2673, 9.9312],
          address: formData.location || `${formData.city}, ${formData.state}`,
          city: formData.city,
          state: formData.state || 'Kerala',
          pincode: formData.pincode,
        },
        salary: {
          min: salaryMin,
          max: salaryMax,
          amount: salaryMin,
          type: formData.salaryType,
          currency: 'INR',
        },
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        requirements: {
          experience: parseInt(formData.experience) || 0,
          education: formData.requirements || '',
        },
        workersNeeded: parseInt(formData.workersNeeded) || 1,
        urgency: formData.urgency || 'medium',
        status: formData.status,
        startDate: formData.startDate || undefined,
      };

      await api.put(`/jobs/${jobId}`, jobData);
      toast.success('Job updated successfully!');
      navigate('/dashboard/employer/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading job details..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/employer/jobs" className="text-slate-600 hover:text-slate-900">
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Edit Job</h1>
          <p className="text-slate-600 mt-1">Update job details and requirements</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FiBriefcase className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Job Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Job Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="input" required />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="input" required>
                      {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Job Type *</label>
                    <select name="jobType" value={formData.jobType} onChange={handleChange} className="input" required>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="temporary">Temporary</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="input" required />
                  </div>
                  <div>
                    <label className="label">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">Pincode</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="input" />
                  </div>
                </div>

                <div>
                  <label className="label">Full Address</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="input" />
                </div>

                <div>
                  <label className="label">Job Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="input" rows="4" required></textarea>
                </div>

                <div>
                  <label className="label">Requirements *</label>
                  <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="input" rows="3" required></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Required Skills</label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="input" placeholder="e.g., Wiring, Installation" />
                  </div>
                  <div>
                    <label className="label">Minimum Experience (Years)</label>
                    <select name="experience" value={formData.experience} onChange={handleChange} className="input">
                      <option value="0">No experience required</option>
                      <option value="1">1+ years</option>
                      <option value="2">2+ years</option>
                      <option value="3">3+ years</option>
                      <option value="5">5+ years</option>
                      <option value="10">10+ years</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Status *</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="input" required>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="closed">Closed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Urgency</label>
                    <select name="urgency" value={formData.urgency} onChange={handleChange} className="input">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Compensation</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Salary Type *</label>
                  <select name="salaryType" value={formData.salaryType} onChange={handleChange} className="input" required>
                    <option value="monthly">Monthly</option>
                    <option value="daily">Daily</option>
                    <option value="hourly">Hourly</option>
                    <option value="weekly">Weekly</option>
                    <option value="fixed">Fixed Project Cost</option>
                  </select>
                </div>

                {formData.salaryType === 'fixed' ? (
                  <div>
                    <label className="label">Project Budget (₹) *</label>
                    <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className="input" required min="0" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Minimum {formData.salaryType === 'hourly' ? 'Rate' : formData.salaryType === 'daily' ? 'Daily Rate' : 'Salary'} (₹) *</label>
                      <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className="input" required min="0" />
                    </div>
                    <div>
                      <label className="label">Maximum {formData.salaryType === 'hourly' ? 'Rate' : formData.salaryType === 'daily' ? 'Daily Rate' : 'Salary'} (₹)</label>
                      <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} className="input" min="0" />
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">Duration</label>
                    <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="input" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card sticky top-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Job Preview</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{formData.title}</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="badge bg-primary-100 text-primary-700">{formData.category}</span>
                    <span className="badge bg-slate-100 text-slate-700">{formData.type}</span>
                    <span className={`badge ${formData.status === 'active' ? 'bg-emerald-100 text-emerald-700' : formData.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                      {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <FiMapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">{formData.location}</span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="text-sm text-emerald-700 mb-1">Salary</div>
                  <div className="font-semibold text-emerald-900">
                    {formData.salaryType === 'fixed' 
                      ? `₹${formData.salaryMin} (Fixed)`
                      : `₹${formData.salaryMin} - ₹${formData.salaryMax}/${formData.salaryType}`
                    }
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <button type="submit" disabled={saving} className="btn btn-primary w-full">
                    {saving ? 'Saving...' : <><FiSave /> Save Changes</>}
                  </button>
                  <Link to="/dashboard/employer/jobs" className="btn btn-outline w-full text-center">
                    Cancel
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
