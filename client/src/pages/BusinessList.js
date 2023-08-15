import React from 'react';
import './BusinessList.css';
import MapView from '../components/MapView';
import { LoadScript } from '@react-google-maps/api';

const BusinessList = ({
  selectedBusiness,
  setSelectedBusiness,
  BusinessItemComponent,
  businesses,
  setShowOpenOnly,
  showOpenOnly,
  setViewType,
  viewType,
  openBusinesses,
  allBusinesses,
  handleItemClick,
  saveBookmark,
  deleteBookmark,
  bookmark,
  formatNumber,
  mapCenter,
  listClassName,
}) => {
  const handleFilterToggle = () => {
    setShowOpenOnly(!showOpenOnly);
  };

  const handleViewTypeChange = (type) => {
    setViewType(type);
  };

  return (
    <div className="search-result-container">
      <div className="filter-container">
        <div className="filter-container-column">
          <button
            className={`filter ${showOpenOnly ? 'all' : 'open'}`}
            onClick={handleFilterToggle}>
            {showOpenOnly ? 'All Businesses' : 'Currently Open'}
          </button>
          <div className="view-type-container">
            <button
              className={`view ${viewType === 'list' ? 'active' : ''}`}
              onClick={() => handleViewTypeChange('list')}>
              List
            </button>
            <button
              className={`view ${viewType === 'map' ? 'active' : ''}`}
              onClick={() => handleViewTypeChange('map')}>
              Map
            </button>
          </div>
        </div>
      </div>
      {viewType === 'list' && (
        <div className="list-container">
          {businesses === openBusinesses && openBusinesses.length === 0 && (
            <h1>No businesses are open</h1>
          )}
          {businesses === allBusinesses && allBusinesses.length === 0 && (
            <h1>No businesses are available</h1>
          )}
          {businesses.length > 0 && (
            <ul className={`list-container-inner ${listClassName}`}>
              {businesses.map((business) => {
                const openStatus = openBusinesses.some(
                  (openBusiness) => openBusiness.id === business.id
                );

                return (
                  <BusinessItemComponent
                    key={business.id}
                    business={business}
                    handleItemClick={handleItemClick}
                    openStatus={openStatus}
                    saveBookmark={saveBookmark}
                    deleteBookmark={deleteBookmark}
                    bookmark={bookmark}
                    formatNumber={formatNumber}
                  />
                );
              })}
            </ul>
          )}
        </div>
      )}
      {viewType === 'map' && (
        <div className="map-view-container">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
            <MapView
              selectedBusiness={selectedBusiness}
              setSelectedBusiness={setSelectedBusiness}
              businesses={businesses}
              mapCenter={mapCenter}
              handleItemClick={handleItemClick}
              saveBookmark={saveBookmark}
              deleteBookmark={deleteBookmark}
              bookmark={bookmark}
              formatNumber={formatNumber}
            />
          </LoadScript>
        </div>
      )}
    </div>
  );
};

export default BusinessList;
