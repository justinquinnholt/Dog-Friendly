import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import BusinessModal from './BusinessModal';
import BusinessPreview from './BusinessPreview';

const MapView = ({
  businesses,
  mapCenter,
  handleItemClick,
  saveBookmark,
  deleteBookmark,
  bookmark,
  formatNumber,
  selectedBusiness,
  setSelectedBusiness,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [googleMap, setGoogleMap] = useState(null);
  const mapRef = useRef(null);

  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (googleMap && bounds) {
      googleMap.fitBounds(bounds);
    }
  }, [googleMap, bounds]);

  const previewBtnStyles = {
    width: '230px',
    display: 'flex',
    justifyContent: 'space-between',
  };

  const mapStyles = {
    height: '100vh',
    width: '100%',
  };

  const mapOptions = {
    disableDefaultUI: true,
  };

  const handleMarkerClick = (business) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);

    if (googleMap) {
      const markerPosition = {
        lat: parseFloat(business.coordinates.latitude),
        lng: parseFloat(business.coordinates.longitude),
      };
      googleMap.panTo(markerPosition);
    }
  };

  const handleMapLoad = (mapInstance) => {
    setGoogleMap(mapInstance);
  };

  useEffect(() => {
    if (businesses.length > 0) {
      const mapBounds = new window.google.maps.LatLngBounds();
      businesses.forEach((business) => {
        const markerPosition = new window.google.maps.LatLng(
          parseFloat(business.coordinates.latitude),
          parseFloat(business.coordinates.longitude)
        );
        mapBounds.extend(markerPosition);
      });
      setBounds(mapBounds);
    }
  }, [businesses]);

  const handleCloseModal = () => {
    setSelectedBusiness(null);
    setIsModalOpen(false);
  };

  const pawIconURI =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuNzMyMDMgMi41OTAxOEMxMC4zNDY2IDQuNDE2MTcgOS43MTkxNCA2LjI1OTE5IDguMzMwOTQgNi43MTAzNkM2Ljk0Mjc1IDcuMTYxNTQgNS4zMTgxNyA2LjA0NjM3IDQuNzAzNTggNC4yMjAzOEM0LjA4ODk5IDIuMzk0MzggNC43MTY0NyAwLjU1MTM2NiA2LjEwNDY3IDAuMTAwMTg5QzcuNDkyODcgLTAuMzUwOTg5IDkuMTE3NDQgMC43NjQxODYgOS43MzIwMyAyLjU5MDE4Wk00LjMxMjQ4IDcuMDg5MThDNS4xMjQ3NyA4LjQ2ODI1IDQuOTI3MDcgMTAuMDcyOSAzLjg3NDEgMTAuNjY4OEMyLjgyMTEzIDExLjI2NDcgMS4zMDgzIDEwLjYzMDUgMC41MDAzMDYgOS4yNTE0M0MtMC4zMDc2ODUgNy44NzIzNiAtMC4xMTg1ODEgNi4yNjc3IDAuOTM0Mzg2IDUuNjcxOEMxLjk4NzM1IDUuMDc1OTEgMy41MDAxOSA1LjcxMDExIDQuMzA4MTggNy4wODkxOEg0LjMxMjQ4Wk0yLjk3MTU2IDE1LjcxMjZDNS4yMjM2MiA5LjY5ODM1IDkuMjI0ODkgOC4xNzAzMSAxMC45OTk5IDguMTcwMzFDMTIuNzc0OSA4LjE3MDMxIDE2Ljc3NjIgOS42OTgzNSAxOS4wMjgyIDE1LjcxMjZDMTkuMTgyOSAxNi4xMjU1IDE5LjI1MTcgMTYuNTY4MiAxOS4yNTE3IDE3LjAxMDhWMTcuMDc4OUMxOS4yNTE3IDE4LjE3NzEgMTguMzUzNSAxOS4wNjY3IDE3LjI0NDYgMTkuMDY2N0MxNi43NTA0IDE5LjA2NjcgMTYuMjYwNCAxOS4wMDcxIDE1Ljc4MzQgMTguODg3OUwxMi4wMDEzIDE3Ljk1MTVDMTEuMzQzNyAxNy43ODk3IDEwLjY1NjEgMTcuNzg5NyA5Ljk5ODUgMTcuOTUxNUw2LjIxNjQxIDE4Ljg4NzlDNS43MzkzNSAxOS4wMDcxIDUuMjQ5NCAxOS4wNjY3IDQuNzU1MTUgMTkuMDY2N0MzLjY0NjMxIDE5LjA2NjcgMi43NDgwNyAxOC4xNzcxIDIuNzQ4MDcgMTcuMDc4OVYxNy4wMTA4QzIuNzQ4MDcgMTYuNTY4MiAyLjgxNjgzIDE2LjEyNTUgMi45NzE1NiAxNS43MTI2Wk0xOC4xMjU3IDEwLjY2ODhDMTcuMDcyNyAxMC4wNzI5IDE2Ljg3NSA4LjQ2ODI1IDE3LjY4NzMgNy4wODkxOEMxOC40OTk2IDUuNzEwMTEgMjAuMDA4MSA1LjA3NTkxIDIxLjA2MTEgNS42NzE4QzIyLjExNDEgNi4yNjc3IDIyLjMxMTggNy44NzIzNiAyMS40OTk1IDkuMjUxNDNDMjAuNjg3MiAxMC42MzA1IDE5LjE3ODcgMTEuMjY0NyAxOC4xMjU3IDEwLjY2ODhaTTEzLjMyNSA2LjcxMDM2QzExLjkzNjggNi4yNTkxOSAxMS4zMDkzIDQuNDE2MTcgMTEuOTIzOSAyLjU5MDE4QzEyLjUzODUgMC43NjQxODYgMTQuMTYzMSAtMC4zNTA5ODkgMTUuNTUxMyAwLjEwMDE4OUMxNi45Mzk1IDAuNTUxMzY2IDE3LjU2NyAyLjM5NDM4IDE2Ljk1MjQgNC4yMjAzOEMxNi4zMzc4IDYuMDQ2MzcgMTQuNzEzMiA3LjE2MTU0IDEzLjMyNSA2LjcxMDM2WiIgZmlsbD0iIzI1ODA3QSIvPgo8L3N2Zz4K';

  return (
    <div style={{ marginTop: '10px' }}>
      <GoogleMap
        ref={mapRef}
        mapContainerStyle={mapStyles}
        center={mapCenter}
        options={mapOptions}
        onLoad={handleMapLoad}>
        {businesses.map((business, index) => (
          <Marker
            key={index}
            position={{
              lat: parseFloat(business.coordinates.latitude),
              lng: parseFloat(business.coordinates.longitude),
            }}
            onClick={() => handleMarkerClick(business)}
            icon={{
              url: pawIconURI,
              scaledSize: new window.google.maps.Size(22, 19),
            }}
          />
        ))}
      </GoogleMap>

      {isModalOpen && (
        <BusinessModal>
          <BusinessPreview
            business={selectedBusiness}
            saveBookmark={saveBookmark}
            deleteBookmark={deleteBookmark}
            bookmark={bookmark}
            formatNumber={formatNumber}
          />
          <div className="preview-btn-container" style={previewBtnStyles}>
            <button onClick={() => handleItemClick(selectedBusiness)}>
              View Details
            </button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </BusinessModal>
      )}
    </div>
  );
};

export default MapView;
