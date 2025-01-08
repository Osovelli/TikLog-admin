import React from 'react';
import { FaStar } from 'react-icons/fa';

const RatingViewer = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className="text-yellow-400 mr-1" />
      ))}
      {hasHalfStar && (
        <FaStar className="text-yellow-400 mr-1" style={{ position: 'relative' }}>
          <FaStar
            className="text-gray-300 absolute top-0 left-0"
            style={{ width: '50%', overflow: 'hidden' }}
          />
        </FaStar>
      )}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
        <FaStar key={index + fullStars + (hasHalfStar ? 1 : 0)} className="text-gray-300 mr-1" />
      ))}
    </div>
  );
};

export default RatingViewer;