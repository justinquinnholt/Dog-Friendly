import { useState } from 'react';
import './Header.css';
import logo from '../images/logo.png';
import { BsList } from 'react-icons/bs';
import MenuItems from './MenuItems';

const Header = ({ isLoggedIn }) => {
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
        <ul className={`menu-horizontal`}>
          <MenuItems isLoggedIn={isLoggedIn} />
        </ul>
        <div className="menu-icon" onClick={handleToggle}>
          {!open && <BsList className="bslist-icon" />}
        </div>
      </div>
      {open && <div className="shade" onClick={handleToggle}></div>}
      <ul
        className={`menu-vertical ${open ? 'open' : ''}`}
        onClick={handleToggle}>
        <MenuItems isLoggedIn={isLoggedIn} />
      </ul>
    </div>
  );
};

export default Header;
