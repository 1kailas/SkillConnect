import { useState } from 'react';
import { FiBell, FiBriefcase, FiCheck, FiMessageSquare, FiStar, FiUserCheck, FiAlertCircle, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'application', title: 'Application Accepted', message: 'Your application for "Electrician for Villa Project" has been accepted!', time: '5 min ago', read: false, icon: FiCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { id: 2, type: 'message', title: 'New Message', message: 'Tech Solutions sent you a message', time: '15 min ago', read: false, icon: FiMessageSquare, color: 'text-primary-600', bgColor: 'bg-primary-50' },
    { id: 3, type: 'job', title: 'New Job Match', message: 'New job posting matches your profile: "Plumber - Urgent"', time: '1 hour ago', read: false, icon: FiBriefcase, color: 'text-violet-600', bgColor: 'bg-violet-50' },
    { id: 4, type: 'review', title: 'New Review', message: 'You received a 5-star review from Ramesh Kumar', time: '3 hours ago', read: true, icon: FiStar, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { id: 5, type: 'verification', title: 'Certificate Verified', message: 'Your ITI Electrician Certificate has been verified', time: '5 hours ago', read: true, icon: FiUserCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { id: 6, type: 'application', title: 'Application Status', message: 'Your application for "Carpenter" position is under review', time: 'Yesterday', read: true, icon: FiBriefcase, color: 'text-primary-600', bgColor: 'bg-primary-50' },
    { id: 7, type: 'alert', title: 'Profile Incomplete', message: 'Complete your profile to get more job opportunities', time: '2 days ago', read: true, icon: FiAlertCircle, color: 'text-rose-600', bgColor: 'bg-rose-50' },
    { id: 8, type: 'message', title: 'New Message', message: 'ABC Constructions sent you a message', time: '3 days ago', read: true, icon: FiMessageSquare, color: 'text-primary-600', bgColor: 'bg-primary-50' },
  ]);

  const [filter, setFilter] = useState('all');

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifs => notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifs => notifs.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(notifs => notifs.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-outline w-full sm:w-auto">
            <FiCheck /> Mark All as Read
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-2">
          {['all', 'unread', 'application', 'message', 'job', 'review'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="card text-center py-12">
            <FiBell className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No notifications</h3>
            <p className="text-slate-600">You're all caught up! Check back later for new updates.</p>
          </div>
        ) : (
          filteredNotifications.map((notif, index) => {
            const Icon = notif.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`card ${
                  !notif.read ? 'border-l-4 border-primary-500 bg-primary-50/30' : ''
                } hover:shadow-md transition`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${notif.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${notif.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{notif.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            title="Mark as read"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-rose-600 hover:text-rose-700"
                          title="Delete"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-700 mb-2">{notif.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{notif.time}</span>
                      {(notif.type === 'application' || notif.type === 'job') && (
                        <Link to="/worker/jobs" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                          View Details →
                        </Link>
                      )}
                      {notif.type === 'message' && (
                        <Link to="/messages" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                          Reply →
                        </Link>
                      )}
                      {notif.type === 'review' && (
                        <Link to="/worker/reviews" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                          View Review →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
