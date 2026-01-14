import { useState } from 'react';
import { FiStar, FiFilter, FiThumbsUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Reviews = () => {
  const [reviews] = useState([
    { id: 1, employer: 'Ramesh Kumar', company: 'Kumar Constructions', rating: 5, date: 'Feb 15, 2024', comment: 'Excellent work! Very professional and completed the project ahead of schedule. Highly recommend for electrical work.', job: 'Villa Electrical Installation', helpful: 12 },
    { id: 2, employer: 'Tech Solutions', company: 'Tech Solutions Pvt Ltd', rating: 5, date: 'Jan 28, 2024', comment: 'Outstanding expertise in commercial electrical systems. Very knowledgeable and efficient.', job: 'Office Setup', helpful: 8 },
    { id: 3, employer: 'Sarah Johnson', company: 'Green Home Initiative', rating: 4, date: 'Jan 10, 2024', comment: 'Good work on solar panel installation. Professional approach and clean work. Would hire again.', job: 'Solar Panel Setup', helpful: 5 },
    { id: 4, employer: 'ABC Manufacturing', company: 'ABC Manufacturing Ltd', rating: 5, date: 'Dec 22, 2023', comment: 'Fantastic job on industrial panel installation. Very skilled and follows safety protocols strictly.', job: 'Industrial Panel Installation', helpful: 15 },
    { id: 5, employer: 'Priya Menon', company: 'Builders Consortium', rating: 4, date: 'Dec 05, 2023', comment: 'Completed apartment wiring efficiently. Good quality work and reasonable pricing.', job: 'Apartment Complex Wiring', helpful: 6 },
    { id: 6, employer: 'Restaurant Owner', company: 'Spice Garden', rating: 5, date: 'Nov 18, 2023', comment: 'Excellent service! Kitchen electrical setup was done perfectly. Very reliable worker.', job: 'Restaurant Kitchen Setup', helpful: 10 },
    { id: 7, employer: 'Ajay Sharma', company: 'Smart Homes', rating: 3, date: 'Nov 02, 2023', comment: 'Work was satisfactory but took longer than expected. Final result was good though.', job: 'Smart Home Installation', helpful: 3 },
    { id: 8, employer: 'Mumbai Developers', company: 'Mumbai Developers Ltd', rating: 5, date: 'Oct 15, 2023', comment: 'Best electrician we have worked with! Professional, punctual, and delivers quality work every time.', job: 'Commercial Complex', helpful: 20 },
  ]);

  const [filterRating, setFilterRating] = useState('All');

  const filteredReviews = filterRating === 'All' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filterRating));

  const stats = [
    { label: 'Average Rating', value: '4.7', subtext: 'out of 5.0' },
    { label: 'Total Reviews', value: reviews.length, subtext: 'verified reviews' },
    { label: '5-Star Reviews', value: reviews.filter(r => r.rating === 5).length, subtext: `${Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100)}% of total` },
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
                  {review.employer.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{review.employer}</h3>
                  <p className="text-sm text-slate-600">{review.company}</p>
                  <p className="text-xs text-slate-500 mt-1">{review.date}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {renderStars(review.rating)}
              </div>
            </div>
            <div className="bg-primary-50 border-l-4 border-primary-500 p-3 rounded mb-3">
              <p className="text-xs font-medium text-primary-900 mb-1">Job: {review.job}</p>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">{review.comment}</p>
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-1 text-slate-600 hover:text-primary-600 transition">
                <FiThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="card text-center py-12">
          <FiStar className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No reviews found</h3>
          <p className="text-slate-600">No reviews match your selected filter</p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
