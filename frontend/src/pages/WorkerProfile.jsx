import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiStar, FiMapPin, FiBriefcase, FiAward, FiPhone, FiMail, FiCalendar, FiArrowLeft, FiClock, FiCheckCircle, FiShare2, FiHeart, FiMessageSquare, FiExternalLink, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../store/authStore';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [hireDetails, setHireDetails] = useState({
    jobTitle: '',
    description: '',
    startDate: '',
    duration: '',
    budget: ''
  });

  useEffect(() => {
    fetchWorkerProfile();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'reviews' && worker) {
      fetchReviews();
    }
  }, [activeTab, worker]);

  const fetchWorkerProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/workers/${id}`);
      setWorker(data.data);
    } catch (error) {
      console.error('Error fetching worker profile:', error);
      if (error.response?.status === 404) {
        toast.error('Worker not found');
      } else {
        toast.error('Failed to load worker profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const { data } = await api.get(`/reviews/${id}`);
      setReviews(data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleContact = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to contact this worker');
      navigate('/auth/login', { state: { from: `/workers/${id}` } });
      return;
    }

    try {
      setSendingMessage(true);
      const { data } = await api.post('/chat', {
        participantId: worker.userId || worker._id,
        initialMessage: contactMessage
      });
      
      toast.success('Message sent successfully!');
      setShowContactModal(false);
      setContactMessage('');
      navigate(`/dashboard/${user.role}/messages`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleHire = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to hire this worker');
      navigate('/auth/login', { state: { from: `/workers/${id}` } });
      return;
    }

    if (user.role !== 'employer') {
      toast.error('Only employers can hire workers');
      return;
    }

    try {
      await api.post('/jobs', {
        title: hireDetails.jobTitle,
        description: hireDetails.description,
        startDate: hireDetails.startDate,
        duration: hireDetails.duration,
        budget: hireDetails.budget,
        assignedWorker: worker._id,
        status: 'assigned'
      });
      
      toast.success('Hire request sent successfully!');
      setShowHireModal(false);
      setHireDetails({ jobTitle: '', description: '', startDate: '', duration: '', budget: '' });
    } catch (error) {
      console.error('Error sending hire request:', error);
      toast.error('Failed to send hire request. Please try again.');
    }
  };

  const handleSaveWorker = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save workers');
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved workers' : 'Worker saved to your list');
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${worker.name} - ${worker.profession}`,
          text: `Check out ${worker.name}'s profile on SkillConnect Kerala`,
          url: url
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          navigator.clipboard.writeText(url);
          toast.success('Profile link copied!');
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Profile link copied!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading profile..." />;
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBriefcase className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Worker Not Found</h2>
          <p className="text-slate-600 mb-6">The worker profile you're looking for doesn't exist or has been removed.</p>
          <Link to="/workers" className="btn btn-primary">
            <FiArrowLeft /> Browse Workers
          </Link>
        </motion.div>
      </div>
    );
  }

  const ratingValue = worker.rating?.average || worker.rating || 0;
  const reviewCount = worker.rating?.count || worker.totalReviews || 0;

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'reviews', label: `Reviews (${reviewCount})` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link to="/workers" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium">
          <FiArrowLeft /> Back to Workers
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-5xl shadow-lg">
                {worker.name?.charAt(0).toUpperCase() || 'W'}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-heading font-bold text-slate-900">{worker.name}</h1>
                    {worker.isVerified && (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <FiCheckCircle /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xl text-primary-600 font-semibold mb-3">{worker.profession}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-primary-500" />
                      <span>{worker.location?.city || 'Location not specified'}, {worker.location?.state || 'Kerala'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiBriefcase className="text-primary-500" />
                      <span>{worker.experience || 0} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiStar className="text-amber-500 fill-amber-500" />
                      <span className="font-semibold">{Number(ratingValue).toFixed(1)}</span>
                      <span className="text-slate-500">({reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-primary-500" />
                      <span className={worker.availability?.status === 'available' || worker.isActive ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                        {worker.availability?.status === 'available' || worker.isActive ? 'Available Now' : 'Currently Busy'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">₹{worker.hourlyRate || 500}/hr</div>
                  <div className="text-sm text-slate-500">Hourly Rate</div>
                  <div className="text-sm text-emerald-600 font-medium mt-1">
                    {worker.completedJobs || 0} jobs completed
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="btn btn-primary"
                >
                  <FiMessageSquare /> Send Message
                </button>
                <button 
                  onClick={() => setShowHireModal(true)}
                  className="btn btn-secondary"
                >
                  <FiBriefcase /> Hire Now
                </button>
                <button 
                  onClick={handleSaveWorker}
                  className={`btn ${isSaved ? 'btn-primary' : 'btn-ghost'}`}
                >
                  <FiHeart className={isSaved ? 'fill-current' : ''} />
                </button>
                <button 
                  onClick={handleShare}
                  className="btn btn-ghost"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="card mb-6 overflow-hidden">
          <div className="flex gap-1 border-b border-slate-200 overflow-x-auto pb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 font-medium whitespace-nowrap transition-all relative ${
                  activeTab === tab.id
                    ? 'text-primary-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="card"
                >
                  <h2 className="text-xl font-bold text-slate-900 mb-4">About {worker.name}</h2>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    {worker.bio || `${worker.name} is a professional ${worker.profession} with ${worker.experience || 0} years of experience. Contact them to discuss your project requirements.`}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Experience Highlights</h3>
                      <ul className="space-y-2 text-slate-700">
                        <li className="flex items-start gap-2">
                          <FiCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                          <span>{worker.experience || 0} years of professional experience</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FiCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                          <span>Completed {worker.completedJobs || 0} successful projects</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FiCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                          <span>Average rating: {Number(ratingValue).toFixed(1)} stars</span>
                        </li>
                        {worker.isVerified && (
                          <li className="flex items-start gap-2">
                            <FiCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                            <span>Verified professional credentials</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    {worker.languages && worker.languages.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {worker.languages.map((lang, index) => (
                            <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="card"
                >
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Skills & Expertise</h2>
                  {worker.skills && worker.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {worker.skills.map((skill, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-4 py-2 bg-primary-50 text-primary-700 rounded-xl font-medium hover:bg-primary-100 transition-colors"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <FiBriefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No skills listed yet.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'certificates' && (
                <motion.div
                  key="certificates"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="card"
                >
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Certificates & Credentials</h2>
                  {worker.certificates && worker.certificates.length > 0 ? (
                    <div className="space-y-4">
                      {worker.certificates.map((cert, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
                        >
                          <div className={`p-3 rounded-lg ${cert.isVerified ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                            <FiAward className={`w-6 h-6 ${cert.isVerified ? 'text-emerald-600' : 'text-slate-500'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-slate-900">{cert.title || cert.name}</h4>
                                <p className="text-sm text-slate-600">{cert.issuer || cert.issuedBy}</p>
                              </div>
                              {cert.isVerified && (
                                <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                  <FiCheckCircle className="w-3 h-3" /> Verified
                                </span>
                              )}
                            </div>
                            <div className="flex gap-4 mt-2 text-sm text-slate-500">
                              <span>Issued: {formatDate(cert.issueDate || cert.issuedAt)}</span>
                              {cert.expiryDate && <span>Expires: {formatDate(cert.expiryDate)}</span>}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <FiAward className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No certificates uploaded yet.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'portfolio' && (
                <motion.div
                  key="portfolio"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="card"
                >
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Portfolio</h2>
                  {worker.portfolio && worker.portfolio.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {worker.portfolio.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative rounded-xl overflow-hidden bg-slate-100 aspect-video cursor-pointer"
                        >
                          {item.imageUrl || item.image ? (
                            <img 
                              src={item.imageUrl || item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                              <FiBriefcase className="w-12 h-12 text-primary-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <h4 className="font-semibold">{item.title}</h4>
                              {item.description && (
                                <p className="text-sm text-white/80 line-clamp-2">{item.description}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <FiExternalLink className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No portfolio items yet.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Rating Summary */}
                  <div className="card">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-slate-900">{Number(ratingValue).toFixed(1)}</div>
                        <div className="flex justify-center gap-1 my-2">
                          {[1,2,3,4,5].map(star => (
                            <FiStar 
                              key={star}
                              className={`w-5 h-5 ${star <= ratingValue ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-slate-500">{reviewCount} reviews</p>
                      </div>
                      <div className="flex-1 w-full">
                        {[5,4,3,2,1].map(rating => {
                          const count = reviews.filter(r => Math.round(r.rating) === rating).length;
                          const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center gap-2 mb-1">
                              <span className="text-sm w-3">{rating}</span>
                              <FiStar className="w-4 h-4 text-amber-500" />
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-amber-500 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-slate-500 w-8">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {reviewsLoading ? (
                    <div className="card py-8">
                      <LoadingSpinner text="Loading reviews..." />
                    </div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <motion.div
                        key={review._id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="card"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {review.reviewer?.name?.charAt(0) || review.employerName?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-slate-900">{review.reviewer?.name || review.employerName || 'Anonymous'}</h4>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[1,2,3,4,5].map(star => (
                                      <FiStar 
                                        key={star}
                                        className={`w-4 h-4 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-slate-500">{formatDate(review.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-700">{review.comment || review.review}</p>
                            {review.jobTitle && (
                              <p className="text-sm text-slate-500 mt-2">Job: {review.jobTitle}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="card text-center py-8 text-slate-500">
                      <FiStar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No reviews yet.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {worker.phone && (
                  <a href={`tel:${worker.phone}`} className="flex items-center gap-3 text-slate-700 hover:text-primary-600 transition-colors">
                    <FiPhone className="text-primary-500 flex-shrink-0" />
                    <span>{worker.phone}</span>
                  </a>
                )}
                {worker.email && (
                  <a href={`mailto:${worker.email}`} className="flex items-center gap-3 text-slate-700 hover:text-primary-600 transition-colors">
                    <FiMail className="text-primary-500 flex-shrink-0" />
                    <span className="break-all">{worker.email}</span>
                  </a>
                )}
                {worker.location?.address && (
                  <div className="flex items-start gap-3 text-slate-700">
                    <FiMapPin className="text-primary-500 flex-shrink-0 mt-1" />
                    <span>{worker.location.address}, {worker.location.city}{worker.location.pincode && `, ${worker.location.pincode}`}</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setShowContactModal(true)}
                className="btn btn-primary w-full mt-4"
              >
                <FiMessageSquare /> Contact Worker
              </button>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Completed Jobs</span>
                  <span className="text-xl font-bold text-slate-900">{worker.completedJobs || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Response Rate</span>
                  <span className="text-xl font-bold text-emerald-600">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Avg Response Time</span>
                  <span className="text-xl font-bold text-slate-900">2 hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Member Since</span>
                  <span className="text-sm font-medium text-slate-700">{formatDate(worker.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Availability</h3>
              <div className={`px-4 py-3 rounded-xl text-center font-medium ${
                worker.availability?.status === 'available' || worker.isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {worker.availability?.status === 'available' || worker.isActive ? '✓ Available for Work' : 'Currently Unavailable'}
              </div>
              
              {worker.availability?.workingHours && (
                <div className="mt-4 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Working Hours:</span>
                    <span>{worker.availability.workingHours.start} - {worker.availability.workingHours.end}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Contact {worker.name}</h3>
                <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleContact}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    className="input min-h-[120px]"
                    placeholder={`Hi ${worker.name}, I'm interested in hiring you for...`}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowContactModal(false)} className="btn btn-ghost flex-1">
                    Cancel
                  </button>
                  <button type="submit" disabled={sendingMessage} className="btn btn-primary flex-1">
                    {sendingMessage ? 'Sending...' : <><FiMessageSquare /> Send Message</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hire Modal */}
      <AnimatePresence>
        {showHireModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowHireModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Hire {worker.name}</h3>
                <button onClick={() => setShowHireModal(false)} className="text-slate-400 hover:text-slate-600">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleHire}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
                    <input
                      type="text"
                      value={hireDetails.jobTitle}
                      onChange={e => setHireDetails({...hireDetails, jobTitle: e.target.value})}
                      className="input"
                      placeholder="e.g., Kitchen Renovation"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Job Description *</label>
                    <textarea
                      value={hireDetails.description}
                      onChange={e => setHireDetails({...hireDetails, description: e.target.value})}
                      className="input min-h-[100px]"
                      placeholder="Describe the work you need done..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={hireDetails.startDate}
                        onChange={e => setHireDetails({...hireDetails, startDate: e.target.value})}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={hireDetails.duration}
                        onChange={e => setHireDetails({...hireDetails, duration: e.target.value})}
                        className="input"
                        placeholder="e.g., 3 days"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Budget (₹)</label>
                    <input
                      type="number"
                      value={hireDetails.budget}
                      onChange={e => setHireDetails({...hireDetails, budget: e.target.value})}
                      className="input"
                      placeholder="Your budget"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowHireModal(false)} className="btn btn-ghost flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    <FiBriefcase /> Send Hire Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkerProfile;
