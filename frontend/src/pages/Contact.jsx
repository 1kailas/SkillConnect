import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    { icon: FiMail, title: 'Email Us', content: 'support@skillconnectkerala.com', link: 'mailto:support@skillconnectkerala.com' },
    { icon: FiPhone, title: 'Call Us', content: '+91 9876543210', link: 'tel:+919876543210' },
    { icon: FiMapPin, title: 'Visit Us', content: 'Kottayam, Kerala, India', link: null },
  ];

  return (
    <div className="py-12">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">Get In Touch</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-heading font-bold text-slate-900 mb-2">{info.title}</h3>
                {info.link ? (
                  <a href={info.link} className="text-slate-600 hover:text-primary-600 transition">{info.content}</a>
                ) : (
                  <p className="text-slate-600">{info.content}</p>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card">
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input" placeholder="Your name" required />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email *</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input" placeholder="your@email.com" required />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input" placeholder="9876543210" />
                  </div>
                </div>
                <div>
                  <label className="label">Subject *</label>
                  <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="input" placeholder="How can we help?" required />
                </div>
                <div>
                  <label className="label">Message *</label>
                  <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="input min-h-[150px]" placeholder="Tell us more..." required></textarea>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary w-full">
                  {loading ? <div className="spinner border-white"></div> : <><FiSend /> Send Message</>}
                </button>
              </form>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card h-full">
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">How do I register as a worker?</h3>
                  <p className="text-slate-600">Click "Sign Up" and select "I'm a Worker". Fill in your details, add your skills and certificates to get started.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Is there any registration fee?</h3>
                  <p className="text-slate-600">No! Registration is completely free for both workers and employers.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">How is certificate verification done?</h3>
                  <p className="text-slate-600">We use AI-powered verification to authenticate certificates. Verified certificates appear with a badge on profiles.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">How do I contact a worker?</h3>
                  <p className="text-slate-600">Once you create an employer account, you can directly message workers through our platform's messaging system.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">What areas do you cover?</h3>
                  <p className="text-slate-600">We currently serve Tier 3 cities across Kerala including Kottayam, Alappuzha, Kollam, Pathanamthitta, and Idukki.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
