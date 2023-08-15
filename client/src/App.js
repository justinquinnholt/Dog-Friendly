import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchForm from './pages/SearchForm';
import BusinessListItem from './components/BusinessListItem';
import BusinessDetail from './pages/BusinessDetail';
import Bookmark from './pages/Bookmark';
import Header from './components/Header';
import LocationNotFound from './pages/LocationNotFound';
import BusinessList from './pages/BusinessList';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PetServiceList from './pages/PetServiceList';

const App = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [openBusinesses, setOpenBusinesses] = useState([]);
  const [viewType, setViewType] = useState('list');
  const [mapCenter, setMapCenter] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookmark, setBookmark] = useState([]);
  const [bookmarkList, setBookmarkList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = sessionStorage.getItem('token');
  const [allServices, setAllServices] = useState([]);
  const [openServices, setOpenServices] = useState([]);

  useEffect(() => {
    if (
      (allBusinesses.length > 0 ||
        openBusinesses.length > 0 ||
        allServices.length > 0 ||
        openServices.length > 0 ||
        bookmarkList.length > 0) &&
      !mapCenter
    ) {
      const firstBusiness =
        allBusinesses[0] ||
        openBusinesses[0] ||
        allServices[0] ||
        openServices[0] ||
        bookmarkList[0];
      const { latitude, longitude } = firstBusiness.coordinates;
      setMapCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
    }
  }, [
    allBusinesses,
    openBusinesses,
    allServices,
    openServices,
    mapCenter,
    bookmarkList,
  ]);

  useEffect(() => {
    allBookmark();
  }, []);

  useEffect(() => {
    if (location.pathname.includes('/search-results')) {
      setSubmitted(true);
    }
  }, [location.pathname]);

  const allBookmark = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      if (!response.ok) {
        throw new Error('Failed to save bookmark');
      }
      const bookmarkData = await response.json();
      setBookmark(bookmarkData);
    } catch (error) {
      console.error('Error bookmark:', error);
    }
  };

  useEffect(() => {
    const storedAllService = JSON.parse(sessionStorage.getItem('AllServices'));
    const storedOpenService = JSON.parse(
      sessionStorage.getItem('OpenServices')
    );
    const storedAllBusinesses = JSON.parse(
      sessionStorage.getItem('AllBusinesses')
    );
    const storedOpenBusinesses = JSON.parse(
      sessionStorage.getItem('OpenBusinesses')
    );

    if (storedAllService) {
      setAllServices(storedAllService);
    }

    if (storedOpenService) {
      setOpenServices(storedOpenService);
    }

    if (storedAllBusinesses) {
      setAllBusinesses(storedAllBusinesses);
    }

    if (storedOpenBusinesses) {
      setOpenBusinesses(storedOpenBusinesses);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const allResponse = await fetch(
        `/api/businesses?address=${encodeURIComponent(searchAddress)}`
      );
      const openResponse = await fetch(
        `/api/businesses/open?address=${encodeURIComponent(searchAddress)}`
      );

      if (!allResponse.ok || !openResponse.ok) {
        throw new Error('Error fetching data');
      }
      const allData = await allResponse.json();
      const openData = await openResponse.json();
      setAllBusinesses(allData);
      setOpenBusinesses(openData);
      sessionStorage.setItem('AllBusinesses', JSON.stringify(allData));
      sessionStorage.setItem('OpenBusinesses', JSON.stringify(openData));
      navigate('/search-results');
    } catch (error) {
      console.log('Error:', error);
      navigate('/location-not-found');
    }
  };

  const saveBookmark = async (placeId) => {
    const data = { placeId };

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save bookmark');
      }
      await response.json();
      toast.success('Bookmark saved successfully!', {
        position: 'bottom-center',
        autoClose: 2000,
      });
    } catch (error) {
      toast.error('Failed to save bookmark. Please try again.', {
        position: 'bottom-center',
        autoClose: 2000,
      });
    }
    allBookmark();
  };

  const deleteBookmark = async (placeId) => {
    const data = { placeId };

    try {
      const response = await fetch(`/api/bookmarks/${placeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete bookmark');
      }
      await response.json();
      toast.success('Bookmark deleted successfully!', {
        position: 'bottom-center',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error saving bookmark:', error);
      toast.error('Failed to delete bookmark. Please try again.', {
        position: 'bottom-center',
        autoClose: 2000,
      });
    }
    allBookmark();
  };

  useEffect(() => {
    const loadBookmarkList = async () => {
      try {
        const fetchPromises = bookmark.map(async (businessId) => {
          const response = await fetch(`/api/businesses/${businessId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch business details');
          }
          const data = await response.json();
          return data;
        });

        const results = await Promise.all(fetchPromises);
        const filteredResults = results.filter((business) => !business.error);
        setBookmarkList(filteredResults);
      } catch (error) {
        console.error('Error fetching bookmark details:', error);
      }
    };

    loadBookmarkList();
  }, [bookmark]);

  const handleGetDirectionsClick = (business) => {
    const { latitude, longitude } = business.coordinates;
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        searchAddress
      )}&destination=${latitude},${longitude}`,
      '_blank'
    );
  };

  const handleItemClick = async (business) => {
    try {
      const response = await fetch(`/api/businesses/${business.id}`);
      const data = await response.json();
      setSelectedBusiness(data);
      if (location.pathname.includes('/search-results')) {
        navigate(`/search-results/${business.id}`);
      } else if (location.pathname.includes('/bookmark')) {
        navigate(`/bookmark/${business.id}`);
      } else if (location.pathname.includes('/recommended')) {
        navigate(`/recommended/${business.id}`);
      } else if (location.pathname.includes('/service')) {
        navigate(`/service/${business.id}`);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const formatNumber = (number) => {
    if (number >= 1000) {
      const rounded = Math.round((number / 1000) * 10) / 10;
      return `${rounded}K`;
    }
    return number.toString();
  };

  const filterBusinesses = showOpenOnly ? openBusinesses : allBusinesses;
  const open = bookmarkList.filter(
    (business) => business.hours && business.hours[0]?.is_open_now
  );

  const filteredBookmarkList = showOpenOnly ? open : bookmarkList;

  const isBusinessDetailPage =
    location.pathname.includes('/search-results/') ||
    location.pathname.includes('/bookmark/') ||
    location.pathname.includes('/recommended/') ||
    location.pathname.includes('/service/');

  const petService = showOpenOnly ? openServices : allServices;

  return (
    <>
      {!isBusinessDetailPage && <Header />}
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Profile
                setAllServices={setAllServices}
                setOpenServices={setOpenServices}
              />
            ) : (
              <Login
                setAllServices={setAllServices}
                setOpenServices={setOpenServices}
              />
            )
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="*"
          element={
            <SearchForm
              searchAddress={searchAddress}
              setSearchAddress={setSearchAddress}
              handleSearch={handleSearch}
            />
          }
        />
        <Route
          path="/bookmark"
          element={
            <Bookmark
              selectedBusiness={selectedBusiness}
              setSelectedBusiness={setSelectedBusiness}
              bookmarkList={filteredBookmarkList}
              businesses={filterBusinesses}
              setShowOpenOnly={setShowOpenOnly}
              showOpenOnly={showOpenOnly}
              setViewType={setViewType}
              viewType={viewType}
              openBusinesses={open}
              handleItemClick={handleItemClick}
              saveBookmark={saveBookmark}
              deleteBookmark={deleteBookmark}
              setBookmark={setBookmark}
              bookmark={bookmark}
              formatNumber={formatNumber}
              mapCenter={mapCenter}
              listClassName={null}
            />
          }
        />
        <Route path="/location-not-found" element={<LocationNotFound />} />
        <Route
          path="/search-results"
          element={
            <div className="search-result-page">
              <SearchForm
                searchAddress={searchAddress}
                setSearchAddress={setSearchAddress}
                handleSearch={handleSearch}
                submitted={submitted}
              />
              <BusinessList
                selectedBusiness={selectedBusiness}
                setSelectedBusiness={setSelectedBusiness}
                BusinessItemComponent={BusinessListItem}
                businesses={filterBusinesses}
                setShowOpenOnly={setShowOpenOnly}
                showOpenOnly={showOpenOnly}
                setViewType={setViewType}
                viewType={viewType}
                openBusinesses={openBusinesses}
                allBusinesses={allBusinesses}
                handleItemClick={handleItemClick}
                saveBookmark={saveBookmark}
                deleteBookmark={deleteBookmark}
                bookmark={bookmark}
                formatNumber={formatNumber}
                mapCenter={mapCenter}
                listClassName={null}
                setBookmark={setBookmark}
              />
            </div>
          }
        />
        <Route
          path="/search-results/:id"
          element={
            <BusinessDetail
              business={selectedBusiness}
              handleGetDirectionsClick={handleGetDirectionsClick}
              saveBookmark={saveBookmark}
              deleteBookmark={deleteBookmark}
              bookmark={bookmark}
              formatNumber={formatNumber}
            />
          }
        />
        <Route
          path="/bookmark/:id"
          element={
            <BusinessDetail
              business={selectedBusiness}
              handleGetDirectionsClick={handleGetDirectionsClick}
              saveBookmark={saveBookmark}
              deleteBookmark={deleteBookmark}
              bookmark={bookmark}
              formatNumber={formatNumber}
            />
          }
        />
        <Route
          path="/service/:id"
          element={
            <BusinessDetail
              business={selectedBusiness}
              handleGetDirectionsClick={handleGetDirectionsClick}
              saveBookmark={saveBookmark}
              deleteBookmark={deleteBookmark}
              bookmark={bookmark}
              formatNumber={formatNumber}
            />
          }
        />
        <Route
          path="/service"
          element={
            <PetServiceList
              selectedBusiness={selectedBusiness}
              setSelectedBusiness={setSelectedBusiness}
              businesses={petService}
              setShowOpenOnly={setShowOpenOnly}
              showOpenOnly={showOpenOnly}
              setViewType={setViewType}
              viewType={viewType}
              openBusinesses={openServices}
              handleItemClick={handleItemClick}
              saveBookmark={saveBookmark}
              deleteBookmark={deleteBookmark}
              bookmark={bookmark}
              formatNumber={formatNumber}
              mapCenter={mapCenter}
              listClassName={'column-two'}
            />
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
