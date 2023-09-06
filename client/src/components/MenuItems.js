import React from 'react';
import { Link } from 'react-router-dom';
import { FaDog } from 'react-icons/fa6';

const MenuItems = ({ isLoggedIn }) => {
  return (
    <>
      <li>
        <Link className="title" to="/">
          <FaDog className="dog-icon" />
          Search
        </Link>
      </li>
      <li>
        <Link className="title" to="/bookmark">
          <FaDog className="dog-icon" />
          Bookmarks
        </Link>
      </li>
      <li>
        <Link className="title" to="/service">
          <FaDog className="dog-icon" />
          Pet services
        </Link>
      </li>
      {isLoggedIn ? (
        <li>
          <Link className="title" to="/profile">
            <FaDog className="dog-icon" />
            Account
          </Link>
        </li>
      ) : (
        <li>
          <Link className="title" to="/login">
            <FaDog className="dog-icon" />
            Login
          </Link>
        </li>
      )}
    </>
  );
};

export default MenuItems;
