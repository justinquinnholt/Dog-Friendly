import React from 'react';
import { Link } from 'react-router-dom';
import BusinessList from './BusinessList';
import PetServiceListItem from '../components/PetServiceListItem';
import './PetServiceList.css';

const PetServiceList = ({
  selectedBusiness,
  setSelectedBusiness,
  businesses,
  setShowOpenOnly,
  showOpenOnly,
  setViewType,
  viewType,
  openBusinesses,
  handleItemClick,
  saveBookmark,
  deleteBookmark,
  bookmark,
  formatNumber,
  mapCenter,
  listClassName,
}) => {
  return (
    <div
      className={`service-container ${businesses.length === 0 ? 'none' : ''}`}>
      <div className="service-container-inner">
        <div className="service-heading">
          <h3>Pet Services</h3>
        </div>
        {businesses.length === 0 ? (
          <div className="service-not-found">
            <h3>Set account profile to view services</h3>
            <Link to="/login">Go back to login</Link>
          </div>
        ) : (
          <BusinessList
            selectedBusiness={selectedBusiness}
            setSelectedBusiness={setSelectedBusiness}
            BusinessItemComponent={PetServiceListItem}
            businesses={businesses}
            setShowOpenOnly={setShowOpenOnly}
            showOpenOnly={showOpenOnly}
            setViewType={setViewType}
            viewType={viewType}
            openBusinesses={openBusinesses}
            handleItemClick={handleItemClick}
            saveBookmark={saveBookmark}
            deleteBookmark={deleteBookmark}
            bookmark={bookmark}
            formatNumber={formatNumber}
            mapCenter={mapCenter}
            listClassName={listClassName}
          />
        )}
      </div>
    </div>
  );
};
export default PetServiceList;
