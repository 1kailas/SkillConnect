import { useState, useEffect } from 'react';
import { FiFileText, FiMapPin, FiDollarSign, FiClock, FiEye, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';

const Applications = () => {
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/jobs/applications/me');
      const apps = data.data || [];
      
      // Format applications for display
      const formattedApps = apps.map(app => ({
        id: app.job?._id || app._id,
        applicationId: app._id,
        jobTitle: app.job?.title || 'Job Title',
        company: app.job?.employer?.companyName || app.job?.employer?.name || 'Company',
        location: app.job?.location?.city || app.job?.location?.address || 'Kerala',
        salary: formatSalary(app.job?.salary),
        appliedDate: getTimeAgo(app.appliedAt),
        status: app.status || 'pending',
        views: app.job?.views || 0
      }));
      
      setApplications(formattedApps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Negotiable';
    if (salary.min && salary.max) {
      return `₹${salary.min.toLocaleString()} - ₹${salary.max.toLocaleString()}/${salary.type || 'month'}`;
    }
    if (salary.amount) {
      return `₹${salary.amount.toLocaleString()}/${salary.type || 'month'}`;
    }
    return 'Negotiable';
  };

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-slate-100 text-slate-700', icon: FiClock },
    under_review: { label: 'Under Review', color: 'bg-primary-100 text-primary-700', icon: FiEye },
    shortlisted: { label: 'Shortlisted', color: 'bg-emerald-100 text-emerald-700', icon: FiFileText },
    accepted: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700', icon: FiFileText },
    rejected: { label: 'Rejected', color: 'bg-rose-100 text-rose-700', icon: FiXCircle },
  };

  const filteredApplications = filter === 'all' ? applications : applications.filter(app => app.status === filter);

  const stats = [
    { label: 'Total Applied', value: applications.length, color: 'text-primary-600', bgColor: 'bg-primary-50' },
    { label: 'Under Review', value: applications.filter(a => a.status === 'under_review').length, color: 'text-violet-600', bgColor: 'bg-violet-50' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-1">My Applications</h1>
        <p className="text-slate-600">Track all your job applications</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-2`}>
              <FiFileText className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'under_review', 'shortlisted', 'accepted', 'rejected'].map((status) => (
            <button key={status} onClick={() => setFilter(status)} className={`btn btn-sm whitespace-nowrap ${filter === status ? 'btn-primary' : 'btn-outline'}`}>
              {status === 'all' ? 'All' : status === 'under_review' ? 'Under Review' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredApplications.map((app, index) => {
            const StatusIcon = statusConfig[app.status].icon;
            return (
              <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border border-slate-200 rounded-lg p-4 hover:border-primary-300 transition">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`badge ${statusConfig[app.status].color} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[app.status].label}
                      </span>
                      <span className="text-xs text-slate-500">Applied {app.appliedDate}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{app.jobTitle}</h3>
                    <p className="text-slate-600 mb-3">{app.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
                      <span className="flex items-center gap-1"><FiMapPin className="w-4 h-4" />{app.location}</span>
                      <span className="flex items-center gap-1"><FiDollarSign className="w-4 h-4" />{app.salary}</span>
                      <span className="flex items-center gap-1"><FiEye className="w-4 h-4" />{app.views} views</span>
                    </div>
                    {app.interview && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-2">
                        <p className="text-sm text-emerald-800"><span className="font-semibold">Interview Scheduled:</span> {app.interview}</p>
                      </div>
                    )}
                    {app.startDate && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-2">
                        <p className="text-sm text-emerald-800"><span className="font-semibold">Start Date:</span> {app.startDate}</p>
                      </div>
                    )}
                    {app.reason && (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                        <p className="text-sm text-rose-800"><span className="font-semibold">Reason:</span> {app.reason}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <Link to={`/jobs/${app.id}`} className="btn btn-outline flex-1 md:flex-none whitespace-nowrap">View Job</Link>
                    {app.status !== 'rejected' && (
                      <button className="btn btn-outline flex-1 md:flex-none text-rose-600 hover:text-rose-700 hover:border-rose-600">Withdraw</button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No applications found</h3>
            <p className="text-slate-600 mb-6">Start applying for jobs to track them here</p>
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
