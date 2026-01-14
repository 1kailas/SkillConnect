import { useState, useEffect } from 'react';
import { FiArrowLeft, FiBriefcase, FiMapPin, FiDollarSign, FiSave } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: 'Electrician for Villa Project',
    category: 'Electrician',
    location: 'Bangalore, Karnataka',
    type: 'Contract',
    description: 'Looking for an experienced electrician to handle complete electrical installation for a 3BHK villa project.',
    requirements: 'Valid ITI certificate\nMinimum 3 years experience\nKnowledge of residential wiring',
    skills: 'Wiring, Panel Installation, Safety Standards',
    experience: '3-5',
    salaryType: 'monthly',
    salaryMin: '25000',
    salaryMax: '35000',
    startDate: '2024-03-01',
    duration: '2 months',
    positions: '1',
    status: 'active',
  });

  const categories = [
    'Electrician', 'Plumber', 'Carpenter', 'Mason', 'Painter',
    'Welder', 'AC Technician', 'Driver', 'Helper', 'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Job updated successfully!');
    navigate('/employer/jobs');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/employer/jobs" className="text-slate-600 hover:text-slate-900">
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
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Location *</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="input" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Job Type *</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="input" required>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Project">Project Based</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Number of Positions *</label>
                    <input type="number" name="positions" value={formData.positions} onChange={handleChange} className="input" min="1" required />
                  </div>
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
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="label">Minimum Experience *</label>
                    <select name="experience" value={formData.experience} onChange={handleChange} className="input" required>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Status *</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="input" required>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
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
                    <option value="hourly">Hourly</option>
                    <option value="fixed">Fixed Project Cost</option>
                  </select>
                </div>

                {formData.salaryType === 'fixed' ? (
                  <div>
                    <label className="label">Project Budget (₹) *</label>
                    <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className="input" required />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Minimum {formData.salaryType === 'hourly' ? 'Rate' : 'Salary'} (₹) *</label>
                      <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className="input" required />
                    </div>
                    <div>
                      <label className="label">Maximum {formData.salaryType === 'hourly' ? 'Rate' : 'Salary'} (₹) *</label>
                      <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} className="input" required />
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
                  <button type="submit" className="btn btn-primary w-full">
                    <FiSave /> Save Changes
                  </button>
                  <Link to="/employer/jobs" className="btn btn-outline w-full text-center">
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
