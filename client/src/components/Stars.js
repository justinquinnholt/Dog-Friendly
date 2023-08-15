import React from 'react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

const Stars = ({ rating }) => {
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      if (i <= fullStars) {
        stars.push(<BsStarFill key={i} className="star-icon" />);
      } else if (hasHalfStar && i === fullStars + 1) {
        stars.push(<BsStarHalf key={i} className="star-icon" />);
      } else {
        stars.push(<BsStar key={i} className="star-icon" />);
      }
    }

    return stars;
  };

  return <>{renderStars()}</>;
};

export default Stars;
