import React from 'react';
import { Link } from 'react-router-dom';
import './LocationNotFound.css';

const LocationNotFound = () => {
  return (
    <div className="location-not-found-container">
      <div className="location-not-found-inner">
        <h3>Location not found</h3>
        <Link to="/">Go back to Search</Link>
      </div>
    </div>
  );
};

export default LocationNotFound;
