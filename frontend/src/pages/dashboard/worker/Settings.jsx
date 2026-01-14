import { useState } from 'react';
import { FiUser, FiLock, FiBell, FiShield, FiTrash2, FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    emailJobAlerts: true,
    emailMessages: true,
    emailApplications: true,
    pushJobAlerts: false,
    pushMessages: true,
    smsImportant: true,
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: FiUser },
    { id: 'password', label: 'Password', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'privacy', label: 'Privacy & Security', icon: FiShield },
  ];

  const handleSaveAccount = (e) => {
    e.preventDefault();
    toast.success('Account settings updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    toast.success('Password changed successfully!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion requested. You will receive a confirmation email.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account preferences and security</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="card md:col-span-1 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="md:col-span-3">
          {activeTab === 'account' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Account Information</h2>
              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input" defaultValue="rajesh.electrician@gmail.com" required />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input type="tel" className="input" defaultValue="+91 98765 43210" required />
                </div>
                <div>
                  <label className="label">Language</label>
                  <select className="input">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Malayalam</option>
                    <option>Tamil</option>
                  </select>
                </div>
                <div>
                  <label className="label">Time Zone</label>
                  <select className="input">
                    <option>IST (UTC +5:30)</option>
                    <option>GMT (UTC +0:00)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="available" className="w-4 h-4 text-primary-600" defaultChecked />
                  <label htmlFor="available" className="text-sm text-slate-700">I am currently available for work</label>
                </div>
                <button type="submit" className="btn btn-primary">
                  <FiSave /> Save Changes
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'password' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="label">Current Password</label>
                  <input type="password" className="input" required />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" required />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input type="password" className="input" required />
                </div>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h3 className="font-medium text-primary-900 mb-2">Password Requirements:</h3>
                  <ul className="text-sm text-primary-800 space-y-1 list-disc list-inside">
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Contains at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>
                <button type="submit" className="btn btn-primary">
                  <FiLock /> Change Password
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Notification Preferences</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'emailJobAlerts', label: 'Job alerts and recommendations' },
                      { key: 'emailMessages', label: 'New messages from employers' },
                      { key: 'emailApplications', label: 'Application status updates' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <label className="text-sm text-slate-700">{item.label}</label>
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="w-4 h-4 text-primary-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">Push Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'pushJobAlerts', label: 'Job alerts' },
                      { key: 'pushMessages', label: 'Messages' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <label className="text-sm text-slate-700">{item.label}</label>
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="w-4 h-4 text-primary-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-3">SMS Notifications</h3>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-700">Important updates only</label>
                    <input
                      type="checkbox"
                      checked={notifications.smsImportant}
                      onChange={(e) => setNotifications({ ...notifications, smsImportant: e.target.checked })}
                      className="w-4 h-4 text-primary-600"
                    />
                  </div>
                </div>
                <button onClick={handleSaveNotifications} className="btn btn-primary">
                  <FiSave /> Save Preferences
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Profile Visibility</h3>
                      <p className="text-sm text-slate-600">Make your profile visible to employers</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Show Phone Number</h3>
                      <p className="text-sm text-slate-600">Display phone number on public profile</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">Show Location</h3>
                      <p className="text-sm text-slate-600">Share your city with employers</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-primary-600" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="card border-2 border-rose-200 bg-rose-50">
                <h2 className="text-xl font-semibold text-rose-900 mb-4">Danger Zone</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-rose-900">Delete Account</h3>
                    <p className="text-sm text-rose-700 mb-3">Once you delete your account, there is no going back. Please be certain.</p>
                    <button onClick={handleDeleteAccount} className="btn bg-rose-600 hover:bg-rose-700 text-white">
                      <FiTrash2 /> Delete My Account
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
