import { useState } from 'react';
import { FiStar, FiFilter, FiThumbsUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Reviews = () => {
  const [reviews] = useState([
    { id: 1, worker: 'Rajesh Kumar', profession: 'Electrician', rating: 5, date: 'Feb 10, 2024', comment: 'Excellent company to work with. Payment on time and clear project requirements. Would love to work with them again!', job: 'Villa Electrical Installation', helpful: 8 },
    { id: 2, worker: 'Suresh Patel', profession: 'Plumber', rating: 5, date: 'Jan 25, 2024', comment: 'Very professional management. Good working environment and fair compensation. Highly recommended employer.', job: 'Office Plumbing Work', helpful: 12 },
    { id: 3, worker: 'Amit Sharma', profession: 'Carpenter', rating: 4, date: 'Jan 15, 2024', comment: 'Good experience overall. Project was well organized and team was supportive. Only minor delays in material supply.', job: 'Office Renovation', helpful: 5 },
    { id: 4, worker: 'Vijay Kumar', profession: 'Painter', rating: 5, date: 'Dec 28, 2023', comment: 'Great company! Professional approach, timely payments, and respectful treatment. One of the best employers I have worked for.', job: 'Apartment Complex Painting', helpful: 15 },
    { id: 5, worker: 'Kiran Singh', profession: 'Mason', rating: 4, date: 'Dec 15, 2023', comment: 'Smooth project execution. Good coordination and clear instructions throughout the work.', job: 'Building Construction', helpful: 7 },
    { id: 6, worker: 'Ravi Mehta', profession: 'Welder', rating: 5, date: 'Nov 30, 2023', comment: 'Outstanding experience! Proper safety measures, good pay, and excellent project management.', job: 'Metal Framework', helpful: 10 },
  ]);

  const [filterRating, setFilterRating] = useState('All');

  const filteredReviews = filterRating === 'All' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filterRating));

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  const stats = [
    { label: 'Average Rating', value: averageRating, subtext: 'out of 5.0' },
    { label: 'Total Reviews', value: reviews.length, subtext: 'from workers' },
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
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Company Reviews</h1>
        <p className="text-slate-600 mt-1">See what workers say about your company</p>
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
                  {review.worker.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{review.worker}</h3>
                  <p className="text-sm text-slate-600">{review.profession}</p>
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
