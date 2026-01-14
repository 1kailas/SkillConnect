import { useState } from 'react';
import { FiUsers, FiStar, FiMapPin, FiPhone, FiMail, FiCheck, FiX, FiEye, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Applications = () => {
  const [applications, setApplications] = useState([
    { id: 1, worker: 'Rajesh Kumar', profession: 'Electrician', location: 'Bangalore', experience: '5 years', rating: 4.8, totalReviews: 32, job: 'Electrician for Villa Project', applied: '2 days ago', phone: '+91 98765 43210', email: 'rajesh@gmail.com', status: 'pending', avatar: 'R' },
    { id: 2, worker: 'Amit Sharma', profession: 'Electrician', location: 'Bangalore', experience: '3 years', rating: 4.5, totalReviews: 18, job: 'Electrician for Villa Project', applied: '3 days ago', phone: '+91 98765 43211', email: 'amit@gmail.com', status: 'pending', avatar: 'A' },
    { id: 3, worker: 'Suresh Patel', profession: 'Plumber', location: 'Bangalore', experience: '7 years', rating: 4.9, totalReviews: 45, job: 'Plumber - Urgent Requirement', applied: '1 day ago', phone: '+91 98765 43212', email: 'suresh@gmail.com', status: 'shortlisted', avatar: 'S' },
    { id: 4, worker: 'Pradeep Singh', profession: 'Carpenter', location: 'Bangalore', experience: '4 years', rating: 4.6, totalReviews: 28, job: 'Carpenter for Office Renovation', applied: '5 days ago', phone: '+91 98765 43213', email: 'pradeep@gmail.com', status: 'pending', avatar: 'P' },
    { id: 5, worker: 'Vijay Kumar', profession: 'Painter', location: 'Bangalore', experience: '6 years', rating: 4.7, totalReviews: 35, job: 'Painter for Apartment Complex', applied: '4 days ago', phone: '+91 98765 43214', email: 'vijay@gmail.com', status: 'accepted', avatar: 'V' },
    { id: 6, worker: 'Ravi Mehta', profession: 'Electrician', location: 'Bangalore', experience: '2 years', rating: 4.2, totalReviews: 12, job: 'Electrician for Villa Project', applied: '6 days ago', phone: '+91 98765 43215', email: 'ravi@gmail.com', status: 'rejected', avatar: 'R' },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
    shortlisted: { label: 'Shortlisted', color: 'bg-primary-100 text-primary-700' },
    accepted: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'Rejected', color: 'bg-rose-100 text-rose-700' },
  };

  const handleAccept = (appId) => {
    setApplications(apps => apps.map(app => app.id === appId ? { ...app, status: 'accepted' } : app));
    toast.success('Application accepted! Worker will be notified.');
  };

  const handleReject = (appId) => {
    setApplications(apps => apps.map(app => app.id === appId ? { ...app, status: 'rejected' } : app));
    toast.error('Application rejected.');
  };

  const handleShortlist = (appId) => {
    setApplications(apps => apps.map(app => app.id === appId ? { ...app, status: 'shortlisted' } : app));
    toast.success('Worker shortlisted for further review.');
  };

  const stats = [
    { label: 'Total Applications', value: applications.length, color: 'text-primary-600', bgColor: 'bg-primary-50' },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'pending').length, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, color: 'text-primary-600', bgColor: 'bg-primary-50' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Job Applications</h1>
        <p className="text-slate-600 mt-1">Review and manage worker applications</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card">
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
              <FiUsers className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'shortlisted', 'accepted', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
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

      <div className="space-y-4">
        {filteredApplications.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {app.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">{app.worker}</h3>
                      <p className="text-slate-600">{app.profession} • {app.experience} experience</p>
                    </div>
                    <span className={`badge ${statusConfig[app.status].color} self-start`}>
                      {statusConfig[app.status].label}
                    </span>
                  </div>

                  <div className="bg-primary-50 border-l-4 border-primary-500 p-3 rounded mb-4">
                    <p className="text-sm font-medium text-primary-900">Applied for: {app.job}</p>
                    <p className="text-xs text-primary-700 mt-1">Submitted {app.applied}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <FiMapPin className="w-4 h-4 text-slate-500" />
                      <span>{app.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <FiStar className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">{app.rating}</span>
                      <span className="text-slate-500">({app.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <FiPhone className="w-4 h-4 text-slate-500" />
                      <span>{app.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <FiMail className="w-4 h-4 text-slate-500" />
                      <span>{app.email}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link to={`/worker/${app.id}`} className="btn btn-outline text-sm">
                      <FiEye /> View Profile
                    </Link>
                    {app.status === 'pending' && (
                      <>
                        <button onClick={() => handleShortlist(app.id)} className="btn btn-outline text-sm">
                          <FiCalendar /> Shortlist
                        </button>
                        <button onClick={() => handleAccept(app.id)} className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                          <FiCheck /> Accept
                        </button>
                        <button onClick={() => handleReject(app.id)} className="btn bg-rose-600 hover:bg-rose-700 text-white text-sm">
                          <FiX /> Reject
                        </button>
                      </>
                    )}
                    {app.status === 'shortlisted' && (
                      <>
                        <button onClick={() => handleAccept(app.id)} className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                          <FiCheck /> Accept
                        </button>
                        <button onClick={() => handleReject(app.id)} className="btn bg-rose-600 hover:bg-rose-700 text-white text-sm">
                          <FiX /> Reject
                        </button>
                      </>
                    )}
                    {app.status === 'accepted' && (
                      <button className="btn bg-emerald-600 text-white text-sm cursor-not-allowed" disabled>
                        <FiCheck /> Hired
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="card text-center py-12">
          <FiUsers className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No applications found</h3>
          <p className="text-slate-600">Try selecting a different filter</p>
        </div>
      )}
    </div>
  );
};

export default Applications;
