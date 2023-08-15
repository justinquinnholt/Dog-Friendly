import React, { useState } from 'react';
import './SearchForm.css';
import { AiOutlineClose } from 'react-icons/ai';
import { BsArrowRightCircle } from 'react-icons/bs';

const SearchForm = ({
  searchAddress,
  setSearchAddress,
  handleSearch,
  submitted,
}) => {
  const [currentLocationError, setCurrentLocationError] = useState(null);
  const [showUseCurrentLocation, setShowUseCurrentLocation] = useState(false);

  const handleUseCurrentLocation = () => {
    setShowUseCurrentLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
            );
            const data = await response.json();
            if (data.status === 'OK') {
              const address = data.results[0].formatted_address;
              setSearchAddress(address);
            } else {
              setCurrentLocationError('Unable to retrieve your location.');
            }
          } catch (error) {
            setCurrentLocationError(
              'An error occurred while fetching your location.'
            );
            console.error(error);
          }
        },
        (error) => {
          setCurrentLocationError('Unable to retrieve your location.');
          console.error(error);
        }
      );
    } else {
      setCurrentLocationError('Geolocation is not supported by your browser.');
    }
  };

  const handleInputFocus = () => {
    setShowUseCurrentLocation(true);
  };

  const handleClearInput = () => {
    setSearchAddress('');
    setShowUseCurrentLocation(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowUseCurrentLocation(false);
    }, 200);
  };

  return (
    <div className={`search-form ${submitted ? 'submitted' : ''}`}>
      <form
        className={`form-container ${submitted ? 'submitted' : ''}`}
        onSubmit={handleSearch}>
        <div className="form-container-inner">
          {showUseCurrentLocation && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClearInput}>
              <AiOutlineClose className="clear-icon" />
            </button>
          )}
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            name="search"
            placeholder="Enter Location"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <button type="submit" className="submit-btn">
            <BsArrowRightCircle className="submit-icon" />
          </button>
        </div>
      </form>
      {showUseCurrentLocation && (
        <button
          className="current-location-btn"
          onClick={handleUseCurrentLocation}>
          Use Current Location
        </button>
      )}
      {currentLocationError && <p>{currentLocationError}</p>}
    </div>
  );
};

export default SearchForm;
