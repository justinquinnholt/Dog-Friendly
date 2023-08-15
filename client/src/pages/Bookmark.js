import React from 'react';
import BusinessList from './BusinessList';
import BusinessListItem from '../components/BusinessListItem';
import './Bookmark.css';

const Bookmark = ({
  bookmarkList,
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
  selectedBusiness,
  setSelectedBusiness,
}) => {
  return (
    <div
      className={`bookmark-container ${
        bookmarkList.length === 0 ? 'none' : ''
      }`}>
      <div className="bookmark-container-inner">
        <div className="bookmark-heading">
          <h3>Bookmarks</h3>
        </div>
        {bookmarkList.length === 0 ? (
          <div className="bookmark-not-found">Bookmark not found</div>
        ) : (
          <BusinessList
            selectedBusiness={selectedBusiness}
            setSelectedBusiness={setSelectedBusiness}
            BusinessItemComponent={BusinessListItem}
            businesses={bookmarkList}
            useCustomMarker={true}
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
export default Bookmark;
