import { useState } from 'react';
import { FiStar, FiMessageSquare, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
        }`}
      />
    ));
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [key, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) {
        return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex gap-4">
        <img
          src={review.reviewerAvatar || 'https://ui-avatars.com/api/?name=' + review.reviewerName}
          alt={review.reviewerName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">{review.reviewerName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                <span className="text-sm text-slate-600">
                  {review.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <FiClock className="w-4 h-4" />
              {timeAgo(review.date)}
            </div>
          </div>

          {review.jobTitle && (
            <p className="text-sm text-slate-600 mt-2">
              <span className="font-medium">Project:</span> {review.jobTitle}
            </p>
          )}

          <p className="text-slate-700 mt-3">{review.comment}</p>

          {review.response && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border-l-4 border-primary-500">
              <div className="flex items-center gap-2 mb-2">
                <FiMessageSquare className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-slate-900">Response from {review.respondentName}</span>
              </div>
              <p className="text-sm text-slate-700">{review.response}</p>
            </div>
          )}

          {review.helpful !== undefined && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <button className="text-sm text-slate-600 hover:text-primary-600 transition">
                👍 Helpful ({review.helpful})
              </button>
              <button className="text-sm text-slate-600 hover:text-slate-900 transition">
                Report
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
