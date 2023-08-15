import './BusinessPreview.css';
import { BsStarFill } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

const BusinessPreview = ({
  business,
  bookmark,
  saveBookmark,
  deleteBookmark,
  openStatus,
  formatNumber,
}) => {
  const { name, rating, review_count, location, categories } = business;
  const locate = useLocation();
  const recommend = locate.pathname.includes('/recommended');

  return (
    <li className="business-preview-container">
      <div className="description">
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
          {recommend ? (
            <p style={{ color: '#25807A', paddingTop: '5px' }}>
              {categories[0].title}, {categories[1].title}
            </p>
          ) : (
            <div className="rate-container">
              <BsStarFill className="star-icon" />
              <p>
                {rating}
                <span className="review-count">
                  ({formatNumber(review_count)})
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default BusinessPreview;
