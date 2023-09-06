import './BusinessDetail.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  BsHeartFill,
  BsFillArrowLeftCircleFill,
  BsCursor,
} from 'react-icons/bs';
import Stars from '../components/Stars';

const BusinessDetail = ({
  business,
  handleGetDirectionsClick,
  bookmark,
  saveBookmark,
  deleteBookmark,
  formatNumber,
}) => {
  const {
    id,
    name,
    rating,
    review_count,
    location,
    image_url,
    hours,
    display_phone,
    categories,
  } = business || {};

  const navigate = useNavigate();
  const locate = useLocation();
  const isBookmarked = bookmark.includes(id);
  const [showModal, setShowModal] = useState(false);
  const renderHours = () => {
    if (hours && hours[0] && hours[0].open) {
      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      return daysOfWeek.map((day, index) => {
        const matchingHour = hours[0].open.find((hour) => hour.day === index);

        if (matchingHour) {
          const startHour = parseInt(matchingHour.start.slice(0, 2), 10);
          const endHour = parseInt(matchingHour.end.slice(0, 2), 10);
          const startMinutes = matchingHour.start.slice(2);
          const endMinutes = matchingHour.end.slice(2);
          const startTime = `${
            startHour % 12 === 0 ? 12 : startHour % 12
          }:${startMinutes}${startHour >= 12 ? 'PM' : 'AM'}`;
          const endTime = `${
            endHour % 12 === 0 ? 12 : endHour % 12
          }:${endMinutes}${endHour >= 12 ? 'PM' : 'AM'}`;

          return (
            <div key={index} className="day-container">
              <p className="day">{day}</p>
              <p>
                {startTime} - {endTime}
              </p>
            </div>
          );
        } else {
          return (
            <div key={index} className="day-container">
              <p className="day">{day}</p>
              <p>Closed</p>
            </div>
          );
        }
      });
    }
    return null;
  };

  const handleBackClick = () => {
    if (locate.pathname.includes('/search-results')) {
      navigate('/search-results');
    } else if (locate.pathname.includes('/bookmark')) {
      navigate('/bookmark');
    } else if (locate.pathname.includes('/recommended')) {
      navigate('/recommended');
    } else if (locate.pathname.includes('/service')) {
      navigate('/service');
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmDelete = () => {
    deleteBookmark(id);
    closeModal();
  };

  const pathIsService = locate.pathname.includes('/service');

  return (
    <div className="detail-container">
      <div className="img-container">
        <button className="back-btn" onClick={handleBackClick}>
          <BsFillArrowLeftCircleFill size={22} color="#fff" />
        </button>
        <button
          className="bookmark-btn"
          onClick={isBookmarked ? openModal : () => saveBookmark(id)}>
          <BsHeartFill size={20} color={isBookmarked ? '#F15E54' : '#fff'} />
        </button>
        <img src={image_url || ''} alt={name} width="50" height="50" />
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-backdrop" onClick={closeModal} />
          <div className="modal-content">
            <h4>Delete Bookmark</h4>
            <p>This action cannot be undone</p>
            <div className="modal-btn">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="description-container">
        <div className="description-inner">
          <div className="description-inner-row-one">
            <h4 className="business-name">{name}</h4>
            <p
              style={{
                color:
                  hours && hours[0] && hours[0].is_open_now
                    ? '#25807A'
                    : '#98A3AD',
              }}>
              {hours && hours[0] && hours[0].is_open_now ? 'open' : 'closed'}
            </p>
          </div>
          <div className="description-inner-row-two">
            <p>
              {location.address1 === null || location.address1 === ''
                ? 'Street Address Not Provided'
                : `${location.address1},`}
              <br />
              {location.city}, {location.state} {location.zip_code}
            </p>
            <p style={{ cursor: 'pointer' }}>{display_phone}</p>
          </div>
          <div className="rate-container">
            <Stars rating={rating} />
            <p>
              {rating || ''}
              <span className="review-count">
                ({formatNumber(review_count || '')})
              </span>
            </p>
          </div>
          {pathIsService && (
            <p style={{ color: '#25807A', paddingTop: '5px' }}>
              {categories[0].title}
              {categories[1] && `, ${categories[1].title}`}
            </p>
          )}
        </div>
      </div>
      <div className="hours-container">
        <h4>Hours of Operation</h4>
        {renderHours()}
      </div>
      <div className="get-direction-container">
        <button
          className="direction-btn"
          onClick={() => handleGetDirectionsClick(business)}>
          <BsCursor className="direction-icon" size={14} />
          <span className="button-text">Directions</span>
        </button>
      </div>
    </div>
  );
};

export default BusinessDetail;
