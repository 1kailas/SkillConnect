import { useState, useEffect } from 'react';
import { FiBriefcase, FiPlus, FiEdit2, FiTrash2, FiEye, FiUsers, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../../lib/axios';
import useAuthStore from '../../../store/authStore';

const Jobs = () => {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs');
      // Filter jobs by current employer
      const myJobs = data.data.filter(job => job.employer?._id === user?._id || job.employer === user?._id);
      setJobs(myJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = [
    { label: 'Total Jobs', value: jobs.length, color: 'text-primary-600', bgColor: 'bg-primary-50' },
    { label: 'Active', value: jobs.filter(j => j.status === 'active').length, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Total Applicants', value: jobs.reduce((sum, j) => sum + j.applicants, 0), color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  const statusConfig = {
    open: { label: 'Open', color: 'bg-emerald-100 text-emerald-700' },
    'in-progress': { label: 'In Progress', color: 'bg-primary-100 text-primary-700' },
    completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700' },
    cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700' },
    closed: { label: 'Closed', color: 'bg-slate-100 text-slate-700' },
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        setJobs(jobs.filter(job => job._id !== jobId));
        toast.success('Job deleted successfully!');
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job');
      }
    }
  };

  const formatSalary = (job) => {
    if (!job.salary) return 'Not specified';
    const { min, max, amount, type } = job.salary;
    const salaryType = type || 'monthly';
    
    if (min && max && min !== max) {
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}/${salaryType}`;
    }
    if (min || amount) {
      return `₹${(min || amount).toLocaleString()}/${salaryType}`;
    }
    return 'Not specified';
  };

  const formatLocation = (location) => {
    if (typeof location === 'string') return location;
    return location?.city || location?.address || 'Not specified';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Manage Jobs</h1>
          <p className="text-slate-600 mt-1">View and manage all your job postings</p>
        </div>
        <Link to="/employer/jobs/create" className="btn btn-primary w-full sm:w-auto">
          <FiPlus /> Post New Job
        </Link>
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
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'closed', 'draft'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FiBriefcase className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                    <span>{job.category}</span>
                    <span>•</span>
                    <span>{formatLocation(job.location)}</span>
                  </div>
                </div>
              </div>
              <span className={`badge ${statusConfig[job.status || 'open'].color}`}>
                {statusConfig[job.status || 'open']?.label || job.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="bg-primary-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-primary-600 mb-1">
                  <FiUsers className="w-4 h-4" />
                  <span className="font-medium">Applicants</span>
                </div>
                <div className="text-xl font-bold text-primary-900">{job.applicants?.length || 0}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <FiClock className="w-4 h-4" />
                  <span className="font-medium">Posted</span>
                </div>
                <div className="text-sm font-bold text-purple-900">{new Date(job.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600 mb-4">
              <p><span className="font-medium">Type:</span> {job.jobType}</p>
              <p><span className="font-medium">Salary:</span> {formatSalary(job)}</p>
            </div>

            <div className="flex gap-2">
              <Link to={`/dashboard/employer/jobs/${job._id}/applications`} className="btn btn-primary flex-1 text-sm">
                <FiUsers /> View Applicants
              </Link>
              <Link to={`/dashboard/employer/jobs/${job._id}/edit`} className="btn btn-outline text-sm">
                <FiEdit2 />
              </Link>
              <button onClick={() => handleDelete(job._id)} className="btn btn-outline text-rose-600 hover:text-rose-700 hover:border-rose-600 text-sm">
                <FiTrash2 />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredJobs.length === 0 && !loading && (
        <div className="card text-center py-12">
          <FiBriefcase className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs found</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your filters or search term' 
              : 'Get started by posting your first job'}
          </p>
          <Link to="/dashboard/employer/jobs/create" className="btn btn-primary">
            <FiPlus /> Post New Job
          </Link>
        </div>
      )}
    </div>
  );
};

export default Jobs;
