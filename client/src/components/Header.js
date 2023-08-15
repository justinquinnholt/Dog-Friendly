import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../images/logo.png';
import { BsList } from 'react-icons/bs';

const Header = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div className="header">
      <div className="header-inner">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="menu-icon" onClick={handleToggle}>
          {!open && <BsList className="bslist-icon" />}
        </div>
      </div>
      {open && <div className="shade" onClick={handleToggle}></div>}
      <ul
        className={open ? 'menu-items open' : 'menu-items'}
        onClick={handleToggle}>
        <li>
          <Link className="title" to="/">
            Search
          </Link>
        </li>
        <li>
          <Link className="title" to="/bookmark">
            Bookmarks
          </Link>
        </li>
        <li>
          <Link className="title" to="/service">
            Pet services
          </Link>
        </li>
        <li>
          <Link className="title" to="/login">
            Account
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
