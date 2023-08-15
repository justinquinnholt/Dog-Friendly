import React, { useState } from 'react';
import './PetServiceListItem.css';
import { BsHeartFill } from 'react-icons/bs';

const PetServiceListItem = ({
  business,
  handleItemClick,
  bookmark,
  saveBookmark,
  deleteBookmark,
}) => {
  const { id, name, location, image_url, categories } = business;
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
    <li className="service-result-list">
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
          <h5>{name}</h5>
          <p style={{ color: '#98A3AD' }}>
            {location.address1},<br />
            {location.city}, {location.state} {location.zip_code}
          </p>
          <p style={{ color: '#25807A', paddingTop: '5px' }}>
            {categories[0].title}
            {categories[1] && `, ${categories[1].title}`}
          </p>
        </div>
      </div>
    </li>
  );
};

export default PetServiceListItem;
