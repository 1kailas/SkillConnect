import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiEye, FiPlus, FiCheckCircle, FiClock, FiStar, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useAuthStore from '../../../store/authStore';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';

const EmployerDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, hiredWorkers: 0, averageRating: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch employer's jobs
      const { data } = await api.get('/jobs', { params: { employer: 'me', limit: 5 } });
      const jobs = data.data || [];
      
      // Calculate stats
      const activeJobs = jobs.filter(j => j.status === 'open').length;
      const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicants?.length || 0), 0);
      const hiredWorkers = jobs.filter(j => j.hiredWorker).length;
      
      setStats({
        activeJobs,
        totalApplicants,
        hiredWorkers,
        averageRating: user?.rating?.average || 4.5
      });

      // Format recent jobs
      setRecentJobs(jobs.slice(0, 3).map(job => ({
        id: job._id,
        title: job.title,
        applicants: job.applicants?.length || 0,
        status: job.status === 'open' ? 'Active' : job.status.charAt(0).toUpperCase() + job.status.slice(1),
        postedDate: getTimeAgo(job.createdAt),
        views: job.views || 0
      })));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use fallback data if API fails
      setStats({ activeJobs: 0, totalApplicants: 0, hiredWorkers: 0, averageRating: 4.5 });
      setRecentJobs([]);
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
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const recentApplicants = [
    { id: 1, name: 'Rajesh Kumar', profession: 'Electrician', rating: 4.8, applied: '1 hour ago', status: 'New' },
    { id: 2, name: 'Amit Sharma', profession: 'Plumber', rating: 4.6, applied: '3 hours ago', status: 'Reviewed' },
    { id: 3, name: 'Suresh Nair', profession: 'Carpenter', rating: 4.9, applied: '5 hours ago', status: 'New' },
  ];

  const statCards = [
    { title: 'Active Job Posts', value: stats.activeJobs, icon: FiBriefcase, color: 'text-primary-600', bgColor: 'bg-primary-50', link: '/dashboard/employer/jobs' },
    { title: 'Total Applicants', value: stats.totalApplicants, icon: FiUsers, color: 'text-emerald-600', bgColor: 'bg-emerald-50', link: '/dashboard/employer/applications' },
    { title: 'Hired Workers', value: stats.hiredWorkers, icon: FiCheckCircle, color: 'text-rose-600', bgColor: 'bg-rose-50' },
    { title: 'Company Rating', value: stats.averageRating, icon: FiStar, color: 'text-amber-600', bgColor: 'bg-amber-50', link: '/dashboard/employer/reviews' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">Welcome, {user?.name}!</h1>
            <p className="text-rose-100">Manage your job postings and find the best workers</p>
          </div>
          <Link to="/dashboard/employer/create-job" className="btn bg-white text-rose-600 hover:bg-slate-100 w-full md:w-auto">
            <FiPlus /> Post New Job
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Link to={stat.link || '#'} className="card hover:shadow-lg transition-all block">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}><Icon className={`w-6 h-6 ${stat.color}`} /></div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.title}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold">Recent Job Posts</h2>
            <Link to="/dashboard/employer/jobs" className="text-primary-600 hover:text-rose-600 text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="p-4 border border-slate-200 rounded-lg hover:border-primary-300 transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.postedDate}</p>
                  </div>
                  <span className={`badge ${job.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{job.status}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1"><FiUsers className="w-4 h-4" />{job.applicants} applicants</span>
                  <span className="flex items-center gap-1"><FiEye className="w-4 h-4" />{job.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold">Recent Applicants</h2>
            <Link to="/dashboard/employer/applications" className="text-primary-600 hover:text-rose-600 text-sm font-medium">View All</Link>
          </div>
          <div className="space-y-4">
            {recentApplicants.map((applicant) => (
              <div key={applicant.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-primary-300 transition">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold">{applicant.name.charAt(0)}</div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{applicant.name}</h3>
                    <p className="text-sm text-slate-600">{applicant.profession}</p>
                    <div className="flex items-center gap-1 text-sm text-amber-600 mt-1">
                      <FiStar className="w-4 h-4 fill-current" />{applicant.rating}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${applicant.status === 'New' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-700'}`}>{applicant.status}</span>
                  <p className="text-xs text-slate-500 mt-1">{applicant.applied}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-heading font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Link to="/dashboard/employer/create-job" className="p-4 border-2 border-slate-200 rounded-lg hover:border-primary-300 hover:bg-rose-50 transition text-center">
            <FiPlus className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-primary-600" />
            <span className="text-xs md:text-sm font-medium">Post Job</span>
          </Link>
          <Link to="/workers" className="p-4 border-2 border-slate-200 rounded-lg hover:border-primary-300 hover:bg-rose-50 transition text-center">
            <FiUsers className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-primary-600" />
            <span className="text-xs md:text-sm font-medium">Find Workers</span>
          </Link>
          <Link to="/dashboard/employer/applications" className="p-4 border-2 border-slate-200 rounded-lg hover:border-primary-300 hover:bg-rose-50 transition text-center">
            <FiClock className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-primary-600" />
            <span className="text-xs md:text-sm font-medium">Applications</span>
          </Link>
          <Link to="/dashboard/messages" className="p-4 border-2 border-slate-200 rounded-lg hover:border-primary-300 hover:bg-rose-50 transition text-center">
            <FiTrendingUp className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-primary-600" />
            <span className="text-xs md:text-sm font-medium">Messages</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
