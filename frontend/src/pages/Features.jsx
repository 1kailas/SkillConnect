import { FiAward, FiShield, FiMapPin, FiStar, FiZap, FiUsers, FiMessageSquare, FiCheckCircle, FiTrendingUp, FiDollarSign, FiClock, FiBell, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    { icon: FiAward, title: 'Certificate Verification', description: 'AI-powered verification system ensures all worker certificates are authentic and valid', color: 'text-primary-600', bgColor: 'bg-primary-50' },
    { icon: FiMapPin, title: 'GPS-Based Matching', description: 'Find workers near you with our intelligent location-based search and matching system', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { icon: FiStar, title: 'Transparent Reviews', description: 'Honest review and rating system helps you make informed decisions', color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { icon: FiShield, title: 'Secure Platform', description: 'Industry-standard security measures protect your data and transactions', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { icon: FiZap, title: 'Instant Notifications', description: 'Get real-time updates on applications, messages, and job opportunities', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { icon: FiUsers, title: 'Direct Communication', description: 'No middlemen - communicate directly with workers or employers', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { icon: FiMessageSquare, title: 'Built-in Messaging', description: 'Secure in-platform messaging system for easy communication', color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { icon: FiCheckCircle, title: 'Verified Profiles', description: 'All workers go through a verification process for authenticity', color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { icon: FiTrendingUp, title: 'Career Growth', description: 'Build your reputation with reviews and grow your career', color: 'text-rose-600', bgColor: 'bg-rose-50' },
    { icon: FiDollarSign, title: 'Fair Pricing', description: 'Workers set their own rates, employers see transparent pricing', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { icon: FiClock, title: 'Flexible Scheduling', description: 'Choose when you work - full-time, part-time, or project-based', color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
    { icon: FiBell, title: 'Smart Alerts', description: 'Customizable notifications keep you updated on what matters', color: 'text-violet-600', bgColor: 'bg-violet-50' },
  ];

  const workerBenefits = [
    { title: 'Get Discovered', description: 'Your profile is visible to hundreds of employers', icon: FiUsers },
    { title: 'Set Your Rates', description: 'You decide how much you charge', icon: FiDollarSign },
    { title: 'Build Reputation', description: 'Reviews help you stand out', icon: FiStar },
    { title: 'No Commission', description: 'Keep 100% of your earnings', icon: FiCheckCircle },
  ];

  const employerBenefits = [
    { title: 'Find Talent Fast', description: 'Access verified skilled workers', icon: FiZap },
    { title: 'See Credentials', description: 'View certificates and reviews', icon: FiAward },
    { title: 'Easy Hiring', description: 'Post jobs and review applications', icon: FiBriefcase },
    { title: 'Save Time', description: 'No need for recruitment agencies', icon: FiClock },
  ];

  return (
    <div className="py-12">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">Platform Features</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">Everything you need to find work or hire skilled workers - all in one powerful platform</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="card hover:shadow-xl transition-all">
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-6">
                <FiUsers className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">For Workers</h2>
              <p className="text-slate-600 mb-8">Build your career with tools designed specifically for skilled workers in Kerala</p>
              <div className="space-y-4 mb-8">
                {workerBenefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">{benefit.title}</h4>
                        <p className="text-sm text-slate-600">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link to="/auth/signup?role=worker" className="btn btn-primary w-full">Join as Worker</Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-8">
              <div className="w-16 h-16 bg-primary-700 rounded-full flex items-center justify-center mb-6">
                <FiBriefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">For Employers</h2>
              <p className="text-slate-600 mb-8">Find and hire skilled workers quickly and efficiently</p>
              <div className="space-y-4 mb-8">
                {employerBenefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">{benefit.title}</h4>
                        <p className="text-sm text-slate-600">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link to="/auth/signup?role=employer" className="btn bg-primary-700 hover:bg-secondary-700 text-white w-full">Join as Employer</Link>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">Join thousands of workers and employers using SkillConnect Kerala</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup" className="btn bg-white text-primary-700 hover:bg-slate-100">Create Free Account</Link>
            <Link to="/contact" className="btn bg-white/10 hover:bg-white/20 text-white border-2 border-white">Contact Us</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
