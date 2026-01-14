import { useState } from 'react';
import { FiAward, FiUpload, FiCheckCircle, FiClock, FiXCircle, FiEye, FiTrash2, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Certificates = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [certificates, setCertificates] = useState([
    { id: 1, name: 'ITI Electrician Certificate', issuer: 'Govt. ITI Kerala', issueDate: 'Jan 2020', expiryDate: 'Lifetime', status: 'verified', verifiedDate: 'Mar 2024', document: 'iti_cert.pdf' },
    { id: 2, name: 'Electrical Safety Training', issuer: 'KSEB Training Center', issueDate: 'Jun 2023', expiryDate: 'Jun 2026', status: 'verified', verifiedDate: 'Jul 2023', document: 'safety_cert.pdf' },
    { id: 3, name: 'Advanced Wiring Course', issuer: 'Technical Institute', issueDate: 'Nov 2023', expiryDate: 'Lifetime', status: 'pending', document: 'wiring_cert.pdf' },
    { id: 4, name: 'First Aid Certificate', issuer: 'Red Cross Kerala', issueDate: 'Mar 2023', expiryDate: 'Mar 2025', status: 'rejected', reason: 'Document unclear', document: 'firstaid_cert.pdf' },
  ]);

  const statusConfig = {
    verified: { label: 'Verified', color: 'bg-emerald-100 text-emerald-700', icon: FiCheckCircle },
    pending: { label: 'Pending Verification', color: 'bg-amber-100 text-amber-700', icon: FiClock },
    rejected: { label: 'Rejected', color: 'bg-rose-100 text-rose-700', icon: FiXCircle },
  };

  const handleUpload = (e) => {
    e.preventDefault();
    toast.success('Certificate uploaded successfully! Verification in progress.');
    setShowUploadModal(false);
  };

  const stats = [
    { label: 'Total Certificates', value: certificates.length, color: 'text-primary-600', bgColor: 'bg-primary-50' },
    { label: 'Verified', value: certificates.filter(c => c.status === 'verified').length, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Pending', value: certificates.filter(c => c.status === 'pending').length, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Certificates</h1>
          <p className="text-slate-600 mt-1">Manage and verify your professional certificates</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary w-full sm:w-auto">
          <FiPlus /> Upload Certificate
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card">
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
              <FiAward className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {certificates.map((cert, index) => {
          const StatusIcon = statusConfig[cert.status].icon;
          return (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FiAward className="w-8 h-8 text-primary-600" />
                </div>
                <span className={`badge ${statusConfig[cert.status].color} flex items-center gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig[cert.status].label}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{cert.name}</h3>
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <p><span className="font-medium">Issuer:</span> {cert.issuer}</p>
                <p><span className="font-medium">Issue Date:</span> {cert.issueDate}</p>
                <p><span className="font-medium">Valid Until:</span> {cert.expiryDate}</p>
                {cert.status === 'verified' && <p className="text-emerald-600"><span className="font-medium">Verified:</span> {cert.verifiedDate}</p>}
                {cert.status === 'rejected' && cert.reason && (
                  <div className="bg-rose-50 border border-rose-200 rounded p-2 text-rose-700">
                    <span className="font-medium">Reason:</span> {cert.reason}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline flex-1 text-sm"><FiEye /> View</button>
                {cert.status === 'rejected' && (
                  <button className="btn btn-primary flex-1 text-sm"><FiUpload /> Re-upload</button>
                )}
                <button className="btn btn-outline text-rose-600 hover:text-rose-700 hover:border-rose-600 text-sm"><FiTrash2 /></button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">Upload Certificate</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="label">Certificate Name *</label>
                <input type="text" className="input" placeholder="e.g., ITI Certificate" required />
              </div>
              <div>
                <label className="label">Issuing Organization *</label>
                <input type="text" className="input" placeholder="e.g., Govt. ITI Kerala" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Issue Date</label>
                  <input type="date" className="input" />
                </div>
                <div>
                  <label className="label">Expiry Date</label>
                  <input type="date" className="input" placeholder="Leave empty if lifetime" />
                </div>
              </div>
              <div>
                <label className="label">Upload Document *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary-400 transition cursor-pointer">
                  <FiUpload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" required />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Upload</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
