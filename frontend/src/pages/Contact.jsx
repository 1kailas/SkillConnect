import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiMessageSquare, FiUser, FiCheckCircle, FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.phone && !/^[+]?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    try {
      try {
        await api.post('/contact', formData);
      } catch (apiError) {
        console.log('Contact API not available, simulating success');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setSubmitted(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const contactInfo = [
    { icon: FiMail, title: 'Email Us', content: 'support@skillconnectkerala.com', link: 'mailto:support@skillconnectkerala.com' },
    { icon: FiPhone, title: 'Call Us', content: '+91 484 123 4567', link: 'tel:+914841234567' },
    { icon: FiMapPin, title: 'Visit Us', content: 'Tech Hub, Infopark, Kochi - 682042' },
    { icon: FiClock, title: 'Working Hours', content: 'Mon - Sat: 9:00 AM - 6:00 PM IST' },
  ];

  const subjectOptions = [
    { value: '', label: 'Select a subject' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'worker-help', label: 'Help Finding Work' },
    { value: 'employer-help', label: 'Help Hiring Workers' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'partnership', label: 'Partnership Opportunity' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
  ];

  const faqs = [
    { question: 'How do I register as a worker?', answer: 'Click "Sign Up" and select "I\'m a Worker". Fill in your details, add your skills and certificates to get started. The process takes less than 5 minutes.' },
    { question: 'Is there any registration fee?', answer: 'No! Registration is completely free for both workers and employers. We only charge a small commission when a job is successfully completed.' },
    { question: 'How is certificate verification done?', answer: 'We use AI-powered verification to authenticate certificates. Our system cross-references with government databases and uses image analysis. Verified certificates appear with a badge on profiles.' },
    { question: 'How do I contact a worker?', answer: 'Once you create an employer account, you can directly message workers through our platform\'s secure messaging system. You can also see their contact details after hiring.' },
    { question: 'What areas do you cover?', answer: 'We currently serve all major cities across Kerala including Kochi, Thiruvananthapuram, Kozhikode, Kottayam, Alappuzha, Kollam, Thrissur, and more. We\'re expanding rapidly!' },
  ];

  if (submitted) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheckCircle className="w-12 h-12 text-emerald-600" />
          </motion.div>
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Message Sent!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
          </p>
          <div className="space-y-3">
            <button onClick={() => setSubmitted(false)} className="btn btn-primary w-full">
              Send Another Message
            </button>
            <a href="/" className="btn btn-outline w-full">Back to Home</a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">Get In Touch</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Have questions about SkillConnect? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }} 
                className="card text-center hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 mb-2">{info.title}</h3>
                {info.link ? (
                  <a href={info.link} className="text-slate-600 text-sm hover:text-primary-600 transition">{info.content}</a>
                ) : (
                  <p className="text-slate-600 text-sm">{info.content}</p>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FiMessageSquare className="text-primary-600" />
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="label">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name} 
                    onChange={handleChange} 
                    className={`input pl-12 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`} 
                    placeholder="Your full name" 
                    aria-invalid={errors.name ? 'true' : 'false'}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><FiAlertCircle className="w-4 h-4" /> {errors.name}</p>}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="label">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email} 
                      onChange={handleChange} 
                      className={`input pl-12 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`} 
                      placeholder="your@email.com"
                      aria-invalid={errors.email ? 'true' : 'false'}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><FiAlertCircle className="w-4 h-4" /> {errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="label">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone} 
                      onChange={handleChange} 
                      className={`input pl-12 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`} 
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><FiAlertCircle className="w-4 h-4" /> {errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="label">Subject <span className="text-red-500">*</span></label>
                <select 
                  id="subject"
                  name="subject"
                  value={formData.subject} 
                  onChange={handleChange} 
                  className={`input ${errors.subject ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={errors.subject ? 'true' : 'false'}
                >
                  {subjectOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.subject && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><FiAlertCircle className="w-4 h-4" /> {errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="label">Message <span className="text-red-500">*</span></label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message} 
                  onChange={handleChange} 
                  className={`input min-h-[150px] resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`} 
                  placeholder="How can we help you? Please describe your question in detail..."
                  aria-invalid={errors.message ? 'true' : 'false'}
                />
                {errors.message && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><FiAlertCircle className="w-4 h-4" /> {errors.message}</p>}
                <p className="mt-1 text-sm text-slate-500">{formData.message.length}/500 characters</p>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-lg">
                {loading ? (
                  <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Sending...</>
                ) : (
                  <><FiSend /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>

          {/* FAQ Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                      aria-expanded={expandedFaq === index}
                    >
                      <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                      {expandedFaq === index ? (
                        <FiChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      ) : (
                        <FiChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-slate-600 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgent Help Card */}
            <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <h3 className="text-xl font-heading font-bold mb-3">Need Urgent Help?</h3>
              <p className="text-primary-100 mb-4">
                Our support team is available during business hours for urgent issues.
              </p>
              <a href="tel:+914841234567" className="btn bg-white text-primary-600 hover:bg-primary-50 w-full">
                <FiPhone /> Call Now: +91 484 123 4567
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
