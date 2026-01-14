import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiCalendar, FiFilter, FiSearch, FiExternalLink } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../../store/authStore';

const Jobs = () => {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs');
      setJobs(data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply`, {
        coverLetter: 'I am interested in this position.',
      });
      toast.success('Application submitted successfully!');
      fetchJobs();
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatLocation = (location) => {
    if (typeof location === 'string') return location;
    return location?.city || location?.address || 'Not specified';
  };

  const formatSalary = (job) => {
    if (!job.salary) return 'Not specified';
    const { amount, type } = job.salary;
    return `₹${amount}/${type}`;
  };

  const hasApplied = (job) => {
    return job.applicants?.some(app => app.worker === user?._id);
  };

  const stats = [
    { label: 'Total Jobs', value: jobs.length, color: 'text-primary-600', bgColor: 'bg-primary-50' },
    { label: 'Open Jobs', value: jobs.filter(j => j.status === 'open').length, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'My Applications', value: jobs.filter(j => hasApplied(j)).length, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-1">My Jobs</h1>
        <p className="text-slate-600">Track and manage all your jobs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card">
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
              <FiBriefcase className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search jobs..." className="input pl-10 w-full" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'open', 'in-progress', 'completed', 'closed'].map((status) => (
              <button key={status} onClick={() => setFilter(status)} className={`btn whitespace-nowrap ${filter === status ? 'btn-primary' : 'btn-outline'}`}>
                {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job, index) => (
            <motion.div key={job._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border border-slate-200 rounded-lg p-4 hover:border-primary-300 transition">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`badge ${job.status === 'open' ? 'bg-emerald-100 text-emerald-700' : job.status === 'in-progress' ? 'bg-primary-100 text-primary-700' : job.status === 'completed' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                      {job.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                    <span className="badge bg-slate-100 text-slate-700">{job.jobType}</span>
                    {hasApplied(job) && <span className="badge bg-primary-100 text-primary-700">Applied</span>}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{job.title}</h3>
                  <p className="text-slate-600 mb-3">{job.description?.substring(0, 100)}...</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><FiMapPin className="w-4 h-4" />{formatLocation(job.location)}</span>
                    <span className="flex items-center gap-1"><FiDollarSign className="w-4 h-4" />{formatSalary(job)}</span>
                    <span className="flex items-center gap-1"><FiCalendar className="w-4 h-4" />Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  {job.skills && job.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="badge bg-primary-50 text-primary-700">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {!hasApplied(job) && job.status === 'open' ? (
                    <button onClick={() => handleApply(job._id)} className="btn btn-primary w-full md:w-auto">
                      Apply Now
                    </button>
                  ) : hasApplied(job) ? (
                    <button disabled className="btn btn-outline w-full md:w-auto cursor-not-allowed opacity-50">
                      Already Applied
                    </button>
                  ) : (
                    <Link to={`/jobs/${job._id}`} className="btn btn-outline w-full md:w-auto">
                      <FiExternalLink /> View Details
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiBriefcase className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters or search term' 
                : 'Start browsing and applying for jobs'}
            </p>
            <Link to="/jobs" className="btn btn-primary">Browse All Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
