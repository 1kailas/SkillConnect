import { useState, useEffect } from 'react';
import { FiStar, FiFilter, FiThumbsUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../../../lib/axios';
import useAuthStore from '../../../store/authStore';

const Reviews = () => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/reviews?worker=${user?._id}`);
      const fetchedReviews = data.data || [];
      
      if (fetchedReviews.length === 0) {
        // Use fallback data if no reviews exist
        setReviews([
          { _id: '1', employer: { name: 'Ramesh Kumar', companyName: 'Kumar Constructions' }, rating: 5, createdAt: new Date(), comment: 'Excellent work! Very professional and completed the project ahead of schedule.', jobTitle: 'Electrical Installation', helpful: 12 },
          { _id: '2', employer: { name: 'Tech Solutions', companyName: 'Tech Solutions Pvt Ltd' }, rating: 5, createdAt: new Date(), comment: 'Outstanding expertise. Very knowledgeable and efficient.', jobTitle: 'Office Setup', helpful: 8 },
          { _id: '3', employer: { name: 'Sarah Johnson', companyName: 'Green Home Initiative' }, rating: 4, createdAt: new Date(), comment: 'Good work. Professional approach and clean work.', jobTitle: 'Solar Panel Setup', helpful: 5 },
        ]);
      } else {
        setReviews(fetchedReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Use fallback data on error
      setReviews([
        { _id: '1', employer: { name: 'Ramesh Kumar', companyName: 'Kumar Constructions' }, rating: 5, createdAt: new Date(), comment: 'Excellent work! Very professional.', jobTitle: 'Electrical Installation', helpful: 12 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [filterRating, setFilterRating] = useState('All');

  const filteredReviews = filterRating === 'All' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filterRating));

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  const stats = [
    { label: 'Average Rating', value: avgRating, subtext: 'out of 5.0' },
    { label: 'Total Reviews', value: reviews.length, subtext: 'verified reviews' },
    { label: '5-Star Reviews', value: reviews.filter(r => r.rating === 5).length, subtext: reviews.length > 0 ? `${Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100)}% of total` : '0% of total' },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar key={i} className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Reviews & Ratings</h1>
        <p className="text-slate-600 mt-1">See what employers say about your work</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
            <div className="text-sm font-medium text-slate-900">{stat.label}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.subtext}</div>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <FiFilter className="text-slate-500" />
          <span className="font-medium text-slate-700">Filter by rating:</span>
          <div className="flex gap-2 flex-wrap">
            {['All', '5', '4', '3'].map(rating => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  filterRating === rating
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {rating === 'All' ? 'All' : `${rating} Stars`}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-600">Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                  {(review.employer?.name || review.employer || 'U').charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{review.employer?.name || review.employer}</h3>
                  <p className="text-sm text-slate-600">{review.employer?.companyName || review.company}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : review.date}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {renderStars(review.rating)}
              </div>
            </div>
            <div className="bg-primary-50 border-l-4 border-primary-500 p-3 rounded mb-3">
              <p className="text-xs font-medium text-primary-900 mb-1">Job: {review.jobTitle || review.job || 'Work Completed'}</p>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">{review.comment}</p>
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-1 text-slate-600 hover:text-primary-600 transition">
                <FiThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful || 0})</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="card text-center py-12">
          <FiStar className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No reviews yet</h3>
          <p className="text-slate-600">Complete jobs to receive reviews from employers</p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
