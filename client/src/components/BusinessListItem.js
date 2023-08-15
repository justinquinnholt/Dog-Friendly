import React, { useState } from 'react';
import './BusinessListItem.css';
import Stars from './Stars';
import { BsHeartFill } from 'react-icons/bs';

const BusinessListItem = ({
  business,
  handleItemClick,
  bookmark,
  saveBookmark,
  deleteBookmark,
  openStatus,
  formatNumber,
}) => {
  const { id, name, rating, review_count, location, image_url } = business;
  const isBookmarked = bookmark.includes(id);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <li className="search-result-list">
      <div className="img-bookmark">
        <button
          className="bookmark-btn"
          onClick={isBookmarked ? openModal : () => saveBookmark(id)}>
          <BsHeartFill size={16} color={isBookmarked ? '#F15E54' : '#fff'} />
        </button>
        <img src={image_url} alt={name} width="50" height="50" />
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
      <div className="description" onClick={() => handleItemClick(business)}>
        <div className="description-inner">
          <div className="description-inner-row-one">
            <h4>{name}</h4>
            <p style={{ color: openStatus ? '#25807A' : '#98A3AD' }}>
              {openStatus ? 'open' : 'closed'}
            </p>
          </div>
          <p style={{ color: '#98A3AD' }}>
            {location.address1},<br />
            {location.city}, {location.state} {location.zip_code}
          </p>
          <div className="rate-container">
            <Stars rating={rating} />
            <p>
              {rating}
              <span className="review-count">
                ({formatNumber(review_count)})
              </span>
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default BusinessListItem;
