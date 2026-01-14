import { useState } from 'react';
import { FiSearch, FiCheckCircle, FiXCircle, FiAward, FiCalendar, FiUser, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CertificateVerification = () => {
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock verification data
  const mockCertificate = {
    valid: true,
    id: 'CERT-2024-001234',
    name: 'ITI Electrician Certificate',
    holderName: 'Rajesh Kumar',
    issuer: 'Government ITI Kerala',
    issueDate: 'January 15, 2020',
    expiryDate: 'Lifetime',
    verifiedDate: 'March 10, 2024',
    skills: ['Electrical Wiring', 'Panel Installation', 'Safety Standards'],
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (certificateId.toLowerCase().includes('cert')) {
        setVerificationResult(mockCertificate);
      } else {
        setVerificationResult({ valid: false });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiAward className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4">Certificate Verification</h1>
          <p className="text-lg text-slate-600">Verify the authenticity of worker certificates instantly</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="label">Certificate ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="input pl-12"
                  placeholder="Enter certificate ID (e.g., CERT-2024-001234)"
                  required
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <FiSearch /> Verify Certificate
                </>
              )}
            </button>
          </form>

          {verificationResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              {verificationResult.valid ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <FiCheckCircle className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-900">Certificate Verified</h3>
                      <p className="text-sm text-emerald-700">This certificate is valid and authentic</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <FiFileText className="w-4 h-4" />
                        <span className="text-sm">Certificate Name</span>
                      </div>
                      <p className="font-semibold text-slate-900">{verificationResult.name}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <FiUser className="w-4 h-4" />
                        <span className="text-sm">Certificate Holder</span>
                      </div>
                      <p className="font-semibold text-slate-900">{verificationResult.holderName}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <FiAward className="w-4 h-4" />
                        <span className="text-sm">Issuing Authority</span>
                      </div>
                      <p className="font-semibold text-slate-900">{verificationResult.issuer}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <FiCalendar className="w-4 h-4" />
                        <span className="text-sm">Issue Date</span>
                      </div>
                      <p className="font-semibold text-slate-900">{verificationResult.issueDate}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <FiCalendar className="w-4 h-4" />
                        <span className="text-sm">Valid Until</span>
                      </div>
                      <p className="font-semibold text-slate-900">{verificationResult.expiryDate}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <FiCheckCircle className="w-4 h-4" />
                        <span className="text-sm">Verified On</span>
                      </div>
                      <p className="font-semibold text-slate-900">{verificationResult.verifiedDate}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Skills & Qualifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {verificationResult.skills.map((skill, index) => (
                        <span key={index} className="badge bg-primary-100 text-primary-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <p className="text-sm text-primary-900">
                      <strong>Certificate ID:</strong> {verificationResult.id}
                    </p>
                    <p className="text-xs text-primary-700 mt-2">
                      This certificate has been verified by SkillConnect's verification system on {verificationResult.verifiedDate}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                  <FiXCircle className="w-8 h-8 text-rose-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-rose-900">Certificate Not Found</h3>
                    <p className="text-sm text-rose-700">
                      The certificate ID you entered could not be verified. Please check the ID and try again.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 card">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">How to Verify</h3>
          <ol className="space-y-3 list-decimal list-inside text-slate-700">
            <li>Obtain the certificate ID from the worker or certificate document</li>
            <li>Enter the complete certificate ID in the search box above</li>
            <li>Click "Verify Certificate" to check authenticity</li>
            <li>Review the verification results and certificate details</li>
          </ol>
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> Only certificates issued and verified through SkillConnect can be verified using this system.
              For other certificates, please contact the issuing authority directly.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificateVerification;
