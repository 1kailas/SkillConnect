import { useState } from 'react';
import { FiArrowLeft, FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiUsers, FiCalendar, FiCheckCircle, FiStar, FiPhone, FiMail, FiGlobe } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { jobId } = useParams();
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Mock job data
  const job = {
    id: jobId || 1,
    title: 'Electrician for Villa Project',
    company: 'Tech Solutions Pvt Ltd',
    companyRating: 4.8,
    category: 'Electrician',
    location: 'Bangalore, Karnataka',
    type: 'Contract',
    salary: '₹25,000 - ₹35,000/month',
    posted: '2 days ago',
    applicants: 24,
    views: 156,
    experience: '3-5 years',
    positions: 1,
    startDate: 'March 15, 2024',
    duration: '2 months',
    description: 'We are looking for an experienced electrician to handle complete electrical installation for a premium 3BHK villa project. The ideal candidate should have expertise in residential wiring, panel installation, and smart home integration.',
    requirements: [
      'Valid ITI Electrician certificate',
      'Minimum 3 years of experience in residential electrical work',
      'Knowledge of modern wiring systems and safety standards',
      'Experience with smart home installations (preferred)',
      'Good communication skills in English/Hindi/Kannada',
    ],
    skills: ['Wiring', 'Panel Installation', 'Troubleshooting', 'Safety Compliance'],
    benefits: [
      'Competitive salary package',
      'Accommodation provided',
      'All materials and tools provided',
      'Safety equipment provided',
      'Timely payment guaranteed',
    ],
    companyInfo: {
      phone: '+91 98765 43210',
      email: 'hr@techsolutions.com',
      website: 'https://techsolutions.com',
      employees: '50-100',
      industry: 'Technology',
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    toast.success('Application submitted successfully!');
    setShowApplyModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <FiArrowLeft /> Back to Jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                {job.company.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-2">{job.title}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg text-slate-700 font-medium">{job.company}</h2>
                  <div className="flex items-center gap-1 text-amber-500">
                    <FiStar className="w-4 h-4 fill-amber-400" />
                    <span className="text-sm font-medium text-slate-900">{job.companyRating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="badge bg-primary-100 text-primary-700">{job.category}</span>
                  <span className="badge bg-slate-100 text-slate-700">{job.type}</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-slate-700">
                <FiMapPin className="w-5 h-5 text-slate-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiDollarSign className="w-5 h-5 text-slate-500" />
                <span className="font-medium">{job.salary}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiClock className="w-5 h-5 text-slate-500" />
                <span>Duration: {job.duration}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiCalendar className="w-5 h-5 text-slate-500" />
                <span>Start: {job.startDate}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiUsers className="w-5 h-5 text-slate-500" />
                <span>{job.applicants} applicants</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiBriefcase className="w-5 h-5 text-slate-500" />
                <span>{job.experience} experience</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Job Description</h3>
                <p className="text-slate-700 leading-relaxed">{job.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-700">
                      <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="badge bg-primary-100 text-primary-700">{skill}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-700">
                      <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card sticky top-6 space-y-4">
            <button onClick={() => setShowApplyModal(true)} className="btn btn-primary w-full">
              Apply Now
            </button>
            <button className="btn btn-outline w-full">
              Save Job
            </button>

            <div className="pt-4 border-t space-y-3">
              <h3 className="font-semibold text-slate-900">Company Information</h3>
              <div className="space-y-2 text-sm">
                <p className="text-slate-700"><span className="font-medium">Industry:</span> {job.companyInfo.industry}</p>
                <p className="text-slate-700"><span className="font-medium">Company Size:</span> {job.companyInfo.employees} employees</p>
              </div>
              <div className="space-y-2">
                <a href={`tel:${job.companyInfo.phone}`} className="flex items-center gap-2 text-slate-700 hover:text-primary-600 transition">
                  <FiPhone className="w-4 h-4" />
                  <span className="text-sm">{job.companyInfo.phone}</span>
                </a>
                <a href={`mailto:${job.companyInfo.email}`} className="flex items-center gap-2 text-slate-700 hover:text-primary-600 transition">
                  <FiMail className="w-4 h-4" />
                  <span className="text-sm">{job.companyInfo.email}</span>
                </a>
                <a href={job.companyInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-700 hover:text-primary-600 transition">
                  <FiGlobe className="w-4 h-4" />
                  <span className="text-sm">Visit Website</span>
                </a>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-slate-500">Posted {job.posted}</p>
              <p className="text-xs text-slate-500 mt-1">{job.views} views • {job.applicants} applicants</p>
            </div>
          </motion.div>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">Apply for this Job</h2>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="label">Cover Letter *</label>
                <textarea className="input" rows="4" placeholder="Tell us why you're perfect for this role..." required></textarea>
              </div>
              <div>
                <label className="label">Expected Salary</label>
                <input type="text" className="input" placeholder="e.g., ₹30,000/month" />
              </div>
              <div>
                <label className="label">Available Start Date</label>
                <input type="date" className="input" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Submit Application</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
