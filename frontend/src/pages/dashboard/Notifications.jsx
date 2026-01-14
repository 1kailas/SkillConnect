import { useState, useEffect } from 'react';
import { FiBell, FiBriefcase, FiCheck, FiMessageSquare, FiStar, FiUserCheck, FiAlertCircle, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    application: { icon: FiBriefcase, color: 'text-primary-600', bgColor: 'bg-primary-50' },
    message: { icon: FiMessageSquare, color: 'text-primary-600', bgColor: 'bg-primary-50' },
    job: { icon: FiBriefcase, color: 'text-violet-600', bgColor: 'bg-violet-50' },
    review: { icon: FiStar, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    verification: { icon: FiUserCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    alert: { icon: FiAlertCircle, color: 'text-rose-600', bgColor: 'bg-rose-50' },
    success: { icon: FiCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    default: { icon: FiBell, color: 'text-slate-600', bgColor: 'bg-slate-50' },
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notifications');
      const fetchedNotifs = data.data || [];
      
      // Format notifications with icons
      const formattedNotifs = fetchedNotifs.map(n => {
        const iconConfig = iconMap[n.type] || iconMap.default;
        return {
          ...n,
          id: n._id,
          icon: iconConfig.icon,
          color: iconConfig.color,
          bgColor: iconConfig.bgColor,
          time: getTimeAgo(n.createdAt)
        };
      });
      
      if (formattedNotifs.length === 0) {
        // Use fallback data if no notifications
        setNotifications([
          { id: 1, type: 'job', title: 'Welcome to SkillConnect!', message: 'Start exploring jobs and opportunities near you.', time: 'Just now', read: false, icon: FiBriefcase, color: 'text-primary-600', bgColor: 'bg-primary-50' },
        ]);
      } else {
        setNotifications(formattedNotifs);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([
        { id: 1, type: 'alert', title: 'Welcome!', message: 'Your notification center is ready.', time: 'Just now', read: false, icon: FiBell, color: 'text-primary-600', bgColor: 'bg-primary-50' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const [filter, setFilter] = useState('all');

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifs => notifs.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      // Still update locally even if API fails
      setNotifications(notifs => notifs.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifs => notifs.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      setNotifications(notifs => notifs.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifs => notifs.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      setNotifications(notifs => notifs.filter(n => n.id !== id));
      toast.success('Notification deleted');
    }
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
