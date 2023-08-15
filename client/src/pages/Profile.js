import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Profile.css';
import {
  loadUserData,
  saveUserData,
  updateUserData,
  fetchAllServices,
  fetchOpenServices,
} from './data';

const Profile = ({ setAllServices, setOpenServices }) => {
  const [dogName, setDogName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profileId, setProfileId] = useState(false);
  const navigate = useNavigate();

  const allStates = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];

  useEffect(() => {
    insertUserData();
  }, []);

  const insertUserData = async () => {
    try {
      const userData = await loadUserData();
      if (!userData.profileId) {
        setEditMode(true);
      }
      setDogName(userData.dogName || '');
      setStreetAddress(userData.streetAddress || '');
      setCity(userData.city || '');
      setState(userData.state || '');
      setZipcode(userData.zipcode || '');
      setProfileId(userData.profileId);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    const userData = { dogName, streetAddress, city, state, zipcode };

    const requiredFields = Object.entries(userData).filter(
      ([key, value]) => value.trim() === ''
    );
    if (requiredFields.length > 0) {
      const missingFields = requiredFields.map(([key]) => key).join(', ');
      toast.error(`Required fields are missing: ${missingFields}`, {
        position: 'bottom-center',
        autoClose: 2000,
      });
      return;
    }

    try {
      if (profileId) {
        setEditMode(false);
        await updateUserData(userData, profileId);
        await fetchAllServices(profileId, setAllServices);
        await fetchOpenServices(profileId, setOpenServices);
      } else {
        await saveUserData(userData);
        setEditMode(false);
        const newProfile = await loadUserData();
        if (newProfile && newProfile.profileId) {
          await fetchAllServices(newProfile.profileId, setAllServices);
          await fetchOpenServices(newProfile.profileId, setOpenServices);
        }
      }
      toast.success('Profile saved successfully!', {
        position: 'bottom-center',
        autoClose: 2000,
      });
    } catch (err) {
      toast.error('Failed to save profile. Please try again.', {
        position: 'bottom-center',
        autoClose: 2000,
      });
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleSignOut = () => {
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('AllServices');
      sessionStorage.removeItem('OpenServices');
      setAllServices([]);
      setOpenServices([]);
      navigate('/login');
    } catch (err) {
      alert(`Error signing out: ${err}`);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-container-inner">
        <div className="profile-heading">
          <h3>My Profile</h3>
        </div>
        <div className="profile-container-form">
          <form className="profile-container-form-inner">
            <div className="input-row">
              <label htmlFor="dogName">Dog name</label>
              <input
                id="dogName"
                type="text"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                autoComplete="off"
                disabled={!editMode}
              />
            </div>
            <div className="input-row">
              <label htmlFor="streetAddress">Street address</label>
              <input
                id="streetAddress"
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                autoComplete="off"
                disabled={!editMode}
              />
            </div>
            <div className="input-row">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="off"
                disabled={!editMode}
              />
            </div>
            <div className="input-row">
              <div className="input-column">
                <div className="input-column-row">
                  <label htmlFor="state">State</label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={!editMode}>
                    <option value="">Select State</option>
                    {allStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-column-row">
                  <label htmlFor="zipcode">Zipcode</label>
                  <input
                    id="zipcode"
                    type="text"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <p>
          Above information is used to provide pet services near your location.
        </p>
        <div className="button-container">
          {editMode ? (
            <div className="button-column">
              <button
                className="cancel-btn"
                type="button"
                onClick={handleCancelClick}>
                Cancel
              </button>
              <button
                className="save-btn"
                type="button"
                onClick={handleSaveClick}>
                Save
              </button>
            </div>
          ) : (
            <div className="button-column">
              <button
                className="edit-btn"
                type="button"
                onClick={() => setEditMode(true)}>
                Edit
              </button>
              <button className="logout-btn" onClick={handleSignOut}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
